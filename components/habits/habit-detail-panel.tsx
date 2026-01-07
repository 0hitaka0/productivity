'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Edit2, Calendar, MoreHorizontal, Flame, Trophy, Clock, Check, ChevronLeft, ChevronRight, Share2, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { useMBTI } from '@/components/providers/mbti-provider';
import { MBTI_DATA, MBTIType } from '@/lib/mbti-data';
import { deleteHabit, updateHabit, toggleHabitCompletion, skipHabit } from '@/lib/actions/habit-actions';
import { ConfirmModal } from '@/components/confirm-modal';
import confetti from 'canvas-confetti';
import { format, eachDayOfInterval, subDays, isSameDay, startOfWeek, endOfWeek } from 'date-fns';

interface HabitDetailPanelProps {
    habit: any;
    isOpen: boolean;
    onClose: () => void;
    onHabitChange?: () => void;
}

export function HabitDetailPanel({ habit, isOpen, onClose, onHabitChange }: HabitDetailPanelProps) {
    const { type } = useMBTI();
    // @ts-ignore
    const mbtiProfile = MBTI_DATA[type];
    const temperament = mbtiProfile?.temperament || 'Default';

    // Local state
    const [name, setName] = useState('');
    const [motivation, setMotivation] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingMotivation, setIsEditingMotivation] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Optimistic Logic
    const [optimisticIsDone, setOptimisticIsDone] = useState<boolean | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (habit) {
            if (!isEditingName) setName(habit.name);
            if (!isEditingMotivation) setMotivation(habit.motivation || '');
            setOptimisticIsDone(null);
        }
    }, [habit, isEditingName, isEditingMotivation]);

    // ... handlers ...
    const handleSaveName = async () => {
        if (name && name !== habit.name) {
            await updateHabit({ id: habit.id, name });
            onHabitChange?.();
        }
        setIsEditingName(false);
    };

    const handleSaveMotivation = async () => {
        if (motivation !== habit.motivation) {
            await updateHabit({ id: habit.id, motivation });
            onHabitChange?.();
        }
        setIsEditingMotivation(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteHabit(habit.id);
            onClose();
            onHabitChange?.();
        } catch (error) {
            console.error("Failed to delete", error);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (!habit || !mounted) return null;

    // Derived Logic
    const isActuallyDone = habit.logs?.some((log: any) => new Date(log.date).toDateString() === new Date().toDateString() && log.status === 'completed');
    const isActuallySkipped = habit.logs?.some((log: any) => new Date(log.date).toDateString() === new Date().toDateString() && log.status === 'skipped');

    // We can just reuse optimisticIsDone for the completed state, or just default to actual logic if opt is null
    const isTodayDone = optimisticIsDone !== null ? optimisticIsDone : isActuallyDone;

    // Aliases to match the new UI references
    const isTodayCompleted = isTodayDone;
    const isTodaySkipped = isActuallySkipped && !isTodayDone;

    const handleToggle = async () => {
        const newValue = !isTodayDone;
        setOptimisticIsDone(newValue);

        if (newValue) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#A855F7', '#3B82F6', '#10B981']
            });
        }

        try {
            await toggleHabitCompletion(habit.id, new Date());
            onHabitChange?.();
        } catch (error) {
            setOptimisticIsDone(!newValue);
        }
    };

    const handleSkip = async () => {
        try {
            await skipHabit(habit.id, new Date());
            onHabitChange?.();
            // Maybe show a toast
        } catch (error) {
            console.error(error);
        }
    };

    // Calculate Week Data
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(today, { weekStartsOn: 1 }) });
    const completedCount = habit.logs?.filter((l: any) => new Date(l.date) >= weekStart).length || 0;
    const completionRate = Math.round((completedCount / 7) * 100);

    // Heatmap Data (Last 28 days)
    const heatmapDays = eachDayOfInterval({ start: subDays(today, 27), end: today });

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 m-auto h-[85vh] w-full max-w-2xl bg-[#0F0F16]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-[9999] flex flex-col overflow-hidden"
                    >
                        {/* Dynamic Background */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]" />
                            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />
                            {/* Stars */}
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute bg-white rounded-full opacity-20 animate-pulse"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        width: Math.random() * 2 + 1 + 'px',
                                        height: Math.random() * 2 + 1 + 'px',
                                        animationDuration: `${Math.random() * 3 + 2}s`
                                    }}
                                />
                            ))}
                        </div>

                        {/* Header / Hero */}
                        <div className="relative p-8 flex flex-col items-center shrink-0 border-b border-white/5 bg-white/[0.01]">
                            <div className="absolute top-6 right-6 flex gap-2">
                                <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white rounded-full">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Orbital Icon */}
                            <div className="relative mb-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 backdrop-blur-md relative z-10">
                                    <Clock className="w-10 h-10 text-white" />
                                </div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-8px] rounded-full border border-dashed border-white/20"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-16px] rounded-full border border-dashed border-white/10"
                                />
                            </div>

                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onFocus={() => setIsEditingName(true)}
                                onBlur={handleSaveName}
                                className="bg-transparent text-center text-3xl font-bold text-white border-none focus:ring-0 p-0 placeholder:text-slate-700 w-full"
                            />

                            <div className="flex items-center gap-3 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5">{habit.frequency}</span>
                                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5">{habit.timeOfDay || 'Anytime'}</span>
                            </div>

                            <div className="mt-8 w-full max-w-md relative">
                                <textarea
                                    value={motivation}
                                    onChange={(e) => setMotivation(e.target.value)}
                                    onFocus={() => setIsEditingMotivation(true)}
                                    onBlur={handleSaveMotivation}
                                    placeholder="Driving motivation..."
                                    rows={1}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-center text-sm text-slate-300 focus:bg-white/10 focus:ring-0 focus:border-purple-500/50 transition-all resize-none"
                                />
                                <span className="absolute left-4 top-3 text-2xl text-purple-500 font-serif leading-none">“</span>
                                <span className="absolute right-4 top-3 text-2xl text-purple-500 font-serif leading-none">”</span>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 relative z-10">
                            {/* Today's Check-In */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Today's Check-In</h3>
                                </div>
                                <button
                                    onClick={handleToggle}
                                    className={cn(
                                        "w-full h-20 rounded-2xl flex items-center justify-between px-8 transition-all duration-300 group border relative overflow-hidden",
                                        isTodayCompleted
                                            ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30"
                                            : isTodaySkipped
                                                ? "bg-slate-700/20 border-slate-700/30"
                                                : "bg-white/5 border-white/10 hover:bg-white/10"
                                    )}
                                >
                                    <div className="flex flex-col items-start gap-1">
                                        <span className={cn("text-lg font-bold", isTodayCompleted ? "text-emerald-400" : isTodaySkipped ? "text-slate-400" : "text-white")}>
                                            {isTodayCompleted ? "Completed!" : isTodaySkipped ? "Skipped Today" : "Did you do this today?"}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {isTodayCompleted ? "Great work! Streak extended." : isTodaySkipped ? "You can still mark it as done." : "Mark as done to build your streak"}
                                        </span>
                                    </div>
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                                        isTodayCompleted
                                            ? "bg-emerald-500 text-black rotate-0 scale-100"
                                            : isTodaySkipped
                                                ? "bg-slate-600 text-slate-300"
                                                : "bg-white/10 text-slate-500 group-hover:bg-white/20 group-hover:text-white"
                                    )}>
                                        {isTodayCompleted ? <Check className="w-6 h-6 stroke-[3]" /> : (isTodaySkipped ? <X className="w-6 h-6 stroke-[3]" /> : <Check className="w-6 h-6 stroke-[3]" />)}
                                    </div>

                                    {/* Progress Fill Animation */}
                                    {isTodayCompleted && (
                                        <motion.div
                                            layoutId="progress"
                                            className="absolute bottom-0 left-0 h-1 bg-emerald-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: '100%' }}
                                        />
                                    )}
                                </button>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Streak Stats */}
                                <GlassCard className="p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-50"><Flame className="w-6 h-6 text-orange-500" /></div>
                                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-500 mb-2">
                                        {habit.streak}
                                    </div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Streak</div>
                                    <div className="mt-4 text-[10px] text-center text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                                        Best: <span className="text-white font-medium">{habit.longestStreak || habit.streak} days</span>
                                    </div>
                                </GlassCard>

                                {/* Insights Card */}
                                <GlassCard className="p-6 relative overflow-hidden bg-gradient-to-br from-purple-900/10 to-blue-900/10 border-white/10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs font-bold text-yellow-100 uppercase tracking-widest">AI Insight</span>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed italic">
                                        "You're most consistent on Tuesdays! Try moving this habit to the morning to boost week-end adherence."
                                    </p>
                                    <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500">
                                        <span>Based on last 30 days</span>
                                        <button className="hover:text-white transition-colors">Refresh</button>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Views */}
                            <div className="space-y-6">
                                {/* Weekly */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">This Week</h3>
                                        <span className="text-xs text-slate-400">{completionRate}% Completion</span>
                                    </div>
                                    <div className="grid grid-cols-7 gap-3">
                                        {weekDays.map((date, i) => {
                                            const isDone = habit.logs?.some((l: any) => new Date(l.date).toDateString() === date.toDateString() && l.status === 'completed');
                                            const isSkipped = habit.logs?.some((l: any) => new Date(l.date).toDateString() === date.toDateString() && l.status === 'skipped');
                                            const isToday = isSameDay(date, new Date());

                                            return (
                                                <div key={i} className="flex flex-col items-center gap-2">
                                                    <div className={cn(
                                                        "w-full aspect-[4/5] rounded-xl flex items-center justify-center transition-all relative overflow-hidden",
                                                        isDone
                                                            ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                                                            : isSkipped
                                                                ? "bg-slate-700 text-slate-300"
                                                                : "bg-white/5 text-slate-600",
                                                        isToday && !isDone && !isSkipped && "ring-1 ring-white/30 bg-white/10"
                                                    )}>
                                                        {isDone ? <Check className="w-5 h-5" /> : (isSkipped ? <span className="text-xs">-</span> : <span className="text-xs font-medium">{format(date, 'd')}</span>)}
                                                    </div>
                                                    <span className="text-[10px] uppercase text-slate-600 font-bold">{format(date, 'EEE')}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Monthly Heatmap */}
                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monthly Overview</h3>
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-white/5" />
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-10 md:grid-cols-[repeat(14,minmax(0,1fr))] gap-2">
                                        {heatmapDays.map((date, i) => {
                                            const isDone = habit.logs?.some((l: any) => new Date(l.date).toDateString() === date.toDateString() && l.status === 'completed');
                                            const isSkipped = habit.logs?.some((l: any) => new Date(l.date).toDateString() === date.toDateString() && l.status === 'skipped');

                                            return (
                                                <div
                                                    key={i}
                                                    title={format(date, 'MMM d')}
                                                    className={cn(
                                                        "aspect-square rounded-sm transition-all",
                                                        isDone
                                                            ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"
                                                            : isSkipped
                                                                ? "bg-slate-700"
                                                                : "bg-white/5 hover:bg-white/10"
                                                    )}
                                                />
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-white/5 flex justify-between items-center shrink-0 bg-black/20 backdrop-blur-md">
                            <Button
                                variant="ghost"
                                className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 text-xs"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Habit
                            </Button>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                                    onClick={handleSkip}
                                >
                                    Skip Today
                                </Button>
                                <Button className="bg-white text-black hover:bg-slate-200" onClick={onClose}>
                                    Done
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    <ConfirmModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDelete}
                        title="Delete Habit"
                        message="Are you sure you want to delete this habit? This action cannot be undone."
                        confirmText="Delete"
                        isDestructive={true}
                        isLoading={isDeleting}
                    />
                </>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
