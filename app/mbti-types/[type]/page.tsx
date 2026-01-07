"use client";

import React, { use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { MBTI_DATA, MBTIType } from '@/lib/mbti-data';
import { StarsBackground } from '@/components/ui/stars-background';
import { Planet } from '@/components/ui/planet';
import { ArrowLeft, Target, Heart, Shield, Award, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MBTITypePage({ params }: { params: Promise<{ type: string }> }) {
    const { type } = use(params);
    const router = useRouter();
    const upperType = type.toUpperCase() as MBTIType;
    const data = MBTI_DATA[upperType];

    if (!data) {
        notFound();
    }

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
        })
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden selection:bg-purple-500/30">
            <StarsBackground />

            {/* Navigation */}
            <div className="absolute top-8 left-8 z-50">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>
            </div>

            <main className="container mx-auto px-6 py-20 relative z-10">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-20 mb-24 min-h-[60vh]">

                    {/* Planet Visual */}
                    <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0 animate-fade-in">
                        {/* We can reuse the Planet component here, but we need to mock some props it expects */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Planet
                                type={upperType}
                                isActive={true}
                                onClick={() => { }}
                                index={0}
                            />
                        </div>
                        {/* Glow effect behind planet */}
                        <div
                            className="absolute inset-0 bg-gradient-to-tr opacity-30 blur-[100px] -z-10 rounded-full"
                            style={{ backgroundImage: `linear-gradient(to top right, ${data.theme.primary}, ${data.theme.secondary})` }}
                        />
                    </div>

                    {/* Hero Text */}
                    <div className="text-center md:text-left space-y-6 max-w-2xl">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                {data.type}
                            </h1>
                            <h2 className="text-3xl md:text-4xl text-purple-400 font-light tracking-[0.2em] uppercase">
                                {data.name}
                            </h2>
                            <p className="text-xl text-slate-300 mt-6 leading-relaxed max-w-lg font-light">
                                {data.intro}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-8 justify-center md:justify-start">
                                {data.tags.map((tag: string) => (
                                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-white/5 border border-white/10 text-slate-400">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">

                    {/* Purpose & Mission */}
                    <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp as any} className="space-y-8">
                        <SectionCard
                            title="Seeking Purpose"
                            icon={<Target className="w-6 h-6 text-blue-400" />}
                            content={data.purpose}
                            color="blue"
                        />
                        <SectionCard
                            title="A Personal Mission"
                            icon={<Award className="w-6 h-6 text-amber-400" />}
                            content={data.mission}
                            color="amber"
                        />
                    </motion.div>

                    {/* Connection & Growth */}
                    <motion.div custom={2} initial="hidden" animate="visible" variants={fadeInUp as any} className="space-y-8">
                        <SectionCard
                            title="Connecting with Others"
                            icon={<Heart className="w-6 h-6 text-pink-400" />}
                            content={data.connection}
                            color="pink"
                        />
                        <SectionCard
                            title="Highest Version"
                            icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
                            content={data.growth}
                            color="emerald"
                        />
                    </motion.div>
                </div>

                {/* Strengths & Weaknesses (Full Width) */}
                <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp as any} className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 hover:border-emerald-500/20 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-emerald-500/10">
                                <Shield className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold">Strengths</h3>
                        </div>
                        <ul className="space-y-4">
                            {data.strengths.map((str: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5" />
                                    {str}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 hover:border-red-500/20 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-red-500/10">
                                <AlertCircle className="w-6 h-6 text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold">Weaknesses</h3>
                        </div>
                        <ul className="space-y-4">
                            {data.weaknesses.map((wk: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5" />
                                    {wk}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

            </main>
        </div>
    );
}

function SectionCard({ title, icon, content, color }: { title: string, icon: React.ReactNode, content: string, color: string }) {
    const borderColors: Record<string, string> = {
        blue: "hover:border-blue-500/30",
        amber: "hover:border-amber-500/30",
        pink: "hover:border-pink-500/30",
        emerald: "hover:border-emerald-500/30"
    };

    return (
        <div className={`bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 transition-colors duration-300 ${borderColors[color]}`}>
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl bg-slate-800/50`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
                {content}
            </p>
        </div>
    );
}
