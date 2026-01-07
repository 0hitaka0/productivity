
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MBTIType, MBTI_DATA } from '@/lib/mbti-data';
import { Sparkles } from 'lucide-react';

interface PersonalizedGreetingProps {
    userType: MBTIType | undefined;
    userName: string;
    showWelcome?: boolean;
}

const TYPE_GREETINGS: Record<string, string> = {
    INTJ: "Your system for strategic self-mastery is ready.",
    INTP: "A space to explore the architecture of your thoughts.",
    ENTJ: "Your command center for personal excellence awaits.",
    ENTP: "Endless possibilities for exploration begin here.",
    INFJ: "Your sanctuary for deep reflection is ready.",
    INFP: "A canvas for your inner world, as unique as you are.",
    ENFJ: "Your journey of growth and connection starts now.",
    ENFP: "Your adventure in self-discovery begins!",
    ISTJ: "Your organized space for thoughtful reflection.",
    ISFJ: "A gentle space to care for your inner self.",
    ESTJ: "Your efficient system for personal development.",
    ESFJ: "A supportive space to nurture your growth.",
    ISTP: "A no-nonsense toolkit for understanding yourself.",
    ISFP: "A space as free and authentic as your spirit.",
    ESTP: "Skip the fluff. Let's get to the real stuff.",
    ESFP: "Your vibrant space to capture life's moments!"
};

export function PersonalizedGreeting({ userType, userName, showWelcome }: PersonalizedGreetingProps) {
    const profile = userType ? MBTI_DATA[userType] : null;
    const greeting = profile ? TYPE_GREETINGS[profile.type] : "Your personal growth journey continues.";

    return (
        <div className="space-y-2">
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-white tracking-tight flex items-center gap-3"
            >
                {showWelcome ? (
                    <>
                        Welcome, {profile?.type || 'Traveler'} <span className="text-slate-500 font-light hidden md:inline">| {profile?.name}</span>
                    </>
                ) : (
                    <>
                        Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {userName}
                    </>
                )}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400 text-lg flex items-center gap-2"
            >
                <Sparkles className="w-4 h-4 text-amber-400" />
                {greeting}
            </motion.p>
        </div>
    );
}
