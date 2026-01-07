"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Circle, Plus, MoreVertical, ChevronRight, Trash2, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Task } from './task-card';
import { DatePicker, PriorityPicker, DurationPicker, CategoryPicker, PriorityLevel } from './pickers';
import { format } from 'date-fns';
import { Particles } from '@/components/ui/particles';

interface TaskDetailPanelProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (taskId: string, updates: Partial<Task>) => void;
    onDelete: (taskId: string) => void;
}

export function TaskDetailPanel({ task, isOpen, onClose, onUpdate, onDelete }: TaskDetailPanelProps) {
    // Local state for debounced fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subtasks, setSubtasks] = useState<{ id: string; title: string, status: 'done' | 'todo' }[]>([]);

    // Track if we are editing text to prevent jitter from external updates
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDesc, setIsEditingDesc] = useState(false);

    // Initialize state when task changes
    useEffect(() => {
        if (task) {
            if (!isEditingTitle) setTitle(task.title);
            if (!isEditingDesc) setDescription(task.description || '');
            // Only update subtasks from props if IDs don't match or length diff (simple sync check)
            // Real-time collabs might need smarter merge, but for now this is fine.
            setSubtasks(task.subtasks || []);
        }
    }, [task, isEditingTitle, isEditingDesc]);

    // Handle keyboard escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Auto-save Title
    useEffect(() => {
        if (!task || !title || title === task.title) return;
        const timer = setTimeout(() => {
            onUpdate(task.id, { title });
        }, 1000);
        return () => clearTimeout(timer);
    }, [title, task, onUpdate]);

    // Auto-save Description
    useEffect(() => {
        if (!task || description === (task.description || '')) return;
        const timer = setTimeout(() => {
            onUpdate(task.id, { description });
        }, 1000);
        return () => clearTimeout(timer);
    }, [description, task, onUpdate]);

    if (!task) return null;

    // Derived state
    const completedSubtasksCount = subtasks.filter(s => s.status === 'done').length;
    const totalSubtasks = subtasks.length;
    const progress = totalSubtasks > 0 ? (completedSubtasksCount / totalSubtasks) * 100 : 0;
    const allSubtasksComplete = totalSubtasks > 0 && completedSubtasksCount === totalSubtasks;

    // Handlers
    const handleSubtaskToggle = (subtaskId: string) => {
        const updatedSubtasks = subtasks.map(s =>
            s.id === subtaskId ? { ...s, status: s.status === 'done' ? 'todo' : 'done' } as const : s
        );
        setSubtasks(updatedSubtasks);

        // Immediate save for toggles
        onUpdate(task.id, { subtasks: updatedSubtasks });

        // Smart Status Progression
        // If checking a task and status is todo, move to in_progress
        const subtask = subtasks.find(s => s.id === subtaskId);
        if (subtask?.status === 'todo' && task.status === 'todo') { // We just flipped it to done
            // Wait, logic is inverted because we map *before* check? 
            // actually updatedSubtasks has the new state.
            // If we just marked something done (was todo), check main status.
            onUpdate(task.id, { status: 'in_progress', subtasks: updatedSubtasks });
        } else {
            onUpdate(task.id, { subtasks: updatedSubtasks });
        }
    };

    const handleSubtaskChange = (id: string, newTitle: string) => {
        const updated = subtasks.map(s => s.id === id ? { ...s, title: newTitle } : s);
        setSubtasks(updated);
        // We debounce subtask title saves? Or just save on blur?
        // Let's debounce in a separate effect or just save on Blur for simplicity/perf.
        // Actually, let's just save on blur of the input to avoid too many writes.
    };

    const saveSubtasks = () => {
        onUpdate(task.id, { subtasks });
    };

    const handleAddSubtask = () => {
        const newSubtask = { id: crypto.randomUUID(), title: '', status: 'todo' as const };
        const updated = [...subtasks, newSubtask];
        setSubtasks(updated);
        onUpdate(task.id, { subtasks: updated });
    };

    // Quick Option Handlers (Immediate Save)
    const updateDate = (d: Date | null) => onUpdate(task.id, { dueDate: d || undefined });
    const updatePriority = (p: PriorityLevel) => onUpdate(task.id, { priority: p || 'medium' });
    const updateDuration = (d: number | null) => onUpdate(task.id, { duration: d || undefined });
    const updateCategory = (c: string) => onUpdate(task.id, { category: c });



    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                        className="fixed inset-0 m-auto h-[85vh] w-full max-w-[600px] border border-white/10 z-[101] flex flex-col overflow-hidden shadow-2xl rounded-3xl"
                        style={{
                            backgroundColor: 'rgba(15, 15, 35, 0.95)',
                            backdropFilter: 'blur(40px)',
                            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), 0 0 100px rgba(139, 92, 246, 0.3)'
                        }}
                    >
                        {/* Particles Background */}
                        <Particles />

                        {/* Header */}
                        <div className="relative z-10 flex items-center justify-between px-8 py-6 pb-2 shrink-0">
                            <div className="flex items-center gap-2 text-white/50 text-xs font-medium uppercase tracking-wider">
                                <span>Task Details</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="relative z-10 flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                            {/* Title & Checkbox */}
                            <div className="flex items-start gap-5">
                                <button
                                    onClick={() => onUpdate(task.id, { status: task.status === 'done' ? 'todo' : 'done' })}
                                    className={cn(
                                        "mt-2 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                        task.status === 'done'
                                            ? "bg-green-500 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                                            : "border-slate-500 hover:border-slate-300 hover:bg-white/5"
                                    )}
                                >
                                    {task.status === 'done' && <Check className="w-4 h-4 text-black font-bold" />}
                                </button>
                                <textarea
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onFocus={() => setIsEditingTitle(true)}
                                    onBlur={() => setIsEditingTitle(false)}
                                    placeholder="Task Title"
                                    className="flex-1 bg-transparent text-3xl font-bold text-white border-none focus:ring-0 resize-none p-0 leading-tight placeholder:text-slate-700"
                                    rows={Math.max(1, Math.ceil(title.length / 40))}
                                />
                            </div>

                            {/* Quick Options Row */}
                            <div className="flex flex-wrap gap-3 pl-12">
                                <DatePicker date={task.dueDate ? new Date(task.dueDate) : null} setDate={updateDate} />
                                <PriorityPicker value={task.priority as PriorityLevel} onChange={updatePriority} />
                                <CategoryPicker category={task.category || null} setCategory={updateCategory} />
                                <DurationPicker value={task.duration || null} onChange={updateDuration} />
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-white/5 mx-2" />

                            {/* Unified Description & Subtasks Container */}
                            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
                                {/* Description */}
                                <div className="p-5">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        Description
                                    </h3>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        onFocus={() => setIsEditingDesc(true)}
                                        onBlur={() => setIsEditingDesc(false)}
                                        placeholder="Add more details to this task..."
                                        className="w-full bg-transparent text-slate-300 placeholder:text-slate-600 border-none focus:ring-0 resize-none min-h-[80px] text-sm leading-relaxed p-0"
                                    />
                                </div>

                                {/* Subtasks Header & Progress */}
                                <div className="bg-black/20 p-5 border-t border-white/5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subtasks</h3>
                                            <span className="text-xs text-slate-600 bg-white/5 px-2 py-0.5 rounded-full">{completedSubtasksCount}/{totalSubtasks}</span>
                                        </div>
                                        {allSubtasksComplete && task.status !== 'done' && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="text-xs text-green-400 font-medium"
                                            >
                                                All done!
                                            </motion.span>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    {totalSubtasks > 0 && (
                                        <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden mb-5">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                            />
                                        </div>
                                    )}

                                    {/* List */}
                                    <div className="space-y-1">
                                        {subtasks.map((subtask) => (
                                            <div key={subtask.id} className="group flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                                                <button
                                                    onClick={() => handleSubtaskToggle(subtask.id)}
                                                    className={cn(
                                                        "w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
                                                        subtask.status === 'done'
                                                            ? "bg-purple-500/20 border-purple-500 text-purple-400"
                                                            : "border-slate-600 hover:border-slate-500"
                                                    )}
                                                >
                                                    {subtask.status === 'done' && <CheckCircle2 className="w-3 h-3" />}
                                                </button>
                                                <input
                                                    value={subtask.title}
                                                    onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                                                    onBlur={saveSubtasks}
                                                    placeholder="Subtask title"
                                                    className={cn(
                                                        "flex-1 bg-transparent border-none focus:ring-0 text-sm p-0",
                                                        subtask.status === 'done' ? "text-slate-500 line-through decoration-slate-600" : "text-slate-200"
                                                    )}
                                                />
                                                <button
                                                    onClick={() => {
                                                        const updated = subtasks.filter(s => s.id !== subtask.id);
                                                        setSubtasks(updated);
                                                        onUpdate(task.id, { subtasks: updated });
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}

                                        <button
                                            onClick={handleAddSubtask}
                                            className="ml-7 text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1 py-2 px-1 transition-colors group"
                                        >
                                            <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Add subtask
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="relative z-10 sticky bottom-0 p-6 pt-4 border-t border-white/5 bg-[#0f0f23]/80 backdrop-blur-xl shrink-0 flex justify-between items-center">
                            <div className="flex gap-2 text-xs text-slate-500">
                                <span>Created {task.createdAt ? format(new Date(task.createdAt), 'MMM d') : 'recently'}</span>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-10 px-4"
                                    onClick={() => onDelete(task.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </Button>

                                {task.status === 'todo' && (
                                    <Button
                                        size="sm"
                                        className="bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20 h-10 px-5 transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20"
                                        onClick={() => onUpdate(task.id, { status: 'in_progress' })}
                                    >
                                        Start Progress
                                    </Button>
                                )}

                                <Button
                                    size="sm"
                                    className={cn(
                                        "min-w-[140px] shadow-lg transition-all duration-300 h-10 px-6 font-medium",
                                        task.status === 'done'
                                            ? "bg-slate-800 hover:bg-slate-700 text-slate-300 shadow-none border border-white/5"
                                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                                    )}
                                    onClick={() => {
                                        const newStatus = task.status === 'done' ? 'todo' : 'done';
                                        onUpdate(task.id, { status: newStatus });
                                    }}
                                >
                                    {task.status === 'done' ? (
                                        <>Mark Incomplete</>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4 mr-2" /> Mark Complete
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
