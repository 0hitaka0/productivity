"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function updateUserMBTI(mbtiType: string) {
    const session = await getSession();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: { mbtiType }
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to update MBTI:", error);
        return { success: false, error: "Failed to update MBTI type" };
    }
}

export async function getUserMBTI() {
    const session = await getSession();

    if (!session?.user?.id) {
        return { success: false, data: null };
    }

    try {
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { mbtiType: true }
        });
        return { success: true, data: user?.mbtiType };
    } catch (error) {
        console.error("Failed to fetch MBTI:", error);
        return { success: false, error: "Failed to fetch MBTI type" };
    }
}
