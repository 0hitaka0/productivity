'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/glass-card';
import { useMBTI } from '@/components/providers/mbti-provider';
import { MBTI_DATA, MBTIType } from '@/lib/mbti-data';
import { toggleHabitCompletion } from '@/lib/actions/habit-actions';

interface Habit {
    id: string;
    name: string;
    logs: { completedAt: string | Date }[];
    color?: string;
}

interface HabitGridProps {
    habits: Habit[];
    mode: 'week' | 'month';
    onHabitChange?: () => void;
}

const TEMPERAMENT_BG = {
    Analysts: 'bg-purple-500',
    Diplomats: 'bg-green-500',
    Sentinels: 'bg-cyan-500',
    Explorers: 'bg-orange-500',
    Default: 'bg-blue-500'
};

export function HabitGrid({ habits, mode, onHabitChange }: HabitGridProps) {
    const { type } = useMBTI();
    const mbtiProfile = MBTI_DATA[type as MBTIType];
    const temperament = mbtiProfile?.temperament || 'Default';
    const bgClass = TEMPERAMENT_BG[temperament as keyof typeof TEMPERAMENT_BG];

    // Local optimistic state: Record<habitId-dateStr, boolean>
    const [optimisticCompletions, setOptimisticCompletions] = React.useState<Record<string, boolean>>({});

    const today = new Date();
    const days = mode === 'week'
        ? eachDayOfInterval({ start: subDays(today, 6), end: today })
        : eachDayOfInterval({ start: subDays(today, 29), end: today });

    const handleToggle = async (habitId: string, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const key = `${habitId}-${dateStr}`;
        const habit = habits.find(h => h.id === habitId);

        if (!habit) return;

        const isCurrentlyCompleted = habit.logs.some(log => isSameDay(new Date(log.completedAt), date));
        const optimisticValue = optimisticCompletions[key];

        // Determine new state (use optimistic if exists, else current)
        const isDone = optimisticValue !== undefined ? optimisticValue : isCurrentlyCompleted;
        const newValue = !isDone;

        // 1. Optimistic Update
        setOptimisticCompletions(prev => ({ ...prev, [key]: newValue }));

        try {
            // 2. Server Action
            await toggleHabitCompletion(habitId, date);

            // 3. Refresh Parent
            onHabitChange?.();

            // Clear optimistic state after successful sync (optional, or let props take over)
            setOptimisticCompletions(prev => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        } catch (error) {
            console.error("Failed to toggle habit", error);
            // Revert on error
            setOptimisticCompletions(prev => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    return (
        <div className="space-y-4 animate-fade-in pb-20">
            <div className="flex items-center justify-between text-sm text-slate-500 px-4">
                <span className="w-1/3">Habit</span>
                <div className={cn("grid w-2/3 gap-1 pl-4", mode === 'week' ? "grid-cols-7" : "grid-cols-10 md:grid-cols-[repeat(30,minmax(0,1fr))]")}>
                    {days.map((d, i) => (
                        <div key={i} className={cn("text-center text-[10px]", (mode === 'month' && i % 3 !== 0) && "hidden md:block")}>
                            {format(d, mode === 'week' ? 'EEE' : 'd')}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                {habits.map(habit => (
                    <GlassCard key={habit.id} className="p-4 flex items-center justify-between hover:bg-white/[0.03]">
                        <div className="w-1/3 pr-4 font-medium text-slate-200 truncate" title={habit.name}>
                            {habit.name}
                        </div>

                        <div className={cn("grid w-2/3 gap-1 pl-4", mode === 'week' ? "grid-cols-7" : "grid-cols-10 md:grid-cols-[repeat(30,minmax(0,1fr))]")}>
                            {days.map((day, i) => {
                                const dateStr = format(day, 'yyyy-MM-dd');
                                const key = `${habit.id}-${dateStr}`;
                                const isServerCompleted = habit.logs.some(log => isSameDay(new Date(log.completedAt), day));
                                const optimisticValue = optimisticCompletions[key];
                                const isCompleted = optimisticValue !== undefined ? optimisticValue : isServerCompleted;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleToggle(habit.id, day)}
                                        title={`${habit.name} - ${format(day, 'MMM d')}`}
                                        className={cn(
                                            "aspect-square rounded-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/20",
                                            isCompleted
                                                ? `${bgClass} shadow-[0_0_8px_rgba(255,255,255,0.4)]`
                                                : "bg-white/5 hover:bg-white/10",
                                            isSameDay(day, today) && "border border-white/40"
                                        )}
                                    />
                                );
                            })}
                        </div>
                    </GlassCard>
                ))}
            </div>

            {habits.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    <p>No habits to display.</p>
                </div>
            )}
        </div>
    );
}
