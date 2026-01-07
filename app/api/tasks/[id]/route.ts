import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth-utils';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(req);
        if (!auth) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;

        const task = await prisma.task.findUnique({
            where: {
                id,
                userId: auth.id // Ensure ownership
            },
            include: {
                tags: true,
                subtasks: true
            }
        });

        if (!task) {
            return new NextResponse('Task not found', { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error('[TASK_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(req);
        if (!auth) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const {
            title,
            description,
            status,
            priority,
            order,
            dueDate,
            isRecurring,
            recurrenceRule,
            tags,
            subtasks // Destructure subtasks
        } = body;

        // Verify ownership first
        const existingTask = await prisma.task.findUnique({
            where: { id, userId: auth.id }
        });

        if (!existingTask) {
            return new NextResponse('Task not found', { status: 404 });
        }

        // Prepare subtask updates if provided
        let subtasksUpdate: any = undefined;
        if (subtasks && Array.isArray(subtasks)) {
            const incomingIds = subtasks.map((s: any) => s.id);
            subtasksUpdate = {
                deleteMany: {
                    id: { notIn: incomingIds }
                },
                upsert: subtasks.map((s: any) => ({
                    where: { id: s.id },
                    create: {
                        id: s.id, // Use client-provided ID
                        title: s.title || '',
                        status: s.status || 'todo',
                        userId: auth.id, // Inherit user
                    },
                    update: {
                        title: s.title,
                        status: s.status
                    }
                }))
            };
        }

        const task = await prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                status,
                priority,
                order,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                isRecurring,
                recurrenceRule,
                tags: tags ? {
                    // Update tags: disconnect old, set new
                    set: [],
                    connectOrCreate: tags.map((t: string) => ({
                        where: { userId_name: { userId: auth.id, name: t } },
                        create: { userId: auth.id, name: t }
                    }))
                } : undefined,
                subtasks: subtasksUpdate // Apply subtask updates
            },
            include: {
                tags: true,
                subtasks: true // Return updated subtasks
            }
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error('[TASK_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(req);
        if (!auth) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;

        // Ensure ownership
        const existingTask = await prisma.task.findUnique({
            where: { id, userId: auth.id }
        });

        if (!existingTask) {
            return new NextResponse('Task not found', { status: 404 });
        }

        await prisma.task.delete({
            where: { id }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[TASK_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
