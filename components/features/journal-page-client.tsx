"use client";

import { useState } from "react";
import { JournalList } from "@/components/features/journal-list";
import { JournalEditor } from "@/components/features/journal-editor";
import { cn } from "@/lib/utils";
// We need to fetch entries. Since this is a client component for state management, 
// we might want a wrapper server component to fetch initial data.
// But let's build the wrapper below.

interface JournalPageProps {
    initialEntries: any[]; // Type properly later
    initialCategories: any[];
    userId: string;
}

export default function JournalPageInternal({ initialEntries, initialCategories, userId }: JournalPageProps) {
    const [entries, setEntries] = useState(initialEntries);
    const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

    // Sync with props if needed, but better to just use initial and manage locally + revalidate

    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [viewSource, setViewSource] = useState<'active' | 'trash'>('active');

    // We need to fetch entries when viewSource changes. 
    // For MVP, since we passed initialEntries, let's just use server actions here.
    // Ideally use SWR or React Query, but manual fetch is fine.

    // We already have `entries` state.
    // Let's import getEntries to use client-side (it's a server action, safe).
    const [isLoading, setIsLoading] = useState(false);

    async function toggleViewSource(source: 'active' | 'trash') {
        if (source === viewSource) return;
        setIsLoading(true);
        setViewSource(source);
        setSelectedEntry(null);

        // Dynamic import to avoid cycle if any? No, direct import is fine for server actions.
        const { getEntries } = await import("@/actions/journal");
        const res = await getEntries(userId, { onlyDeleted: source === 'trash' });
        if (res.success) {
            setEntries(res.data);
        }
        setIsLoading(false);
    }

    function handleSelect(id: string) {
        const entry = entries.find(e => e.id === id);
        setSelectedEntry(entry || null);
    }

    function handleNew() {
        setSelectedEntry({
            id: undefined, // New
            userId: userId,
            content: "",
            title: "",
            mood: ""
        });
        // Switch to list view to see editor nicely if currently in grid
        if (viewMode === 'grid') setViewMode('list');
    }

    return (
        <div className="h-full flex rounded-2xl border border-purple-500/20 overflow-hidden shadow-soft-lg bg-white dark:bg-midnight-950">
            <div className={cn(
                "transition-all duration-300 ease-in-out",
                viewMode === 'grid' ? "w-full" : "w-1/3 min-w-[300px] max-w-[350px]"
            )}>
                <JournalList
                    entries={entries}
                    selectedId={selectedEntry?.id || null}
                    onSelect={handleSelect}
                    onNew={handleNew}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    viewSource={viewSource}
                    onViewSourceChange={toggleViewSource}
                    isLoading={isLoading}
                />
            </div>

            {/* Editor only visible in list (split) mode */}
            {viewMode === 'list' && (
                <div className="flex-1">
                    <JournalEditor
                        entry={selectedEntry}
                        categories={initialCategories}
                        isTrash={viewSource === 'trash'}
                        onSave={() => {
                            // Ideally optimistic update or re-fetch
                            // router.refresh();
                        }}
                        onDelete={() => {
                            setSelectedEntry(null);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
