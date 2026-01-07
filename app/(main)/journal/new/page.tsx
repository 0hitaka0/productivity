'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { JournalEntryEditor } from '../components/journal-entry-editor';

function NewEntryContent() {
    const searchParams = useSearchParams();
    const prompt = searchParams.get('prompt');
    const [initialData, setInitialData] = useState<{ title: string; content: string } | undefined>(undefined);

    useEffect(() => {
        if (prompt) {
            const promptHtml = `
                <blockquote>
                    <strong>Today's Prompt:</strong><br/>
                    ${prompt}
                </blockquote>
                <p></p>
            `;
            setInitialData({
                title: 'Daily Reflection',
                content: promptHtml
            });
        }
    }, [prompt]);

    // Key avoids rendering editor until we know if there is initial data or not?
    // Actually, if initialData changes, we might want to reset editor?
    // The editor uses initialData only on mount (useState default).
    // So we should key it if prompt loads late.

    // If prompt is present, we wait for it? 
    // Effect runs client side.

    // Let's just key it.
    const key = prompt ? (initialData ? 'loaded' : 'loading') : 'default';

    if (prompt && !initialData) {
        return <div className="text-white text-center pt-20">Preparing entry...</div>;
    }

    return (
        <JournalEntryEditor initialData={initialData} key={key} />
    );
}

export default function NewEntryPage() {
    return (
        <Suspense fallback={<div className="text-white text-center pt-20">Loading Editor...</div>}>
            <NewEntryContent />
        </Suspense>
    );
}
