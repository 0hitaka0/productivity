'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchAll, SearchResults } from '@/lib/actions/search-actions';
import { Loader2, Book, Repeat, CheckSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<SearchResults | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const performSearch = async () => {
            if (!query) return;
            setIsLoading(true);
            try {
                const data = await searchAll(query);
                setResults(data);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [query]);

    if (!query) {
        return (
            <div className="h-full flex items-center justify-center text-slate-500">
                Type in the sidebar to search...
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    const hasResults = results && (
        (results.journals && results.journals.length > 0) ||
        (results.habits && results.habits.length > 0) ||
        (results.tasks && results.tasks.length > 0)
    );

    return (
        <div className="p-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
            <h1 className="text-2xl font-light text-slate-200">
                Results for "<span className="text-purple-400 font-medium">{query}</span>"
            </h1>

            {!hasResults && (
                <div className="text-slate-500">No results found.</div>
            )}

            {results?.habits && results.habits.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Repeat className="w-4 h-4" /> Habits
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.habits.map(habit => (
                            <Link key={habit.id} href="/habits">
                                <Card className="p-4 bg-white/5 hover:bg-white/10 border-white/5 transition-colors group">
                                    <div className="font-medium text-slate-200 group-hover:text-purple-300">{habit.name}</div>
                                    {habit.motivation && <div className="text-sm text-slate-500 mt-1 line-clamp-1">"{habit.motivation}"</div>}
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {results?.journals && results.journals.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Book className="w-4 h-4" /> Journal Entries
                    </h2>
                    <div className="space-y-3">
                        {results.journals.map(entry => (
                            <Link key={entry.id} href={`/journal/${entry.id}`}>
                                <Card className="p-4 bg-white/5 hover:bg-white/10 border-white/5 transition-colors group">
                                    <div className="flex justify-between items-start">
                                        <div className="font-medium text-slate-200 group-hover:text-purple-300">{entry.title || 'Untitled'}</div>
                                        <div className="text-xs text-slate-600">{new Date(entry.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-sm text-slate-500 mt-2 line-clamp-2">{entry.content}</div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {results?.tasks && results.tasks.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <CheckSquare className="w-4 h-4" /> Tasks
                    </h2>
                    <div className="space-y-2">
                        {results.tasks.map(task => (
                            <Link key={task.id} href="/tasks">
                                <Card className="p-3 bg-white/5 hover:bg-white/10 border-white/5 transition-colors flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full border border-white/20 ${task.status === 'done' ? 'bg-emerald-500 border-none' : ''}`} />
                                    <div className="font-medium text-slate-200">{task.title}</div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
