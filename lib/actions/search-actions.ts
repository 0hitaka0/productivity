'use server';

import { prisma } from '@/lib/db';
import { getAuthenticatedUserId } from '@/lib/actions/habit-actions';

export type SearchResults = {
    journals: any[];
    habits: any[];
    tasks: any[];
};

export async function searchAll(query: string): Promise<SearchResults> {
    const userId = await getAuthenticatedUserId();
    if (!userId || !query || query.length < 2) {
        return { journals: [], habits: [], tasks: [] };
    }

    const [journals, habits, tasks] = await Promise.all([
        prisma.journalEntry.findMany({
            where: {
                userId,
                OR: [
                    { title: { contains: query } },
                    { content: { contains: query } }
                ]
            },
            take: 5,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.habit.findMany({
            where: {
                userId,
                isActive: true,
                OR: [
                    { name: { contains: query } },
                    { motivation: { contains: query } }
                ]
            },
            take: 5
        }),
        prisma.task.findMany({
            where: {
                userId,
                OR: [
                    { title: { contains: query } },
                    { description: { contains: query } }
                ]
            },
            take: 5
        })
    ]);

    return { journals, habits, tasks };
}
