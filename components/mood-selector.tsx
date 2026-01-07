"use client";

import React, { useState } from 'react';
// import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Smile, Frown, Meh, CloudRain, Sun, Zap, Heart, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MoodData {
    value: number;
    emotions: string[];
    context: string[];
}

interface MoodSelectorProps {
    value: MoodData;
    onChange: (data: MoodData) => void;
}

const EMOTIONS = [
    { label: "Happy", icon: "😊", color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50" },
    { label: "Excited", icon: "🤩", color: "bg-orange-500/20 text-orange-500 border-orange-500/50" },
    { label: "Calm", icon: "😌", color: "bg-blue-500/20 text-blue-500 border-blue-500/50" },
    { label: "Anxious", icon: "😰", color: "bg-purple-500/20 text-purple-500 border-purple-500/50" },
    { label: "Sad", icon: "😢", color: "bg-indigo-500/20 text-indigo-500 border-indigo-500/50" },
    { label: "Angry", icon: "😠", color: "bg-red-500/20 text-red-500 border-red-500/50" },
    { label: "Tired", icon: "😴", color: "bg-slate-500/20 text-slate-500 border-slate-500/50" },
    { label: "Focused", icon: "🤓", color: "bg-emerald-500/20 text-emerald-500 border-emerald-500/50" },
];

const CONTEXTS = [
    { label: "Work", icon: <Zap className="w-3 h-3" /> },
    { label: "Family", icon: <Heart className="w-3 h-3" /> },
    { label: "Relationship", icon: <Heart className="w-3 h-3" /> },
    { label: "Health", icon: <Sun className="w-3 h-3" /> },
    { label: "Social", icon: <Smile className="w-3 h-3" /> },
    { label: "Weather", icon: <CloudRain className="w-3 h-3" /> },
    { label: "Rest", icon: <Coffee className="w-3 h-3" /> },
];

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
    const [customEmotion, setCustomEmotion] = useState("");

    // Mood Levels (mapped to 1-10 scale)
    const moodLevels = [
        { val: 2, icon: <Frown className="w-8 h-8" />, label: "Bad", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
        { val: 4, icon: <CloudRain className="w-8 h-8" />, label: "Low", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
        { val: 6, icon: <Meh className="w-8 h-8" />, label: "Okay", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
        { val: 8, icon: <Smile className="w-8 h-8" />, label: "Good", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
        { val: 10, icon: <Sun className="w-8 h-8" />, label: "Great", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
    ];

    const toggleEmotion = (emotion: string) => {
        const newEmotions = value.emotions.includes(emotion)
            ? value.emotions.filter(e => e !== emotion)
            : [...value.emotions, emotion];
        onChange({ ...value, emotions: newEmotions });
    };

    const addCustomEmotion = (e: React.FormEvent) => {
        e.preventDefault();
        if (customEmotion.trim() && !value.emotions.includes(customEmotion.trim())) {
            onChange({ ...value, emotions: [...value.emotions, customEmotion.trim()] });
            setCustomEmotion("");
        }
    };

    const toggleContext = (ctx: string) => {
        const newContext = value.context.includes(ctx)
            ? value.context.filter(c => c !== ctx)
            : [...value.context, ctx];
        onChange({ ...value, context: newContext });
    };

    return (
        <div className="space-y-6">
            {/* 1. Mood Level Selector */}
            <div>
                <label className="text-sm font-medium text-slate-400 mb-3 block">How are you feeling?</label>
                <div className="flex justify-between gap-2">
                    {moodLevels.map((level) => {
                        const isSelected = value.value === level.val;
                        return (
                            <button
                                key={level.val}
                                onClick={() => onChange({ ...value, value: level.val })}
                                className={cn(
                                    "flex-1 flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 group",
                                    isSelected
                                        ? `${level.color} border-current ring-1 ring-white/10 shadow-[0_0_15px_rgba(0,0,0,0.2)] scale-105`
                                        : "bg-slate-900/30 border-white/5 text-slate-500 hover:bg-white/5 hover:border-white/10 hover:scale-105"
                                )}
                            >
                                <span className={cn("transition-transform duration-200", isSelected ? "scale-110" : "group-hover:scale-110")}>
                                    {level.icon}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider font-bold mt-2 opacity-60">{level.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Custom Tags (Context + Emotions) */}
            <div className="space-y-4">
                {/* Selected Tags Display */}
                {(value.emotions.length > 0 || value.context.length > 0) && (
                    <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-xl border border-white/5 animate-in fade-in">
                        {value.emotions.map(e => (
                            <button key={e} onClick={() => toggleEmotion(e)} className="text-xs px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 flex items-center gap-1">
                                <span>✨</span> {e}
                            </button>
                        ))}
                        {value.context.map(c => (
                            <button key={c} onClick={() => toggleContext(c)} className="text-xs px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 flex items-center gap-1">
                                <span>📍</span> {c}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex gap-4">
                    {/* Context Quick Select */}
                    <div className="flex-1">
                        <label className="text-xs font-medium text-slate-500 mb-2 block uppercase tracking-wider">Context</label>
                        <div className="flex flex-wrap gap-1.5">
                            {CONTEXTS.map((ctx) => (
                                <button
                                    type="button"
                                    key={ctx.label}
                                    onClick={() => toggleContext(ctx.label)}
                                    className={cn(
                                        "p-2 rounded-lg text-xs font-medium border transition-all",
                                        value.context.includes(ctx.label)
                                            ? "bg-slate-700 text-white border-slate-600"
                                            : "bg-slate-900/30 border-white/5 text-slate-500 hover:bg-white/5 hover:text-slate-300"
                                    )}
                                    title={ctx.label}
                                >
                                    {ctx.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Emotion Input */}
                    <div className="flex-1">
                        <label className="text-xs font-medium text-slate-500 mb-2 block uppercase tracking-wider">Add Details</label>
                        <form onSubmit={addCustomEmotion} className="flex items-center">
                            <input
                                type="text"
                                value={customEmotion}
                                onChange={(e) => setCustomEmotion(e.target.value)}
                                placeholder="Add feeling..."
                                className="w-full bg-slate-900/30 border border-white/10 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-purple-500/50 focus:bg-slate-900/50 text-slate-300 placeholder:text-slate-600 transition-all"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
