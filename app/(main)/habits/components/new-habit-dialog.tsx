'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Calendar, Clock, Zap, Target, Hash, Sparkles, X,
    CheckCircle2, Repeat, Flag, Trophy, Activity, Heart,
    BookOpen, Briefcase, Smile
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMBTI } from '@/components/providers/mbti-provider';
import { MBTI_DATA, MBTIType } from '@/lib/mbti-data';
import { createHabit } from '@/lib/actions/habit-actions';
import { motion, AnimatePresence } from 'framer-motion';

interface NewHabitDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const TEMPERAMENT_THEMES = {
    Analysts: { primary: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.3)', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', suggestionBg: 'rgba(139, 92, 246, 0.1)', suggestionBorder: 'rgba(139, 92, 246, 0.2)' },
    Diplomats: { primary: '#10B981', glow: 'rgba(16, 185, 129, 0.3)', gradient: 'linear-gradient(135deg, #10B981, #059669)', suggestionBg: 'rgba(16, 185, 129, 0.1)', suggestionBorder: 'rgba(16, 185, 129, 0.2)' },
    Sentinels: { primary: '#06B6D4', glow: 'rgba(6, 182, 212, 0.3)', gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)', suggestionBg: 'rgba(6, 182, 212, 0.1)', suggestionBorder: 'rgba(6, 182, 212, 0.2)' },
    Explorers: { primary: '#F59E0B', glow: 'rgba(245, 158, 11, 0.3)', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)', suggestionBg: 'rgba(245, 158, 11, 0.1)', suggestionBorder: 'rgba(245, 158, 11, 0.2)' },
    Default: { primary: '#3B82F6', glow: 'rgba(59, 130, 246, 0.3)', gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)', suggestionBg: 'rgba(59, 130, 246, 0.1)', suggestionBorder: 'rgba(59, 130, 246, 0.2)' }
};

const SUGGESTED_HABITS = {
    Analysts: [
        { name: "Strategic Planning", time: "morning", icon: "Target" },
        { name: "Learn New Skill", time: "evening", icon: "BookOpen" },
        { name: "Deep Work Block", time: "morning", icon: "Briefcase" }
    ],
    Diplomats: [
        { name: "Gratitude Journal", time: "morning", icon: "Heart" },
        { name: "Meditation", time: "anytime", icon: "Zap" },
        { name: "Connect with Friend", time: "afternoon", icon: "Smile" }
    ],
    Sentinels: [
        { name: "Plan Tomorrow", time: "evening", icon: "Calendar" },
        { name: "Budget Review", time: "weekly", icon: "Activity" },
        { name: "Clean Workspace", time: "morning", icon: "CheckCircle2" }
    ],
    Explorers: [
        { name: "Morning Exercise", time: "morning", icon: "Activity" },
        { name: "Creative Time", time: "afternoon", icon: "Sparkles" },
        { name: "Try Something New", time: "weekly", icon: "Trophy" }
    ]
};

export function NewHabitDialog({ isOpen, onClose }: NewHabitDialogProps) {
    const { type } = useMBTI();
    const mbtiProfile = MBTI_DATA[type as MBTIType];
    const temperament = mbtiProfile?.temperament || 'Default';
    // @ts-ignore - 'Default' is a fallback string not in the strict union
    const theme = TEMPERAMENT_THEMES[temperament as keyof typeof TEMPERAMENT_THEMES || 'Default'];

    const [name, setName] = useState('');
    const [motivation, setMotivation] = useState('');
    const [frequency, setFrequency] = useState('daily');
    const [timeOfDay, setTimeOfDay] = useState('anytime');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setName('');
            setMotivation('');
            setFrequency('daily');
            setTimeOfDay('anytime');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        setIsSubmitting(true);

        try {
            const res = await createHabit({
                name,
                motivation,
                frequency,
                targetDays: [], // default for daily
                timeOfDay,
                goalType: 'simple'
            });

            if (!res?.success) {
                alert("Failed to create habit: " + (res?.error || "Unknown error"));
                console.error(res);
                return;
            }

            onClose();
            setName('');
            setMotivation('');
        } catch (error) {
            console.error(error);
            alert("An error occurred. Please check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 bg-[#0f111a]/95 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden rounded-2xl gap-0 [&>button]:hidden">
                <DialogTitle className="sr-only">New Habit</DialogTitle>

                {/* Header */}
                <div className="relative h-32 w-full overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{ background: theme.gradient }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f111a]/95" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-6 left-8 z-10">
                        <div className="flex items-center gap-2 text-white/60 text-sm font-medium mb-1">
                            <Sparkles className="w-4 h-4" style={{ color: theme.primary }} />
                            <span>New Habit</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            {mbtiProfile?.habitTitle || "Build a new routine"}
                        </h2>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">
                    {/* Name Input */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                style={{ backgroundColor: theme.primary }}
                            />
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={mbtiProfile?.habitPlaceholder || "What habit do you want to build?"}
                                className="flex-1 bg-transparent border-none text-xl font-medium placeholder:text-slate-600 focus:ring-0 p-0 text-white"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Quick Options */}
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setFrequency(frequency === 'daily' ? 'weekly' : 'daily')}
                            className={cn(
                                "h-9 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-slate-300",
                                frequency === 'daily' && "border-white/20 bg-white/10 text-white"
                            )}
                        >
                            <Repeat className="w-3.5 h-3.5 mr-2" />
                            {frequency === 'daily' ? 'Daily' : 'Weekly'}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => {
                                const times = ['morning', 'afternoon', 'evening', 'anytime'];
                                const next = times[(times.indexOf(timeOfDay) + 1) % times.length];
                                setTimeOfDay(next);
                            }}
                            className="h-9 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 capitalize"
                        >
                            <Clock className="w-3.5 h-3.5 mr-2" />
                            {timeOfDay}
                        </Button>
                    </div>

                    {/* Motivation */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Motivation
                        </label>
                        <Textarea
                            value={motivation}
                            onChange={(e) => setMotivation(e.target.value)}
                            placeholder="Why does this habit matter to you?"
                            className="bg-white/[0.03] border-white/10 text-slate-300 min-h-[80px] focus:border-white/20 rounded-xl resize-none"
                        />
                        {/* MBTI Tip */}
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                            <Zap className="w-4 h-4 mt-0.5 shrink-0" style={{ color: theme.primary }} />
                            <p className="text-xs text-slate-400 leading-relaxed">
                                <span className="text-slate-300 font-medium">{mbtiProfile?.type} Tip:</span>{" "}
                                {mbtiProfile?.journalStyle?.split('.')[0]}.
                            </p>
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Suggested for you
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {SUGGESTED_HABITS[temperament as keyof typeof SUGGESTED_HABITS]?.map((habit, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setName(habit.name);
                                        setTimeOfDay(habit.time);
                                    }}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all text-left group"
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors"
                                        style={{ color: theme.primary }}
                                    >
                                        <Activity className="w-4 h-4" /> {/* Placeholder icon */}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                                            {habit.name}
                                        </div>
                                        <div className="text-[10px] text-slate-500 capitalize">
                                            {habit.time}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!name.trim() || isSubmitting}
                        className="px-6 font-medium text-white border-0 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                        style={{
                            background: theme.gradient,
                            boxShadow: `0 0 20px -5px ${theme.glow}`
                        }}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Habit'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
