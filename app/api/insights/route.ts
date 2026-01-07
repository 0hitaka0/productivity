import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT } from '@/lib/auth-utils';
import { startOfMonth, subDays, format } from 'date-fns';

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        // Simplified auth check again
        let userId: string | undefined;
        const token = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];

        if (token) {
            const payload = await verifyJWT(token);
            if (payload?.userId) userId = payload.userId as string;
        }

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch last 30 days of mood data
        const thirtyDaysAgo = subDays(new Date(), 30);
        const [moods, totalEntries] = await Promise.all([
            prisma.mood.findMany({
                where: {
                    userId,
                    recordedAt: {
                        gte: thirtyDaysAgo
                    }
                },
                orderBy: { recordedAt: 'asc' },
                select: {
                    moodValue: true,
                    emotions: true,
                    recordedAt: true,
                }
            }),
            prisma.journalEntry.count({
                where: { userId }
            })
        ]);

        // Calculate Stats
        const totalMoods = moods.length;
        const avgMood = totalMoods > 0 ? moods.reduce((acc, m) => acc + m.moodValue, 0) / totalMoods : 0;

        // Emotion Distribution
        const emotionCounts: Record<string, number> = {};
        moods.forEach(m => {
            try {
                const ems = JSON.parse(m.emotions);
                if (Array.isArray(ems)) {
                    ems.forEach((e: string) => {
                        emotionCounts[e] = (emotionCounts[e] || 0) + 1;
                    });
                }
            } catch (e) {
                // ignore parse error
            }
        });

        const topEmotions = Object.entries(emotionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        // Format for Charts
        const history = moods.map(m => ({
            date: format(m.recordedAt, 'MMM dd'),
            value: m.moodValue,
        }));

        return NextResponse.json({
            stats: {
                average: avgMood.toFixed(1),
                totalEntries, // Now uses actual journal count
                streak: 0,
            },
            history,
            topEmotions
        });

    } catch (error) {
        console.error('Insights error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
