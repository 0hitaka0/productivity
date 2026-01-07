"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getCategories() {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized", data: [] };

    try {
        const categories = await db.category.findMany({
            where: { userId: session.user.id },
            orderBy: { name: "asc" },
        });
        return { success: true, data: categories };
    } catch (error) {
        return { error: "Failed to fetch categories", data: [] };
    }
}

export async function createCategory(data: { name: string; color?: string; icon?: string }) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        const category = await db.category.create({
            data: {
                userId: session.user.id,
                name: data.name,
                color: data.color || "#a855f7",
                icon: data.icon,
            },
        });
        revalidatePath("/journal");
        return { success: true, data: category };
    } catch (error) {
        return { error: "Failed to create category" };
    }
}

export async function deleteCategory(id: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await db.category.delete({
            where: { id, userId: session.user.id },
        });
        revalidatePath("/journal");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete category" };
    }
}
