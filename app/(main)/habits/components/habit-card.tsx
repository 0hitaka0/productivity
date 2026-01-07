'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isSameDay, subDays } from 'date-fns';
import { useMBTI } from '@/components/providers/mbti-provider';
import { MBTI_DATA, MBTIType } from '@/lib/mbti-data';
import { toggleHabitCompletion } from '@/lib/actions/habit-actions';
import { GlassCard } from '@/components/ui/glass-card';

// --- Types (Simplified for UI) ---
interface HabitLog {
    completedAt: Date;
    status: string;
}

interface Habit {
    id: string;
    name: string;
    streak: number;
    timeOfDay?: string; // Scheduled time or period
    logs: { completedAt: string | Date }[]; // dates as strings or Date objects
    color?: string;
}

interface HabitCardProps {
    habit: Habit;
    onSelect: (habit: Habit) => void;
}

const TEMPERAMENT_COLORS = {
    Analysts: 'text-purple-400',
    Diplomats: 'text-green-400',
    Sentinels: 'text-cyan-400',
    Explorers: 'text-orange-400',
    Default: 'text-blue-400'
};

const TEMPERAMENT_BG = {
    Analysts: 'bg-purple-500',
    Diplomats: 'bg-green-500',
    Sentinels: 'bg-cyan-500',
    Explorers: 'bg-orange-500',
    Default: 'bg-blue-500'
};

export function HabitCard({ habit, onSelect }: HabitCardProps) {
    const { type } = useMBTI();
    const mbtiProfile = MBTI_DATA[type as MBTIType];
    const temperament = mbtiProfile?.temperament || 'Default';

    // Optimistic UI state
    const today = new Date();
    const isCompletedToday = habit.logs.some(log => isSameDay(new Date(log.completedAt), today));
    const [completed, setCompleted] = useState(isCompletedToday);
    const [streak, setStreak] = useState(habit.streak);

    const handleToggle = async () => {
        const newCompleted = !completed;
        setCompleted(newCompleted); // Optimistic update
        setStreak(prev => newCompleted ? prev + 1 : Math.max(0, prev - 1));

        try {
            await toggleHabitCompletion(habit.id, today);
        } catch (error) {
            // Revert on error
            setCompleted(!newCompleted);
            setStreak(prev => !newCompleted ? prev + 1 : Math.max(0, prev - 1));
            console.error("Failed to toggle habit");
        }
    };

    // Mini Calendar Logic (Last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(today, 6 - i);
        return {
            date: d,
            isCompleted: i === 6 ? completed : habit.logs.some(log => isSameDay(new Date(log.completedAt), d))
        };
    });

    return (
        <GlassCard
            onClick={() => onSelect(habit)}
            className={cn(
                "p-4 flex items-center justify-between group transition-all duration-300 cursor-pointer",
                completed ? "bg-white/[0.05] border-white/10" : "hover:bg-white/[0.03]"
            )}
        >
            <div className="flex items-center gap-4">
                {/* Checkbox */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggle();
                    }}
                    className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                        completed
                            ? `border-transparent ${TEMPERAMENT_BG[temperament as keyof typeof TEMPERAMENT_BG]} shadow-[0_0_10px_rgba(255,255,255,0.3)]`
                            : "border-slate-500 hover:border-slate-300"
                    )}
                >
                    {completed && <Check className="w-3.5 h-3.5 text-black font-bold" />}
                </button>

                {/* Info */}
                <div>
                    <h3 className={cn(
                        "font-medium transition-colors",
                        completed ? "text-slate-400 line-through decoration-slate-600" : "text-slate-100"
                    )}>
                        {habit.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        {habit.timeOfDay && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span className="capitalize">{habit.timeOfDay}</span>
                            </span>
                        )}
                        <span className={cn(
                            "flex items-center gap-1 transition-colors",
                            streak > 0 ? "text-orange-400" : ""
                        )}>
                            <Flame className={cn("w-3 h-3", streak > 0 && "fill-orange-400 animate-pulse")} />
                            {streak} days
                        </span>
                    </div>
                </div>
            </div>

            {/* Mini Calendar */}
            <div className="flex items-center gap-1">
                {last7Days.map((day, i) => (
                    <div
                        key={i}
                        className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all",
                            day.isCompleted
                                ? TEMPERAMENT_BG[temperament as keyof typeof TEMPERAMENT_BG]
                                : "bg-white/10",
                            isSameDay(day.date, today) && "outline outline-1 outline-white/30 outline-offset-1"
                        )}
                        title={format(day.date, 'MMM d')}
                    />
                ))}
            </div>
        </GlassCard>
    );
}
