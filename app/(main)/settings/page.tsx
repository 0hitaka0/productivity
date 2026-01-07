'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMBTI } from '@/components/providers/mbti-provider';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { RefreshCw, LogOut, User, Palette, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
    const { type, profile } = useMBTI();
    const router = useRouter();

    const handleRetake = () => {
        if (confirm('Are you sure you want to retake the assessment? This will update your entire journaling experience.')) {
            // Save current type validation for comparison later
            localStorage.setItem('previous_type', type);
            // Clear confirmation flag to allow access to onboarding
            localStorage.removeItem('mbti-confirmed');

            // Navigate
            router.push('/onboarding');
        }
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto pb-20">
            <header className="space-y-2">
                <h1 className="text-4xl font-light tracking-tight text-white">Settings</h1>
                <p className="text-slate-400">Manage your profile and preferences.</p>
            </header>

            {/* Profile Card */}
            <GlassCard className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h2 className="text-lg font-medium text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-slate-400" />
                            Personality Profile
                        </h2>
                        <p className="text-sm text-slate-400">Your cognitive architectural blueprint.</p>
                    </div>
                    <div className={cn("px-3 py-1 rounded-full text-xs font-bold text-black shadow-lg", `bg-${profile.theme.primary}`)}
                        style={{ backgroundColor: profile.theme.primary }}>
                        {type}
                    </div>
                </div>

                <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold text-black shrink-0 shadow-xl"
                        style={{ backgroundColor: profile.theme.primary }}>
                        {type.substring(0, 2)}
                    </div>
                    <div>
                        <div className="text-xl font-medium text-white">{profile.name}</div>
                        <div className="text-sm text-slate-400 italic">"The {profile.alias}"</div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-4">
                    <Button
                        variant="outline"
                        onClick={handleRetake}
                        className="w-full justify-start gap-3 h-12 border-white/10 hover:bg-white/5 hover:text-white transition-all group"
                    >
                        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        <div className="flex flex-col items-start">
                            <span className="font-medium">Retake Assessment</span>
                            <span className="text-[10px] text-slate-500 font-normal">Rediscover your type</span>
                        </div>
                    </Button>
                    <p className="text-xs text-center text-slate-500">
                        Your current journaling style is optimized for <span style={{ color: profile.theme.primary }}>{type}</span>.
                    </p>
                </div>
            </GlassCard>

            {/* Appearance (Placeholder) */}
            <GlassCard className="p-6 space-y-4 opacity-75">
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-slate-400" />
                    Appearance & Theme
                </h2>
                <div className="grid grid-cols-3 gap-3">
                    {['Cosmic', 'Nebula', 'Starlight'].map(theme => (
                        <div key={theme} className="h-20 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-xs text-slate-500 cursor-not-allowed">
                            {theme} <br /> (Coming Soon)
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Sign Out */}
            <div className="pt-8">
                <form action={async () => { }}>
                    <Button variant="destructive" className="w-full h-12 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-200 border border-red-900/30">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </form>
            </div>
        </div>
    );
}
