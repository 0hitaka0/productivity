"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getTasks(userId?: string) {
    if (!userId) {
        const session = await getSession();
        if (!session?.user?.id) return { error: "Unauthorized", data: [] };
        userId = session.user.id;
    }

    try {
        const tasks = await db.task.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return { success: true, data: tasks };
    } catch (error) {
        return { error: "Failed to fetch tasks", data: [] };
    }
}

export async function createTask(data: {
    title: string;
    description?: string;
    userId: string;
    dueDate?: Date;
    priority?: string;
}) {
    try {
        const task = await db.task.create({
            data: {
                title: data.title,
                description: data.description,
                userId: data.userId,
                dueDate: data.dueDate,
                priority: data.priority,
                status: "todo",
            },
        });
        revalidatePath("/tasks");
        revalidatePath("/dashboard");
        return { success: true, data: task };
    } catch (error) {
        return { success: false, error: "Failed to create task" };
    }
}

export async function toggleTask(id: string, currentStatus: string) {
    try {
        const newStatus = currentStatus === "done" ? "todo" : "done";
        const completedAt = newStatus === "done" ? new Date() : null;

        const task = await db.task.update({
            where: { id },
            data: {
                status: newStatus,
                completedAt,
            },
        });
        revalidatePath("/tasks");
        revalidatePath("/dashboard");
        return { success: true, data: task };
    } catch (error) {
        return { success: false, error: "Failed to update task" };
    }
}

export async function deleteTask(id: string) {
    try {
        await db.task.delete({
            where: { id },
        });
        revalidatePath("/tasks");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete task" };
    }
}
