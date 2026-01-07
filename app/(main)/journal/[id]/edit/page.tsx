'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { JournalEntryEditor } from '../../components/journal-entry-editor';
import { Loader2 } from 'lucide-react';

export default function EditEntryPage() {
    const params = useParams();
    // Use resolved params via useEffect or just standard hook usage in client component (which allows async params but useParams is sync)
    // Next.js 15 breaking change: dynamic params are async in layouts/pages server side, but useParams() hook handles client side.
    const { id } = params as { id: string };
    const router = useRouter();
    const [entry, setEntry] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                const res = await fetch(`/api/journal/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setEntry(data);
                } else {
                    router.push('/journal'); // Redirect if not found
                }
            } catch (error) {
                console.error("Failed to fetch entry", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchEntry();
    }, [id, router]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    if (!entry) return null;

    return (
        <JournalEntryEditor initialData={entry} />
    );
}
