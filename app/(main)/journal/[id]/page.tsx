"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Calendar, Edit2, Trash } from 'lucide-react';
import Link from 'next/link';
import { ConfirmModal } from '@/components/confirm-modal';

export default function JournalEntryPage() {
    const params = useParams();
    const router = useRouter();
    const [entry, setEntry] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                const res = await fetch(`/api/journal/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setEntry(data);
                } else {
                    setError(`Failed to load entry: ${res.status} ${res.statusText}`);
                }
            } catch (err: any) {
                setError(err.message || "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchEntry();
    }, [params.id]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/journal/${params.id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                router.push('/dashboard');
            } else {
                alert("Failed to delete entry");
                setIsDeleting(false);
            }
        } catch (error) {
            console.error("Delete failed", error);
            alert("Error deleting entry");
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-red-400">
                <p className="mb-4">{error}</p>
                <Link href="/dashboard" className="text-purple-400 hover:text-purple-300">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    if (!entry) return null;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <Link href="/journal">
                        <button className="flex items-center text-slate-400 hover:text-white transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Journal
                        </button>
                    </Link>

                    <div className="flex gap-2">
                        <Link href={`/journal/${params.id}/edit`}>
                            <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-sm transition-colors flex items-center gap-2">
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>
                        </Link>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            disabled={isDeleting}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm transition-colors flex items-center gap-2"
                        >
                            <Trash className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/50 mb-4">
                            {entry.title || 'Untitled Entry'}
                        </h1>
                        <div className="flex items-center gap-4 text-slate-500 text-sm">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(entry.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            {entry.moodEntry && entry.moodEntry.length > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">
                                    {entry.moodEntry[0].moodValue}/10 Mood
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Display */}
            <div className="prose prose-invert prose-lg max-w-none bg-slate-900/30 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div dangerouslySetInnerHTML={{ __html: entry.content }} />
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Entry?"
                message="Are you sure you want to delete this journal entry? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive={true}
                isLoading={isDeleting}
            />
        </div>
    );
}
