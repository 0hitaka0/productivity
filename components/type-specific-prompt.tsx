
'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Heart, Zap, Compass, RefreshCw, PenLine } from 'lucide-react';
import { MBTIType, MBTI_DATA } from '@/lib/mbti-data';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getDayOfYear } from 'date-fns';

interface TypeSpecificPromptProps {
    userType: MBTIType | undefined;
}

const CATEGORIES = [
    { icon: Brain, color: "text-purple-400", label: "Reflection" },
    { icon: Zap, color: "text-amber-400", label: "Action" },
    { icon: Heart, color: "text-pink-400", label: "Feeling" },
    { icon: Compass, color: "text-green-400", label: "Growth" }
];

export function TypeSpecificPrompt({ userType }: TypeSpecificPromptProps) {
    const [promptText, setPromptText] = useState("");
    const [categoryIndex, setCategoryIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (userType && MBTI_DATA[userType]) {
            const prompts = MBTI_DATA[userType].prompts;
            if (prompts && prompts.length > 0) {
                // Get day of year to rotate daily
                const dayOfYear = getDayOfYear(new Date());
                // Use dayOfYear to select prompt index
                const index = dayOfYear % prompts.length;
                setPromptText(prompts[index]);
                // Vary category based on day too
                setCategoryIndex(dayOfYear % CATEGORIES.length);
            }
        }
    }, [userType]);

    if (!mounted || !userType || !promptText) return null;

    const Category = CATEGORIES[categoryIndex];
    const Icon = Category.icon;

    return (
        <Card className="p-6 bg-slate-900/40 border-white/5 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Optional: Add manual refresh if user really wants another one, but default is daily fixed */}
            </div>

            <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white/5", Category.color)}>
                        {Category.label}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                        For {userType}
                    </span>
                </div>

                <h3 className="text-xl md:text-2xl font-serif leading-relaxed text-slate-200">
                    "{promptText}"
                </h3>

                <div className="pt-4">
                    <Link href={`/journal/new?prompt=${encodeURIComponent(promptText)}`}>
                        <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/30 transition-all w-full md:w-auto gap-2">
                            <PenLine className="w-4 h-4" /> Write about this
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Ambient Background */}
            <div className={cn("absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-transparent to-white/5 rounded-full blur-2xl pointer-events-none")} />
        </Card>
    );
}
