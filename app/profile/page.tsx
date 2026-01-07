"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { MBTI_DATA, MBTIType } from '@/lib/mbti-data';
import { motion } from 'framer-motion';
import { LogOut, User, Mail, Sparkles, Calendar } from 'lucide-react';

export default function ProfilePage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const [profileData, setProfileData] = useState<any>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);


    // Only show if user exists
    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    const mbtiInfo = user.mbtiType && MBTI_DATA[user.mbtiType as MBTIType];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className={`absolute top-0 right-0 w-[50%] h-[50%] bg-${mbtiInfo ? 'purple' : 'slate'}-500/10 rounded-full blur-[120px]`} />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto z-10 relative">
                <header className="flex justify-between items-center mb-12">
                    <h1 className="text-2xl font-bold">Profile</h1>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-xl"
                    >
                        <div className="flex items-start gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-3xl font-bold shadow-lg shadow-purple-500/20">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-1">{user.name}</h2>
                                <div className="flex items-center gap-2 text-slate-400 mb-4">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </div>
                                {user.mbtiType && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-medium">
                                        <Sparkles className="w-3 h-3" />
                                        {user.mbtiType}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* MBTI Details Card (if exists) */}
                    {mbtiInfo && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden group"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${mbtiInfo.theme.gradient} opacity-10`} />

                            <h3 className="text-lg font-semibold text-slate-300 mb-1">Your Archetype</h3>
                            <div className="text-4xl font-bold text-white mb-2">{mbtiInfo.name}</div>
                            <div className="text-slate-400 mb-6">{mbtiInfo.alias}</div>

                            <div className="space-y-2">
                                {mbtiInfo.tags.slice(0, 3).map((tag: string) => (
                                    <div key={tag} className="text-sm px-3 py-1.5 bg-slate-800/50 rounded-lg text-slate-300 capitalize border border-slate-700/50">
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
