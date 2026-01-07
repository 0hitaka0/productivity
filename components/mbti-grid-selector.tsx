
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, ArrowRight, HelpCircle } from 'lucide-react';
import { MBTIType, MBTI_DATA, MBTIProfile } from '@/lib/mbti-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface MbtiGridSelectorProps {
    onSelect: (type: MBTIType) => void;
    selectedType?: MBTIType | null;
}

const TEMPERAMENTS = {
    Analysts: { color: 'bg-purple-500', border: 'border-purple-500/50', text: 'text-purple-400', bgHover: 'hover:bg-purple-500/10' },
    Diplomats: { color: 'bg-green-500', border: 'border-green-500/50', text: 'text-green-400', bgHover: 'hover:bg-green-500/10' }, // Prompt said green, usually Diplomats are green in 16p, Sentinels blue. 
    Sentinels: { color: 'bg-sky-500', border: 'border-sky-500/50', text: 'text-sky-400', bgHover: 'hover:bg-sky-500/10' },
    Explorers: { color: 'bg-amber-500', border: 'border-amber-500/50', text: 'text-amber-400', bgHover: 'hover:bg-amber-500/10' }
};

export function MbtiGridSelector({ onSelect, selectedType: initialSelected }: MbtiGridSelectorProps) {
    const [selected, setSelected] = useState<MBTIType | null>(initialSelected || null);
    const [hovered, setHovered] = useState<MBTIType | null>(null);

    // Load from local storage on mount
    // specific fix for Bug #2: Selection Persists After Cancel
    // Sync internal state with prop changes allowed parent to clear selection
    useEffect(() => {
        setSelected(initialSelected || null);
    }, [initialSelected]);

    const handleSelect = (type: MBTIType) => {
        setSelected(type);
        localStorage.setItem('mbti_selection', type);
        onSelect(type);
    };

    // Group types by temperament
    const groupedTypes = Object.values(MBTI_DATA).reduce((acc, profile) => {
        const temp = profile.temperament || 'Analysts'; // Fallback
        if (!acc[temp]) acc[temp] = [];
        acc[temp].push(profile);
        return acc;
    }, {} as Record<string, MBTIProfile[]>);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12">

            {/* Header / Intro */}
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                    Choose Your Path
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Select your personality type to personalize your journaling experience.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <Link href="https://www.16personalities.com/free-personality-test" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors border-b border-white/20 hover:border-white">
                        <HelpCircle className="w-4 h-4" /> Not sure? Take a quick test
                    </Link>
                </div>
            </div>

            {/* Temperament Grid Sections */}
            <div className="space-y-16">
                {(['Analysts', 'Diplomats', 'Sentinels', 'Explorers'] as const).map((temperament) => (
                    <div key={temperament} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className={cn("h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent",
                                TEMPERAMENTS[temperament].border.replace('border', 'via') // Hacky gradient reuse
                            )}></span>
                            <h3 className={cn("text-xl font-bold uppercase tracking-widest", TEMPERAMENTS[temperament].text)}>
                                {temperament}
                            </h3>
                            <span className={cn("h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent",
                                TEMPERAMENTS[temperament].border.replace('border', 'via')
                            )}></span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {groupedTypes[temperament]?.map((profile) => (
                                <TypeCard
                                    key={profile.type}
                                    profile={profile}
                                    isSelected={selected === profile.type}
                                    isHovered={hovered === profile.type}
                                    temperamentConfig={TEMPERAMENTS[temperament]}
                                    onSelect={() => handleSelect(profile.type)}
                                    onHover={setHovered}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

function TypeCard({
    profile,
    isSelected,
    isHovered,
    temperamentConfig,
    onSelect,
    onHover
}: {
    profile: MBTIProfile;
    isSelected: boolean;
    isHovered: boolean;
    temperamentConfig: any;
    onSelect: () => void;
    onHover: (t: MBTIType | null) => void;
}) {
    return (
        <motion.button
            onClick={onSelect}
            onMouseEnter={() => onHover(profile.type)}
            onMouseLeave={() => onHover(null)}
            layout
            className={cn(
                "relative group flex flex-col items-start text-left p-6 rounded-2xl border transition-all duration-300 h-full min-h-[160px]",
                "bg-slate-900/40 backdrop-blur-sm",
                isSelected
                    ? `border-${temperamentConfig.color.replace('bg-', '')} shadow-[0_0_30px_rgba(0,0,0,0.3)] bg-slate-800`
                    : "border-white/5 hover:border-white/20",
                temperamentConfig.bgHover
            )}
            style={{
                borderColor: isSelected ? undefined : undefined
            }}
        >
            {/* Background Glow on Select */}
            {isSelected && (
                <div className={cn("absolute inset-0 rounded-2xl opacity-20 blur-xl transition-all", temperamentConfig.color)} />
            )}

            <div className="relative z-10 w-full">
                <div className="flex justify-between items-start w-full mb-2">
                    <h4 className={cn("text-3xl font-black tracking-tighter", isSelected ? "text-white" : "text-slate-200")}>
                        {profile.type}
                    </h4>
                    {isSelected && <Check className={cn("w-6 h-6", temperamentConfig.text)} />}
                </div>

                <p className={cn("text-sm font-medium uppercase tracking-wider mb-4", temperamentConfig.text)}>
                    {profile.name}
                </p>

                <div className="mt-auto">
                    {/* Cognitive Stack Mini Preview (V2 Feature) */}
                    <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        {profile.cognitiveFunctions?.map((func, i) => (
                            <span key={i} className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                                {func}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Expanded Content on Hover/Select - Animated */}
            <AnimatePresence>
                {isHovered && !isSelected && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 flex flex-col justify-center border border-white/10 z-20"
                    >
                        <p className="text-sm text-slate-300 leading-relaxed">
                            {profile.intro.slice(0, 100)}...
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-white font-bold uppercase tracking-widest">
                            Select <ArrowRight className="w-3 h-3" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
