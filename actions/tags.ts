"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getTags(query?: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized", data: [] };

    try {
        const tags = await db.tag.findMany({
            where: {
                userId: session.user.id,
                name: query ? { contains: query } : undefined
            },
            orderBy: { name: "asc" },
            take: 20 // Limit suggestions
        });
        return { success: true, data: tags };
    } catch (error) {
        return { error: "Failed to fetch tags", data: [] };
    }
}

export async function createTag(name: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const tagName = name.trim().toLowerCase();
    if (!tagName) return { error: "Invalid name" };

    try {
        const tag = await db.tag.upsert({
            where: {
                userId_name: {
                    userId: session.user.id,
                    name: tagName
                }
            },
            update: {},
            create: {
                userId: session.user.id,
                name: tagName
            }
        });
        revalidatePath("/journal");
        return { success: true, data: tag };
    } catch (error) {
        return { error: "Failed to create tag" };
    }
}
