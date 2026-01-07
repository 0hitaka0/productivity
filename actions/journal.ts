"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getEntries(userId: string, options: { includeDeleted?: boolean, onlyDeleted?: boolean } = {}) {
    if (!userId) return { success: false, data: [] };

    const { includeDeleted, onlyDeleted } = options;

    try {
        const where: any = { userId };

        if (onlyDeleted) {
            where.deletedAt = { not: null };
        } else if (!includeDeleted) {
            where.deletedAt = null;
        }
        // if includeDeleted is true and onlyDeleted is false, we don't filter deletedAt (return all)

        const entries = await db.journalEntry.findMany({
            where,
            include: { category: true, tags: true },
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data: entries };
    } catch (error) {
        return { error: "Failed to fetch entries", data: [] };
    }
}

export async function createEntry(data: {
    userId: string;
    title?: string;
    content: string;
    mood?: string;
    categoryId?: string;
    tagIds?: string[];
}) {
    try {
        const entry = await db.journalEntry.create({
            data: {
                userId: data.userId,
                title: data.title,
                content: data.content,
                mood: data.mood,
                categoryId: data.categoryId,
                tags: data.tagIds ? {
                    connect: data.tagIds.map(id => ({ id }))
                } : undefined
            },
            include: { category: true, tags: true }
        });
        revalidatePath("/journal");
        return { success: true, data: entry };
    } catch (error) {
        return { success: false, error: "Failed to create entry" };
    }
}

export async function updateEntry(id: string, data: {
    title?: string;
    content?: string;
    mood?: string;
    categoryId?: string;
    tagIds?: string[];
}) {
    try {
        // Prepare data object
        const updateData: any = { ...data };
        delete updateData.tagIds; // Handle tags separately in relation

        const entry = await db.journalEntry.update({
            where: { id },
            data: {
                ...updateData,
                tags: data.tagIds ? {
                    set: data.tagIds.map(id => ({ id }))
                } : undefined
            },
            include: { category: true, tags: true }
        });
        revalidatePath("/journal");
        return { success: true, data: entry };
    } catch (error) {
        return { success: false, error: "Failed to update entry" };
    }
}

export async function deleteEntry(id: string) {
    try {
        await db.journalEntry.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        revalidatePath("/journal");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete entry" };
    }
}

export async function restoreEntry(id: string) {
    try {
        await db.journalEntry.update({
            where: { id },
            data: { deletedAt: null }
        });
        revalidatePath("/journal");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to restore entry" };
    }
}

export async function permanentDeleteEntry(id: string) {
    try {
        await db.journalEntry.delete({
            where: { id }
        });
        revalidatePath("/journal");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to permanently delete entry" };
    }
}
