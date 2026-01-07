"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Plus, Calendar, Search } from 'lucide-react';

export default function JournalPage() {
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                // Should potentially update API to support "all" or pagination, 
                // but default limit is 5. Let's make a new API call or assume route handles query limit? 
                // For now, let's just fetch default and fix API next if needed.
                // Or better, let's just check if the current API supports 'limit'.
                // Checking route.ts... it has hardcoded `take: 5`. 
                // I will need to update the API to support unlimited or pagination first?
                // Actually, let's assume I will update the API right after this.
                const res = await fetch('/api/journal?limit=50');
                if (res.ok) {
                    const data = await res.json();
                    setEntries(data.entries || []);
                }
            } catch (error) {
                console.error("Failed to fetch entries", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEntries();
    }, []);

    const filteredEntries = entries.filter(entry =>
    (entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="h-full flex flex-col space-y-8 animate-fade-in p-2">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Journal</h1>
                    <p className="text-slate-400">Your personal space for reflection and growth.</p>
                </div>
                <Link href="/journal/new">
                    <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-full transition-all shadow-lg shadow-purple-600/20 font-medium">
                        <Plus className="w-5 h-5" />
                        <span>Write New</span>
                    </button>
                </Link>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
            ) : filteredEntries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEntries.map((entry) => (
                        <Link href={`/journal/${entry.id}`} key={entry.id} className="group">
                            <div className="h-full bg-slate-900/30 border border-white/5 rounded-2xl p-6 hover:bg-white/5 hover:border-purple-500/20 transition-all flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-slate-200 group-hover:text-purple-300 transition-colors line-clamp-1 mb-2">
                                        {entry.title || "Untitled Entry"}
                                    </h3>
                                    <div className="flex items-center text-xs text-slate-500">
                                        <Calendar className="w-3 h-3 mr-1.5" />
                                        {new Date(entry.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div
                                    className="text-slate-400 text-sm line-clamp-4 flex-1"
                                    dangerouslySetInnerHTML={{ __html: entry.content }}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-slate-500">
                    No entries found.
                </div>
            )}
        </div>
    );
}
