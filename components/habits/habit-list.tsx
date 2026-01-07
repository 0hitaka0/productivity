import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HabitCard } from './habit-card';
import { cn } from '@/lib/utils';
import { Sun, Sunset, Moon, Clock } from 'lucide-react';
import { HabitDetailPanel } from './habit-detail-panel';

interface Habit {
    id: string;
    name: string;
    description?: string; // Added for detail panel
    motivation?: string;  // Added for detail panel
    streak: number;
    longestStreak?: number; // Added for detail panel
    timeOfDay?: string;
    logs: { completedAt: string | Date }[];
    color?: string;
}

interface HabitListProps {
    habits: Habit[];
    onHabitChange?: () => void;
}

export function HabitList({ habits, onHabitChange }: HabitListProps) {
    const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

    const selectedHabit = habits.find(h => h.id === selectedHabitId) || null;

    // Group habits by time of day
    const groupedHabits = {
        morning: habits.filter(h => h.timeOfDay === 'morning'),
        afternoon: habits.filter(h => h.timeOfDay === 'afternoon'),
        evening: habits.filter(h => h.timeOfDay === 'evening'),
        anytime: habits.filter(h => !h.timeOfDay || h.timeOfDay === 'anytime'),
    };

    const sections = [
        { id: 'morning', label: 'Morning Routine', icon: Sun, color: 'text-orange-400', data: groupedHabits.morning },
        { id: 'afternoon', label: 'Afternoon', icon: Sun, color: 'text-yellow-400', data: groupedHabits.afternoon },
        { id: 'evening', label: 'Evening Routine', icon: Sunset, color: 'text-purple-400', data: groupedHabits.evening },
        { id: 'anytime', label: 'Anytime', icon: Clock, color: 'text-blue-400', data: groupedHabits.anytime },
    ];

    return (
        <div className="space-y-8 pb-20">
            {sections.map(section => (
                section.data.length > 0 && (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 px-1">
                            <section.icon className={cn("w-5 h-5", section.color)} />
                            <h2 className="text-lg font-semibold text-slate-200">{section.label}</h2>
                            <span className="text-sm text-slate-500 ml-auto">{section.data.length} habits</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.data.map(habit => (
                                <HabitCard
                                    key={habit.id}
                                    habit={habit}
                                    onSelect={(h) => setSelectedHabitId(h.id)}
                                />
                            ))}
                        </div>
                    </motion.div>
                )
            ))}

            {habits.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    <p>No habits yet. Start building your routine!</p>
                </div>
            )}

            <HabitDetailPanel
                habit={selectedHabit}
                isOpen={!!selectedHabitId}
                onClose={() => setSelectedHabitId(null)}
                onHabitChange={onHabitChange}
            />
        </div>
    );
}
