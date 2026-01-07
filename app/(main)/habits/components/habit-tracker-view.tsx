'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, BarChart2, Calendar as CalendarIcon, Layout } from 'lucide-react';
import { HabitList } from './habit-list';
import { NewHabitDialog } from './new-habit-dialog';
import { HabitGrid } from './habit-grid';
import { getHabits } from '@/lib/actions/habit-actions';
import { useMBTI } from '@/components/providers/mbti-provider';
import { MBTI_DATA } from '@/lib/mbti-data';

export function HabitTrackerView() {
    const [habits, setHabits] = useState<any[]>([]);
    const [isNewHabitOpen, setIsNewHabitOpen] = useState(false);
    const { type } = useMBTI();
    // @ts-ignore
    const mbtiProfile = MBTI_DATA[type];

    // Fetch habits logic (simplified for client component)
    // Ideally this data is passed from a server component or fetched via react-query
    // For now we'll use a simple effect calling the server action
    const loadHabits = async () => {
        const data = await getHabits();
        setHabits(data || []);
    };

    useEffect(() => {
        loadHabits();
    }, [isNewHabitOpen]); // Refresh when dialog closes

    // Calculate quick stats
    const totalHabits = habits.length;
    const completedToday = habits.filter(h => {
        const today = new Date().toISOString().split('T')[0];
        return h.logs.some((l: any) => new Date(l.completedAt).toISOString().split('T')[0] === today);
    }).length;

    const maxStreak = Math.max(0, ...habits.map(h => h.streak));

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Habit Tracker</h1>
                    <p className="text-slate-400 max-w-xl">
                        {mbtiProfile?.habitTitle || "Small steps, repeated daily, lead to massive change."}
                    </p>

                    {/* Quick Stats Bar */}
                    <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm">
                            <span className="font-bold">🔥 {maxStreak}</span>
                            <span className="opacity-80">Day Streak</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                            <span className="font-bold">✓ {completedToday}/{totalHabits}</span>
                            <span className="opacity-80">Today</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsNewHabitOpen(true)}
                        className="bg-white text-black hover:bg-slate-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Habit
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <HabitList habits={habits} onHabitChange={loadHabits} />

            <NewHabitDialog
                isOpen={isNewHabitOpen}
                onClose={() => setIsNewHabitOpen(false)}
            />
        </div>
    );
}
