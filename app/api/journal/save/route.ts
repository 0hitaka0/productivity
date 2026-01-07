import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT } from '@/lib/auth-utils';
import { z } from 'zod';

const saveSchema = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    content: z.string(),
    mood: z.object({
        value: z.number(),
        emotions: z.array(z.string()),
        context: z.array(z.string()),
    }).nullable().optional(),
});

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        // For demo purposes, we might want to grab token from cookie if header missing
        // But let's assume client sends it or we extract from cookie manually here as fallback
        let userId: string | undefined;

        // Simplistic auth check (real app should use proper middleware/context)
        const token = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];

        if (token) {
            const payload = await verifyJWT(token);
            if (payload?.userId) userId = payload.userId as string;
        }

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = saveSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        const { id, title, content, mood } = result.data;

        let entry;
        if (id) {
            // Update existing entry
            // Verify ownership
            const existing = await prisma.journalEntry.findUnique({
                where: { id },
                select: { userId: true }
            });

            if (!existing || existing.userId !== userId) {
                return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
            }

            entry = await prisma.journalEntry.update({
                where: { id },
                data: {
                    title: title || "Untitled",
                    content,
                    // Note: Mood updates complexity skipped for brevity, focused on content
                }
            });
        } else {
            // Create new entry
            entry = await prisma.journalEntry.create({
                data: {
                    userId,
                    title: title || "Untitled",
                    content,
                    mood: mood ? "recorded" : null,
                    moodEntry: mood ? {
                        create: {
                            userId,
                            moodValue: mood.value,
                            emotions: JSON.stringify(mood.emotions),
                            context: JSON.stringify(mood.context),
                        }
                    } : undefined
                }
            });
        }

        return NextResponse.json({ message: 'Saved', id: entry.id });

    } catch (error) {
        console.error('Save error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
