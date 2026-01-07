'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth-utils';

// --- Types ---
export interface CreateHabitData {
    name: string;
    description?: string;
    motivation?: string;
    frequency: string;
    targetDays: string[]; // e.g., ["mon", "wed"]
    timeOfDay?: string;
    goalType?: string;
    goalTarget?: number;
    goalUnit?: string;
    category?: string;
    color?: string;
    icon?: string;
}

export interface UpdateHabitData extends Partial<CreateHabitData> {
    id: string;
    isActive?: boolean;
}

// --- Helper: Centralized Auth Check ---
export async function getAuthenticatedUserId(): Promise<string | undefined> {
    try {
        // 1. Try NextAuth
        const session = await auth();
        if (session?.user?.id) {
            console.log('[Auth] Found NextAuth session user:', session.user.id);
            return session.user.id;
        }

        // 2. Try Custom JWT from Cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (token) {
            const payload = await verifyJWT(token);
            if (payload?.userId) {
                console.log('[Auth] Verified JWT token for user:', payload.userId);
                return payload.userId as string;
            } else {
                console.warn('[Auth] Token present but verification failed or missing userId');
            }
        } else {
            console.warn('[Auth] No auth-token cookie found');
        }

    } catch (error) {
        console.error('[Auth] Error during authentication check:', error);
    }
    return undefined;
}

// --- Actions ---

export async function getHabits() {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
        console.warn('getHabits: Unauthorized access attempt');
        return [];
    }

    try {
        const habits = await prisma.habit.findMany({
            where: {
                userId,
                isActive: true
            },
            include: {
                logs: {
                    orderBy: { date: 'desc' },
                    take: 7 // Only need the last few for immediate display
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate Streak Manually to ensure accuracy on read? 
        // Or trust the stored 'streak' field. For now, trust stored to be fast.
        return habits;
    } catch (error) {
        console.error("Failed to fetch habits:", error);
        return [];
    }
}

export async function createHabit(data: CreateHabitData) {
    try {
        const userId = await getAuthenticatedUserId();
        if (!userId) throw new Error("Unauthorized: Please sign in again.");

        const habit = await prisma.habit.create({
            data: {
                userId,
                name: data.name,
                description: data.description,
                // @ts-ignore
                motivation: data.motivation,
                frequency: data.frequency,
                targetDays: JSON.stringify(data.targetDays),
                timeOfDay: data.timeOfDay || 'anytime',
                goalType: data.goalType || 'simple',
                goalTarget: data.goalTarget,
                goalUnit: data.goalUnit,
                category: data.category,
                color: data.color,
                icon: data.icon,
                streak: 0
            }
        });

        revalidatePath('/habits');
        revalidatePath('/dashboard');
        return { success: true, habit };
    } catch (error: any) {
        console.error("Failed to create habit:", error);
        return { success: false, error: error.message || "Failed to create habit" };
    }
}

export async function updateHabit(data: UpdateHabitData) {
    const userId = await getAuthenticatedUserId();
    if (!userId) throw new Error("Unauthorized");

    try {
        const updateData: any = { ...data };
        if (data.targetDays) updateData.targetDays = JSON.stringify(data.targetDays);
        delete updateData.id;

        const habit = await prisma.habit.update({
            where: { id: data.id, userId },
            data: updateData
        });

        revalidatePath('/habits');
        return { success: true, habit };
    } catch (error) {
        console.error("Failed to update habit:", error);
        return { success: false, error: "Failed to update habit" };
    }
}

export async function deleteHabit(id: string) {
    try {
        const userId = await getAuthenticatedUserId();
        if (!userId) throw new Error("Unauthorized");

        // Verify ownership
        const existing = await prisma.habit.findUnique({ where: { id } });
        if (!existing || existing.userId !== userId) throw new Error("Unauthorized");

        await prisma.habit.update({
            where: { id, userId },
            data: { isActive: false }
        });

        revalidatePath('/habits');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete habit" };
    }
}


export async function toggleHabitCompletion(habitId: string, date: Date) {
    const userId = await getAuthenticatedUserId();
    if (!userId) throw new Error("Unauthorized");

    // Normalize date to YYYY-MM-DD
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    try {
        const existingLog = await prisma.habitLog.findFirst({
            where: {
                habitId,
                // @ts-ignore
                date: normalizedDate
            }
        });

        if (existingLog) {
            // Check current status
            if (existingLog.status === 'skipped') {
                // If skipped, update to completed (or delete? let's assume toggle means 'do it')
                await prisma.habitLog.update({
                    where: { id: existingLog.id },
                    data: { status: 'completed' }
                });
            } else {
                // Toggle off
                await prisma.habitLog.delete({ where: { id: existingLog.id } });
            }
            await recalculateStreak(habitId);
        } else {
            // Toggle on
            await prisma.habitLog.create({
                data: {
                    habitId,
                    // @ts-ignore
                    date: normalizedDate,
                    status: 'completed'
                }
            });
            await recalculateStreak(habitId);
        }

        revalidatePath('/habits');
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle habit:", error);
        return { success: false, error: "Failed to update habit" };
    }
}

export async function skipHabit(habitId: string, date: Date) {
    const userId = await getAuthenticatedUserId();
    if (!userId) throw new Error("Unauthorized");

    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    try {
        const existingLog = await prisma.habitLog.findFirst({
            where: {
                habitId,
                // @ts-ignore
                date: normalizedDate
            }
        });

        if (existingLog) {
            // Update to skipped
            await prisma.habitLog.update({
                where: { id: existingLog.id },
                data: { status: 'skipped' }
            });
        } else {
            // Create skipped log
            await prisma.habitLog.create({
                data: {
                    habitId,
                    // @ts-ignore
                    date: normalizedDate,
                    status: 'skipped'
                }
            });
        }

        // We probably shouldn't recalculate streak here unless we change streak logic
        // But revalidating path is key
        revalidatePath('/habits');
        return { success: true };
    } catch (error) {
        console.error("Failed to skip habit:", error);
        return { success: false, error: "Failed to skip habit" };
    }
}

// Helper to recalculate streaks
async function recalculateStreak(habitId: string) {
    const logs = await prisma.habitLog.findMany({
        where: {
            habitId,
            // @ts-ignore
            status: 'completed'
        },
        // @ts-ignore
        orderBy: { date: 'desc' }
    });

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if today is completed
    let currentDate = new Date(today);

    // If we haven't done it today, we check if we did it yesterday to continue streak
    // If we DID do it today, streak starts from today
    // To simplify: we just count backwards from "latest valid streak day"

    // BUT, simple streak logic:
    // 1. Check if today or yesterday exists. If neither, streak is 0.
    const hasToday = logs.some((l: any) => new Date(l.date).getTime() === today.getTime());

    // If not today, check yesterday
    if (!hasToday) {
        currentDate.setDate(currentDate.getDate() - 1);
        const hasYesterday = logs.some((l: any) => new Date(l.date).getTime() === currentDate.getTime());
        if (!hasYesterday) {
            streak = 0; // Streak broken
            // But we must check if we are just "viewing" and not checking?
            // Actually, if we just toggled, the state is known.
            // If we toggled OFF today, and had yesterday, streak is correct.
        }
    }

    // Iterate backwards
    while (true) {
        const targetTime = currentDate.getTime();
        const log = logs.find((l: any) => new Date(l.date).getTime() === targetTime);
        if (log) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    await prisma.habit.update({
        where: { id: habitId },
        data: { streak }
    });
}
