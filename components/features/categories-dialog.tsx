"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, FolderOpen } from "lucide-react";
import { createCategory, getCategories, deleteCategory } from "@/actions/categories";
import { useMBTI } from "@/components/providers/mbti-provider";

export function CategoriesDialog() {
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const { profile } = useMBTI();

    async function fetchCategories() {
        const res = await getCategories();
        if (res.success) {
            setCategories(res.data);
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    async function handleCreate() {
        if (!newCategory.trim()) return;
        const res = await createCategory({ name: newCategory });
        if (res.success) {
            setCategories([...categories, res.data]);
            setNewCategory("");
        }
    }

    async function handleDelete(id: string) {
        if (confirm("Delete this category?")) {
            await deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 bg-white/5 border-white/10 text-slate-400 hover:text-white">
                    <FolderOpen className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-slate-300 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-light">Manage Categories</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex gap-2">
                        <Input
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="New category name..."
                            className="bg-white/5 border-purple-500/20 text-white"
                        />
                        <Button onClick={handleCreate} style={{ backgroundColor: profile.theme.primary, color: 'black' }}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {categories.length === 0 && (
                            <p className="text-center text-sm text-slate-600 py-4 italic">No categories yet.</p>
                        )}
                        {categories.map((cat) => (
                            <div key={cat.id} className="flex items-center justify-between p-2 rounded bg-white/5">
                                <span className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                    {cat.name}
                                </span>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id)} className="text-red-500 hover:bg-red-900/10 hover:text-red-400">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
