"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Star, Zap, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/glass-card';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate?: string | Date;
    category?: string;
    tags?: { id: string; name: string; color?: string }[];
    subtasks?: { id: string; title: string, status: 'done' | 'todo' }[];
    isRecurring?: boolean;
    duration?: number; // in minutes
    createdAt?: string | Date;
}

// Helper for highlighting
function HighlightedText({ text, query }: { text: string, query: string }) {
    if (!query || !text) return <>{text}</>;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-500/30 text-yellow-200 font-bold px-0.5 rounded-sm">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
}

export interface TaskCardProps {
    task: Task;
    view?: 'list' | 'board';
    onClick?: () => void;
    onToggle?: (taskId: string) => void;
    searchQuery?: string;
}

// Priority Visuals (Celestial Objects)
const PriorityIcon = ({ priority }: { priority: string }) => {
    switch (priority) {
        case 'critical':
            return <Zap className="w-4 h-4 text-red-500 fill-red-500/20 animate-pulse" />;
        case 'high':
            return <Star className="w-4 h-4 text-orange-500 fill-orange-500/20" />;
        case 'medium':
            return <Star className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />;
        case 'low':
            return <Circle className="w-4 h-4 text-blue-300" />;
        default:
            return <Circle className="w-4 h-4 text-slate-600" />;
    }
};

const PriorityBadge = ({ priority }: { priority: string }) => {
    const styles = {
        critical: "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
        high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        low: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        none: "bg-slate-500/10 text-slate-400 border-slate-500/20"
    };

    return (
        <span className={cn("px-2 py-0.5 rounded-full text-xs border flex items-center gap-1.5 uppercase tracking-wider font-medium", styles[priority as keyof typeof styles] || styles.none)}>
            <PriorityIcon priority={priority} />
            {priority}
        </span>
    );
};

export function TaskCard({ task, view = 'board', onClick, onToggle, searchQuery }: TaskCardProps) {
    const completedSubtasks = task.subtasks?.filter(st => st.status === 'done').length || 0;
    const totalSubtasks = task.subtasks?.length || 0;
    const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    // determine progress bar color based on something (e.g. priority for now, or passed in prop)
    // simplistic mapping:
    const progressColor = "bg-purple-500";

    return (
        <motion.div
            layoutId={task.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "group cursor-pointer relative max-w-full",
                view === 'list' ? "w-full mb-2" : "w-full"
            )}
        >
            <GlassCard
                onClick={onClick}
                className={cn(
                    "border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all p-4 relative overflow-hidden",
                    task.status === 'done' ? "opacity-75" : ""
                )}
            >
                <div className="flex flex-col gap-3">
                    {/* Header: Priority & Date */}
                    <div className="flex justify-between items-start">
                        <PriorityBadge priority={task.priority} />
                        {task.dueDate && (
                            <div className={cn(
                                "flex items-center gap-1 text-xs",
                                new Date(task.dueDate) < new Date() ? "text-red-400 font-medium" : "text-slate-400"
                            )}>
                                <Calendar className="w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                        )}
                    </div>

                    {/* Main Content: Checkbox & Title */}
                    <div className="flex items-start gap-3">
                        <div
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent opening panel
                                onToggle?.(task.id);
                            }}
                            className={cn(
                                "mt-0.5 min-w-[20px] h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer z-10",
                                task.status === 'done'
                                    ? "bg-purple-500 border-purple-500 text-white"
                                    : "border-slate-600 hover:border-slate-500"
                            )}
                        >
                            {task.status === 'done' && <Circle className="w-2.5 h-2.5 fill-current" />}
                        </div>

                        <h3 className={cn(
                            "font-medium transition-colors break-words text-left", // added text-left
                            task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-200 group-hover:text-white'
                        )}>
                            <HighlightedText text={task.title} query={searchQuery || ''} />
                        </h3>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1 min-h-[20px]">
                        <div className="flex items-center gap-2">
                            {task.category && ( // Assuming category is a string field now based on prompts, or keeping tags
                                <span className="text-slate-400">#{task.category}</span>
                            )}
                            {task.tags?.map(tag => (
                                <span key={tag.id} className="text-slate-400">#{tag.name}</span>
                            ))}
                        </div>
                    </div>

                    {/* Slim Progress Bar (Only if subtasks exist) */}
                    {totalSubtasks > 0 && (
                        <div className="mt-2 space-y-1">
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className={cn("h-full rounded-full", progressColor)}
                                />
                            </div>
                            <div className="flex justify-end">
                                <span className="text-[10px] text-slate-500 font-medium">{Math.round(progress)}%</span>
                            </div>
                        </div>
                    )}
                </div>
            </GlassCard>
        </motion.div>
    );
}
