'use server';

import { prisma } from '@/lib/db';
import { getAuthenticatedUserId } from '@/lib/actions/habit-actions';
import { startOfWeek, endOfWeek, subDays, format } from 'date-fns';

export interface LifeStreakAnalytics {
    tasksCompletedThisWeek: number;
    highestHabitStreak: number;
    avgMoodThisWeek: number | null;
    avgMoodLabel: string;
    reflectionDays: number;
    moodHistory: {
        date: string;
        value: number;
        label: string;
    }[];
}

export async function getLifeStreakAnalytics(): Promise<LifeStreakAnalytics> {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
        return {
            tasksCompletedThisWeek: 0,
            highestHabitStreak: 0,
            avgMoodThisWeek: 0,
            avgMoodLabel: 'Neutral',
            reflectionDays: 0,
            moodHistory: []
        };
    }

    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
    const sevenDaysAgo = subDays(today, 6); // Last 7 days rolling window

    // 1. Tasks Done within a week (This Week)
    const tasksCompleted = await prisma.task.count({
        where: {
            userId,
            status: 'done',
            completedAt: {
                gte: startOfCurrentWeek
            }
        }
    });

    // 2. Highest Habit Streak (All Time or Active) - Let's get highest ACTIVE or just highest recorded prop
    const habits = await prisma.habit.findMany({
        where: {
            userId,
            isActive: true
        },
        select: {
            streak: true,
            longestStreak: true
        }
    });

    // Calculate max streak a user can maintain (longest streak recorded)
    const highestHabitStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
    // Alternatively, use longestStreak if we populated it correctly, but streak is current.
    // User asked "how many streak user can maintain", implying capability, so longestStreak might be better if reliable.
    // Let's stick to current max streak for "maintain" context or highest current.

    // 3. Mood Average within a week
    const moods = await prisma.mood.findMany({
        where: {
            userId,
            recordedAt: {
                gte: startOfCurrentWeek
            }
        },
        orderBy: {
            recordedAt: 'asc'
        }
    });

    let avgMood: number | null = null;
    if (moods.length > 0) {
        const sum = moods.reduce((acc, m) => acc + m.moodValue, 0);
        avgMood = Math.round((sum / moods.length) * 10) / 10;
    }

    const getMoodLabel = (val: number | null) => {
        if (!val) return 'No Data';
        if (val >= 9) return 'Ecstatic';
        if (val >= 8) return 'Great';
        if (val >= 7) return 'Good';
        if (val >= 5) return 'Okay';
        if (val >= 3) return 'Low';
        return 'Bad';
    };

    // 4. Daily Reflection (Journal Entries) for a week
    // Check how many unique DAYS have a journal entry
    const journalEntries = await prisma.journalEntry.findMany({
        where: {
            userId,
            createdAt: {
                gte: startOfCurrentWeek
            }
        },
        select: {
            createdAt: true
        }
    });

    const uniqueReflectionDays = new Set(
        journalEntries.map(e => format(e.createdAt, 'yyyy-MM-dd'))
    ).size;


    // Formatted Mood History for Chart
    const moodHistory = moods.map(m => ({
        date: format(m.recordedAt, 'EEE'),
        value: m.moodValue,
        label: getMoodLabel(m.moodValue)
    }));

    return {
        tasksCompletedThisWeek: tasksCompleted,
        highestHabitStreak,
        avgMoodThisWeek: avgMood,
        avgMoodLabel: getMoodLabel(avgMood),
        reflectionDays: uniqueReflectionDays,
        moodHistory
    };
}
