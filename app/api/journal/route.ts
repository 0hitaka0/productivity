import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT } from '@/lib/auth-utils';

export async function GET(req: Request) {
    try {
        const token = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
        let userId: string | undefined;

        if (token) {
            const payload = await verifyJWT(token);
            if (payload?.userId) userId = payload.userId as string;
        }

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10');

        const entries = await prisma.journalEntry.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: { moodEntry: true }
        });

        return NextResponse.json({ entries });

    } catch (error) {
        console.error('Fetch entries error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
