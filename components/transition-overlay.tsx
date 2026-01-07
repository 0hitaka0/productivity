
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MBTIType, MBTI_DATA } from '@/lib/mbti-data';

interface TransitionOverlayProps {
    isActive: boolean;
    type: MBTIType | null;
    onComplete?: () => void;
}

const TEMPERAMENT_CONFIG = {
    Analysts: { color: 'bg-purple-900', accent: 'bg-purple-500' },
    Diplomats: { color: 'bg-green-900', accent: 'bg-green-500' },
    Sentinels: { color: 'bg-sky-900', accent: 'bg-sky-500' },
    Explorers: { color: 'bg-amber-900', accent: 'bg-amber-500' }
};

export function TransitionOverlay({ isActive, type, onComplete }: TransitionOverlayProps) {
    if (!type) return null;

    const profile = MBTI_DATA[type];
    const config = TEMPERAMENT_CONFIG[profile.temperament || 'Analysts'];

    return (
        <AnimatePresence onExitComplete={onComplete}>
            {isActive && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Background Fill - Expands from center */}
                    <motion.div
                        className={cn("absolute inset-0 z-10", config.color)}
                        initial={{ scale: 0, borderRadius: "100%" }}
                        animate={{ scale: 2.5, borderRadius: "0%" }}
                        transition={{ duration: 1.2, ease: "circIn" }}
                    />

                    {/* Floating Particles/Orbs (Simple CSS animation) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="absolute inset-0 z-20 overflow-hidden"
                    >
                        <div className={cn("absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-50 animate-pulse", config.accent)} />
                    </motion.div>

                    {/* Text Fade In */}
                    <motion.div
                        className="relative z-30 text-center space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-widest uppercase drop-shadow-2xl">
                            Entering Your World
                        </h2>
                        <p className="text-white/80 text-xl font-light italic">
                            {profile.name}
                        </p>
                    </motion.div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}
