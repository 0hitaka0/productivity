"use client";

import React, { useState } from 'react';
import { Task, TaskCard } from './task-card';
import { ChevronDown, ChevronRight, Zap, Star, Circle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskPersonalization } from '@/components/hooks/use-task-personalization';

interface TaskListProps {
    tasks: Task[];
    groupBy?: 'priority' | 'status' | 'none';
    onTaskClick?: (task: Task) => void;
    onToggle?: (taskId: string) => void;
    searchQuery?: string;
}

const PRIORITY_ORDER = ['critical', 'high', 'medium', 'low', 'none'];

const GROUPS = {
    critical: { label: 'Critical', icon: Zap, color: 'text-red-500' },
    high: { label: 'High Priority', icon: Star, color: 'text-orange-500' },
    medium: { label: 'Medium Priority', icon: Star, color: 'text-yellow-500' },
    low: { label: 'Low Priority', icon: Circle, color: 'text-blue-400' },
    none: { label: 'No Priority', icon: Circle, color: 'text-slate-500' },
    // Status groups
    todo: { label: 'To Do', icon: Circle, color: 'text-slate-400' },
    in_progress: { label: 'In Progress', icon: Circle, color: 'text-orange-400' },
    done: { label: 'Completed', icon: CheckCircle2, color: 'text-green-400' }
};

function TaskGroup({
    id,
    groupKey,
    tasks,
    onTaskClick,
    onToggle,
    searchQuery
}: {
    id: string;
    groupKey: keyof typeof GROUPS | string;
    tasks: Task[];
    onTaskClick?: (task: Task) => void;
    onToggle?: (taskId: string) => void;
    searchQuery?: string;
}) {
    const [isExpanded, setIsExpanded] = useState(true);
    const groupInfo = GROUPS[groupKey as keyof typeof GROUPS] || { label: groupKey, icon: Circle, color: 'text-slate-400' };
    const Icon = groupInfo.icon;

    if (tasks.length === 0) return null;

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 mb-3 w-full group hover:bg-white/5 p-2 rounded-lg transition-colors"
            >
                {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                <Icon className={cn("w-4 h-4", groupInfo.color)} />
                <span className="font-semibold text-slate-200 text-sm tracking-wide uppercase">{groupInfo.label}</span>
                <span className="text-slate-600 text-xs ml-auto font-mono bg-slate-900/50 px-2 py-0.5 rounded-full">{tasks.length}</span>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2 pl-2"
                    >
                        {tasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                view="list"
                                onClick={() => onTaskClick?.(task)}
                                onToggle={onToggle}
                                searchQuery={searchQuery}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function TaskList({ tasks, groupBy = 'priority', onTaskClick, onToggle, searchQuery }: TaskListProps) {
    const { config } = useTaskPersonalization();

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 lg:p-24 border border-dashed border-slate-800 rounded-3xl bg-slate-950/30">
                <div className="w-16 h-16 rounded-full bg-slate-900/50 flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-slate-700" />
                </div>
                <p className="text-slate-500 font-medium">{config.emptyStatePrompt}</p>
            </div>
        );
    }

    let groups: { id: string; tasks: Task[] }[] = [];

    if (groupBy === 'priority') {
        groups = PRIORITY_ORDER.map(p => ({
            id: p,
            tasks: tasks.filter(t => (t.priority || 'none') === p)
        }));
    } else if (groupBy === 'status') {
        groups = ['todo', 'in_progress', 'done'].map(s => ({
            id: s,
            tasks: tasks.filter(t => t.status === s)
        }));
    } else {
        return (
            <div className="space-y-2">
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        view="list"
                        onClick={() => onTaskClick?.(task)}
                        onToggle={onToggle}
                        searchQuery={searchQuery}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="animate-fade-in pb-12">
            {groups.map(group => (
                <TaskGroup
                    key={group.id}
                    id={group.id}
                    groupKey={group.id}
                    tasks={group.tasks}
                    onTaskClick={onTaskClick}
                    onToggle={onToggle}
                    searchQuery={searchQuery}
                />
            ))}
        </div>
    );
}
