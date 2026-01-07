'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RichEditor } from '@/components/ui/rich-editor';
import { GlassCard } from '@/components/ui/glass-card';
import { useMBTI } from '@/components/providers/mbti-provider';
import { ConfirmModal } from '@/components/confirm-modal';

interface JournalEntryEditorProps {
    initialData?: {
        id?: string;
        title: string;
        content: string;
    };
    onSave?: () => void; // Optional callback after save
}

export function JournalEntryEditor({ initialData }: JournalEntryEditorProps) {
    const router = useRouter();
    const { profile } = useMBTI();

    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [entryId, setEntryId] = useState<string | null>(initialData?.id || null);

    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [dateStr, setDateStr] = useState('');
    const [timeStr, setTimeStr] = useState('');
    const [pendingNavigation, setPendingNavigation] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    useEffect(() => {
        setDateStr(new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }));
        setTimeStr(new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
        const interval = setInterval(() => {
            setTimeStr(new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    // Save Function
    const saveJournal = async (isManual = false) => {
        if (!title && !content) return;

        if (isSaving) {
            if (isManual) setPendingNavigation(true);
            return;
        }

        setIsSaving(true);
        if (isManual) setPendingNavigation(true);

        try {
            const res = await fetch('/api/journal/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...(entryId ? { id: entryId } : {}),
                    title,
                    content,
                    mood: null
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.id) setEntryId(data.id);
                setLastSaved(new Date());
            } else {
                console.error("Save failed:", await res.text());
                if (isManual) setPendingNavigation(false);
            }
        } catch (error) {
            console.error('Failed to save', error);
            if (isManual) setPendingNavigation(false);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle navigation
    useEffect(() => {
        if (pendingNavigation && !isSaving && lastSaved) {
            router.back();
            // Better to go back than force '/journal', because we might have come from dashboard or list
            // actually, if we are in 'new', back goes to where we came from.
            // if we are in 'edit', back goes to detail?
            // Let's stick to router.push('/journal') for consistency or check where we are?
            // For now, let's use router.push('/journal') to be safe, or allow override.
            router.push('/journal');
        }
    }, [pendingNavigation, isSaving, lastSaved, router]);

    // Auto-save logic
    useEffect(() => {
        // Disable auto-save if we are editing an existing entry (user must consciously save per requests)
        // But still enable it for new entries to prevent data loss?
        // User request: "turn off auto save when editing"
        if (initialData?.id) {
            return;
        }

        const timer = setTimeout(() => {
            if (title || content) {
                saveJournal(false);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [title, content, entryId, initialData]);

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-6 animate-fade-in">
            {/* Header */}
            <header className="flex items-center justify-between sticky top-0 z-50 py-4 bg-black/50 backdrop-blur-md -mx-4 px-4 md:mx-0 md:px-0 md:bg-transparent md:backdrop-blur-none">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-slate-400 hover:text-white"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                    {isSaving ? (
                        <span className="flex items-center gap-1 text-yellow-500">
                            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                            Saving...
                        </span>
                    ) : lastSaved ? (
                        <span className="text-green-500/80">
                            Saved {lastSaved.toLocaleTimeString()}
                        </span>
                    ) : (
                        <span>Unsaved</span>
                    )}
                    <Button
                        size="sm"
                        onClick={() => {
                            if (initialData?.id) {
                                setShowSaveModal(true);
                            } else {
                                saveJournal(true);
                            }
                        }}
                        disabled={pendingNavigation}
                        className="bg-white/10 hover:bg-white/20 text-white border-0 disabled:opacity-50"
                    >
                        {pendingNavigation ? 'Saving...' : 'Done'}
                    </Button>
                </div>
            </header>

            {/* Meta Data Bar */}
            <div className="flex items-center gap-4 text-slate-400 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                    <Calendar className="w-3.5 h-3.5" />
                    {dateStr || 'Loading...'}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                    <Calendar className="w-3.5 h-3.5" />
                    {timeStr || '--:--'}
                </div>
                {/* Type Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5" style={{ borderColor: `${profile.theme.primary}40` }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: profile.theme.primary }} />
                    <span style={{ color: profile.theme.primary }}>{profile.alias}</span>
                </div>
            </div>

            {/* Editor Container */}
            <GlassCard className="min-h-[70vh] p-8 md:p-12 relative overflow-hidden group">
                {/* Subtle gradient blob behind editor */}
                <div
                    className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -z-10 opacity-10 transition-colors duration-1000"
                    style={{ backgroundColor: profile.theme.primary }}
                />

                <div className="space-y-8">
                    {/* Title Input */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Untitled Entry"
                        className="w-full bg-transparent border-none text-4xl md:text-5xl font-bold text-white placeholder:text-white/20 focus:ring-0 px-0 py-2"
                    />

                    {/* Rich Editor */}
                    <div className="prose prose-invert max-w-none prose-lg">
                        <RichEditor
                            content={content}
                            onChange={setContent}
                            placeholder="What's on your mind today? Type '/' for commands..."
                        />
                    </div>
                </div>
            </GlassCard>

            <ConfirmModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onConfirm={() => {
                    setShowSaveModal(false);
                    saveJournal(true);
                }}
                title="Save Changes?"
                message="Are you sure you want to save your changes? The previous version of this entry will be overwritten."
                confirmText="Save Changes"
                cancelText="Cancel"
            />
        </div>
    );
}
