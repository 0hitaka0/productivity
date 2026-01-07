"use client";

import React, { useState, useEffect } from 'react';
import { Prompt, getRandomPrompt } from '@/lib/prompts';
import { useAuth } from '@/components/auth-provider';
import { MBTIType } from '@/lib/mbti-data';
import { RefreshCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PromptCard() {
    const { user } = useAuth();
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshPrompt = () => {
        if (!user?.mbtiType) return;
        setLoading(true);
        setTimeout(() => {
            setPrompt(getRandomPrompt(user.mbtiType as MBTIType));
            setLoading(false);
        }, 300);
    };

    useEffect(() => {
        if (user?.mbtiType) {
            setPrompt(getRandomPrompt(user.mbtiType as MBTIType));
            setLoading(false);
        }
    }, [user?.mbtiType]);

    if (!user?.mbtiType) return null;

    return (
        <div className="relative group">
            <AnimatePresence mode='wait'>
                {loading ? (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-24 bg-slate-800/30 rounded-xl animate-pulse"
                    />
                ) : (
                    <motion.div
                        key={prompt?.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/10 rounded-xl p-6 relative overflow-hidden"
                    >
                        <div className="flex items-start gap-4 z-10 relative">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-purple-300 mb-1 uppercase tracking-wider">
                                    Daily Reflection
                                </h3>
                                <p className="text-lg text-slate-200 font-medium leading-relaxed">
                                    {prompt?.text}
                                </p>
                            </div>
                            <button
                                onClick={refreshPrompt}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                title="New Prompt"
                            >
                                <RefreshCw className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
