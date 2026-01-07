"use client";

import { useState } from "react";
import { Plus, Check, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { createTask, toggleTask, deleteTask } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Task } from "@prisma/client";

interface TaskListProps {
    initialTasks: Task[];
    userId: string;
}

export function TaskList({ initialTasks, userId }: TaskListProps) {
    const [tasks, setTasks] = useState(initialTasks);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Optimistic updates could be added here, but for now relying on server revalidation prop update
    // Actually, since this is a client component receiving props from a server component that revalidates,
    // we should sync state with props or use router.refresh(). 
    // But cleaner is to let parent pass updated data. 
    // However, Server Actions revalidatePath re-renders the server component, sending new props.
    // So we just need to update state when props change.
    // actually, typical pattern: useOptimistic or just simple internal state that gets overwritten.

    // Improving simple approach:
    // When props change (revalidation), update state.

    /* 
       NOTE: In a real "production" app I would use useOptimistic, 
       but for this iteration I will simple trigger the action and let Next.js 
       refresh the route (revalidatePath) which updates `initialTasks`.
       So I should useEffect to sync props to state or just use props directly if I wasn't doing local optimism.
       Let's simpler: Just use props directly? No, I need fast feedback.
       Mixed approach: Local state that I update manually + server action.
    */

    // Update local state when props change (server revalidation)
    if (initialTasks !== tasks) {
        setTasks(initialTasks);
    }

    async function handleCreate() {
        if (!newTaskTitle.trim()) return;

        // Optimistic add (optional, skipping for simplicity/safety first)
        const res = await createTask({ title: newTaskTitle, userId });

        if (res.success) {
            setNewTaskTitle("");
            setIsDialogOpen(false);
        }
    }

    async function handleToggle(id: string, status: string) {
        // Optimistic toggle
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, status: status === "done" ? "todo" : "done" } : t
        ));
        await toggleTask(id, status);
    }

    async function handleDelete(id: string) {
        setTasks(prev => prev.filter(t => t.id !== id));
        await deleteTask(id);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-light text-midnight-900 dark:text-cream-50">Tasks</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2 bg-midnight-900 text-cream-50 hover:bg-midnight-800 dark:bg-cream-50 dark:text-midnight-900">
                            <Plus className="h-4 w-4" />
                            Add Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Task</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <Input
                                placeholder="What needs to be done?"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                                autoFocus
                            />
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate}>Create Task</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-2">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={cn(
                            "group flex items-center gap-3 rounded-lg border border-transparent bg-white/5 p-3 transition-all duration-300 hover:bg-white/10 hover:border-purple-500/20",
                            task.status === "done" && "opacity-50"
                        )}
                    >
                        <Checkbox
                            checked={task.status === "done"}
                            onCheckedChange={() => handleToggle(task.id, task.status)}
                            className="border-slate-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                        />
                        <span
                            className={cn(
                                "flex-1 text-sm text-slate-300 transition-all font-light",
                                task.status === "done" && "text-slate-600 line-through"
                            )}
                        >
                            {task.title}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-600 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-900/10"
                            onClick={() => handleDelete(task.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="text-center py-10 text-slate-600 font-light italic">
                        No tasks yet. Enjoy the void.
                    </div>
                )}
            </div>
        </div>
    );
}
