"use client";

import React, { useState, useEffect } from 'react';
import { MBTI_DATA, MBTIType } from '@/lib/mbti-data';
import { Planet } from '@/components/ui/planet';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface PlanetSelectorProps {
    onSelect: (type: MBTIType) => void;
    initialType?: MBTIType;
    buttonText?: string;
    showDescription?: boolean;
    showGrowth?: boolean;
}

export function PlanetSelector({
    onSelect,
    initialType,
    buttonText = "Select",
    showDescription = true,
    showGrowth = false
}: PlanetSelectorProps) {
    const types = Object.keys(MBTI_DATA) as MBTIType[];
    const [activeIndex, setActiveIndex] = useState(
        initialType ? types.indexOf(initialType) : 0
    );

    const handleNext = () => setActiveIndex((prev) => (prev + 1) % types.length);
    const handlePrev = () => setActiveIndex((prev) => (prev - 1 + types.length) % types.length);

    const handleSelect = () => {
        onSelect(types[activeIndex]);
    };

    const handlePlanetClick = (index: number) => {
        setActiveIndex(index);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="relative w-full h-full min-h-[700px] flex flex-col items-center justify-between perspective-1000 py-4 md:py-8">

            {/* Top: Title & Type (Yellow Box Area) */}
            <div className={`z-20 text-center animate-fade-in transition-all duration-300 flex flex-col items-center gap-1 ${showGrowth ? 'mt-4' : 'mt-12'}`}>
                <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter font-sans drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
                    style={{ textShadow: `0 0 80px ${MBTI_DATA[types[activeIndex]].theme.primary}55` }}
                >
                    {types[activeIndex]}
                </h2>
                <p className="text-xl md:text-2xl text-purple-200 uppercase tracking-[0.3em] font-medium opacity-90">
                    {MBTI_DATA[types[activeIndex]].name}
                </p>
                {/* Intro blurb if we have space or mode requires it, simplistic for now */}
            </div>

            {/* Middle: Planet Carousel (Blue Box Area) */}
            <div className="relative w-full h-[400px] flex items-center justify-center z-10 perspective-1000 my-4">
                {types.map((type, i) => {
                    let offset = i - activeIndex;
                    if (offset > types.length / 2) offset -= types.length;
                    if (offset < -types.length / 2) offset += types.length;

                    if (Math.abs(offset) > 3) return null;

                    return (
                        <Planet
                            key={type}
                            type={type}
                            isActive={offset === 0}
                            index={offset}
                            onClick={() => handlePlanetClick(i)}
                        />
                    );
                })}
            </div>

            {/* Bottom: Options & Details (Orange Box Area) */}
            <div className="z-20 flex flex-col items-center gap-6 w-full max-w-3xl px-6 pb-8">

                {/* Journal Style Card for Insight */}
                {showGrowth && (
                    <div className="w-full bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-slate-900/60 transition-colors animate-fade-in-up">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="flex-1 space-y-3">
                                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Personalized Journal Experience</span>
                                <h3 className="text-xl font-medium text-white">
                                    {MBTI_DATA[types[activeIndex]].alias} Edition
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {MBTI_DATA[types[activeIndex]].journalStyle}
                                </p>
                            </div>

                            {/* Growth Insight Mini */}
                            <div className="md:w-1/3 w-full bg-white/5 rounded-xl p-4 border border-white/5">
                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">Core Improvement</span>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    {MBTI_DATA[types[activeIndex]].growth}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Controls & CTA */}
                <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center">
                    <button onClick={handlePrev} className="hidden md:flex p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all hover:scale-110 border border-white/5">
                        <ChevronLeft className="w-6 h-6 text-white/50 hover:text-white" />
                    </button>

                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={handleSelect}
                            className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 rounded-full shadow-2xl hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all hover:scale-105"
                        >
                            <span className="uppercase tracking-[0.2em] text-sm font-bold flex items-center gap-3 text-white">
                                {buttonText} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {types.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePlanetClick(i)}
                                    className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                        i === activeIndex ? "bg-white w-4" : "bg-white/20 hover:bg-white/40"
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    <button onClick={handleNext} className="hidden md:flex p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all hover:scale-110 border border-white/5">
                        <ChevronRight className="w-6 h-6 text-white/50 hover:text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
