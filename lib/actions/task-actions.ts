'use server';

import { prisma } from '@/lib/db';
import { getAuthenticatedUserId } from '@/lib/actions/habit-actions';
import { revalidatePath } from 'next/cache';

export async function getDailyTasks() {
    const userId = await getAuthenticatedUserId();
    if (!userId) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
        const tasks = await prisma.task.findMany({
            where: {
                userId,
                status: { not: 'archived' },
                OR: [
                    { dueDate: { gte: today, lt: tomorrow } }, // Due today
                    { status: 'in_progress' } // Or in progress
                ]
            },
            orderBy: [
                { priority: 'desc' },
                { dueDate: 'asc' }
            ],
            take: 5
        });
        return tasks;
    } catch (error) {
        console.error("Failed to fetch daily tasks:", error);
        return [];
    }
}
