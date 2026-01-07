
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Brain, Heart, Shield, Compass, Sparkles, Check, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MBTIProfile } from '@/lib/mbti-data';

interface MbtiConfirmationModalProps {
    isOpen: boolean;
    selectedType: MBTIProfile;
    onConfirm: () => void;
    onCancel: () => void;
}

const TEMPERAMENT_CONFIG = {
    Analysts: {
        color: 'text-purple-400',
        bg: 'from-purple-900/90 to-slate-900',
        border: 'border-purple-500/30',
        button: 'bg-purple-600 hover:bg-purple-500',
        icon: Brain,
        headline: "Strategic insights await.",
        subtext: "Your analytical mind is ready to be understood. Shall we begin?"
    },
    Diplomats: {
        color: 'text-green-400',
        bg: 'from-green-900/90 to-slate-900',
        border: 'border-green-500/30',
        button: 'bg-green-600 hover:bg-green-500',
        icon: Heart,
        headline: "Your journey of meaning starts here.",
        subtext: "Ready to explore the depths of who you are and connect authentically?"
    },
    Sentinels: {
        color: 'text-sky-400',
        bg: 'from-sky-900/90 to-slate-900',
        border: 'border-sky-500/30',
        button: 'bg-sky-600 hover:bg-sky-500',
        icon: Shield,
        headline: "A structured path to growth awaits.",
        subtext: "Ready to build on your strengths and create lasting stability?"
    },
    Explorers: {
        color: 'text-amber-400',
        bg: 'from-amber-900/90 to-slate-900',
        border: 'border-amber-500/30',
        button: 'bg-amber-600 hover:bg-amber-500',
        icon: Compass,
        headline: "Adventure into self-discovery begins now.",
        subtext: "Ready to experience growth your way and seize the moment?"
    }
};

export function MbtiConfirmationModal({
    isOpen,
    selectedType,
    onConfirm,
    onCancel
}: MbtiConfirmationModalProps) {
    const [isConfirming, setIsConfirming] = useState(false);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) setIsConfirming(false);
    }, [isOpen]);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
            if (e.key === 'Enter') handleConfirm();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onCancel, onConfirm]); // Added onConfirm dependency for handleConfirm logic

    const handleConfirm = async () => {
        setIsConfirming(true);
        // Simulate a small delay for "Setting up..." feel if needed, 
        // but for now we just pass through to parent
        onConfirm();
    };

    if (!selectedType) return null;

    const config = TEMPERAMENT_CONFIG[selectedType.temperament || 'Analysts'];
    const Icon = config.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={cn(
                            "relative w-full max-w-[480px] rounded-3xl overflow-hidden shadow-2xl border",
                            "bg-gradient-to-br", config.bg, config.border
                        )}
                    >
                        {/* Ambient Glow Particles (Simplified CSS) */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className={cn("absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] opacity-20", config.color.replace('text', 'bg'))} />
                            <div className={cn("absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-[80px] opacity-20", config.color.replace('text', 'bg'))} />
                        </div>

                        <div className="relative p-8 md:p-10 flex flex-col items-center text-center space-y-8">

                            {/* Close Button */}
                            <button onClick={() => {
                                console.log('X button clicked');
                                onCancel();
                            }} className="absolute top-4 right-4 p-2 text-white/30 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header Section */}
                            <div className="space-y-4 flex flex-col items-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="relative"
                                >
                                    {/* Breathing Glow */}
                                    <div className={cn("absolute inset-0 blur-xl opacity-30 animate-pulse", config.color.replace('text', 'bg'))} />
                                    <h2 className={cn("text-7xl font-black tracking-tighter relative z-10", config.color)}>
                                        {selectedType.type}
                                    </h2>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-2 text-white/90"
                                >
                                    <Icon className={cn("w-5 h-5", config.color)} />
                                    <span className="text-2xl font-medium font-serif italic">
                                        {selectedType.name}
                                    </span>
                                </motion.div>
                            </div>

                            {/* Cognitive Stack Orbit (Abstract Visual) */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex gap-3 justify-center py-2"
                            >
                                {selectedType.cognitiveFunctions?.map((func, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1 group cursor-default">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border bg-white/5 backdrop-blur-sm transition-all group-hover:scale-110",
                                            config.border,
                                            "text-slate-300"
                                        )}>
                                            {func}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Copy Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-3"
                            >
                                <h3 className="text-xl font-bold text-white leading-tight">
                                    {config.headline}
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed px-4">
                                    {config.subtext}
                                </p>
                            </motion.div>

                            {/* Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="w-full space-y-3 pt-2"
                            >
                                <button
                                    onClick={() => {
                                        console.log('Begin Journey clicked');
                                        handleConfirm();
                                    }}
                                    disabled={isConfirming}
                                    className={cn(
                                        "w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 relative overflow-hidden group",
                                        config.button
                                    )}
                                >
                                    {isConfirming ? (
                                        <>
                                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/50 border-t-white" />
                                            Preparing your space...
                                        </>
                                    ) : (
                                        <>
                                            Begin My Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                    <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>

                                <button
                                    onClick={() => {
                                        console.log('Reconsider clicked');
                                        onCancel();
                                    }}
                                    className="w-full py-3 text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 group"
                                >
                                    <RotateCcw className="w-3 h-3 group-hover:-rotate-180 transition-transform duration-500" />
                                    Wait, let me reconsider
                                </button>
                            </motion.div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
