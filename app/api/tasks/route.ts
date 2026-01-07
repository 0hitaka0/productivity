import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth-utils';
import { auth } from '@/auth';
import { type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        // 1. NextAuth Session Check
        const session = await auth();
        let userId = session?.user?.id;
        console.log('[API] GET /tasks - Session UserID:', userId);

        // 2. Custom Token Fallback
        if (!userId) {
            const tokenAuth = await verifyAuth(req);
            userId = tokenAuth?.id;
            console.log('[API] GET /tasks - Token UserID:', userId);
        }

        // Debug: Log cookies if still unauthorized
        if (!userId) {
            const cookieHeader = req.headers.get('cookie');
            console.log('[API] GET /tasks - No UserID. Cookies:', cookieHeader ? 'Present' : 'Missing');
        }

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const where: any = {
            userId: userId,
        };

        if (status) {
            where.status = status;
        } else {
            where.status = { not: 'archived' };
        }

        const tasks = await prisma.task.findMany({
            where,
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ],
            include: {
                tags: true,
                subtasks: true,
            }
        });

        return NextResponse.json(tasks);
    } catch (error) {
        console.error('[TASKS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        // 1. NextAuth Session Check
        const session = await auth();
        let userId = session?.user?.id;
        console.log('[API] POST /tasks - Session UserID:', userId);

        // 2. Custom Token Fallback
        if (!userId) {
            const tokenAuth = await verifyAuth(req);
            userId = tokenAuth?.id;
            console.log('[API] POST /tasks - Token UserID:', userId);
        }

        if (!userId) {
            const cookieHeader = req.headers.get('cookie');
            console.log('[API] POST /tasks - No UserID. Cookies:', cookieHeader ? 'Present' : 'Missing');
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const {
            title,
            description,
            priority,
            dueDate,
            parentId,
            status,
            tags,
            subtasks,
            estimatedDuration,
            reminders,
            projectId
        } = body;

        if (!title) {
            return new NextResponse('Title is required', { status: 400 });
        }

        const properties: any = {};
        if (reminders) properties.reminders = reminders;

        const task = await prisma.task.create({
            data: {
                userId: userId,
                title,
                description,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                parentId,
                status: status || 'todo',
                estimatedDuration: estimatedDuration || null,
                category: projectId || null,
                properties: Object.keys(properties).length > 0 ? properties : undefined,
                tags: {
                    connectOrCreate: tags?.map((t: string) => ({
                        where: { userId_name: { userId: userId, name: t } },
                        create: { userId: userId, name: t }
                    }))
                },
                subtasks: subtasks && subtasks.length > 0 ? {
                    create: subtasks.map((s: any) => ({
                        userId: userId,
                        title: s.title,
                        status: s.completed ? 'done' : 'todo',
                        isRecurring: false,
                        estimatedDuration: 15
                    }))
                } : undefined
            },
            include: {
                tags: true,
                subtasks: true
            }
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error('[TASKS_POST]', error);
        return new NextResponse(error instanceof Error ? error.message : 'Internal Server Error', { status: 500 });
    }
}
