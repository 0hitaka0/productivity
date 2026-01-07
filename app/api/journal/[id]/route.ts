import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT } from '@/lib/auth-utils';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const token = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
        let userId: string | undefined;

        if (token) {
            const payload = await verifyJWT(token);
            if (payload?.userId) userId = payload.userId as string;
        }

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const entry = await prisma.journalEntry.findUnique({
            where: {
                id: id,
                userId // Ensure ownership
            },
            include: { moodEntry: true }
        });

        if (!entry) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(entry);

    } catch (error) {
        console.error('Fetch entry error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const token = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
        let userId: string | undefined;

        if (token) {
            const payload = await verifyJWT(token);
            if (payload?.userId) userId = payload.userId as string;
        }

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.journalEntry.delete({
            where: {
                id: id,
                userId // Ensure ownership
            }
        });

        return NextResponse.json({ message: 'Deleted successfully' });

    } catch (error) {
        console.error('Delete entry error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
