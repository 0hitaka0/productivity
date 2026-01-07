"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar as CalendarIcon, Filter, LayoutGrid, List as ListIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { CategoriesDialog } from "@/components/features/categories-dialog";

interface JournalListProps {
    entries: any[]; // Type properly
    selectedId: string | null;
    onSelect: (id: string) => void;
    onNew: () => void;
    viewMode?: 'list' | 'grid';
    onViewModeChange?: (mode: 'list' | 'grid') => void;
    viewSource?: 'active' | 'trash';
    onViewSourceChange?: (source: 'active' | 'trash') => void;
    isLoading?: boolean;
}

export function JournalList({ entries, selectedId, onSelect, onNew, viewMode = 'list', onViewModeChange, viewSource = 'active', onViewSourceChange, isLoading }: JournalListProps) {
    const [search, setSearch] = useState("");
    const [moodFilter, setMoodFilter] = useState<string | null>(null);

    // Filter logic
    const filteredEntries = entries.filter(entry => {
        const matchesSearch = (entry.title?.toLowerCase().includes(search.toLowerCase()) ||
            entry.content?.toLowerCase().includes(search.toLowerCase()));
        const matchesMood = moodFilter ? entry.mood === moodFilter : true;

        return matchesSearch && matchesMood;
    });

    const isGrid = viewMode === 'grid';
    const isTrash = viewSource === 'trash';

    return (
        <div className="flex flex-col h-full bg-black/40 backdrop-blur-sm border-r border-purple-500/20 rounded-l-2xl">
            {/* Header / Controls */}
            <div className="p-4 space-y-3 border-b border-purple-500/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-light text-slate-200 tracking-tight">
                            {isTrash ? "Trash" : "Your Journal"}
                        </h2>
                        {/* Trash Toggle */}
                        <div className="flex bg-white/5 rounded-lg p-0.5 border border-purple-500/20 ml-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn("h-6 px-2 text-[10px]", !isTrash && "bg-purple-500/20 text-purple-200")}
                                onClick={() => onViewSourceChange?.('active')}
                            >
                                Active
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn("h-6 px-2 text-[10px]", isTrash && "bg-red-500/20 text-red-200")}
                                onClick={() => onViewSourceChange?.('trash')}
                            >
                                Trash
                            </Button>
                        </div>
                    </div>

                    <div className="flex bg-white/5 rounded-lg p-0.5 border border-purple-500/20">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-6 w-6 rounded-md", !isGrid && "bg-purple-500/20 text-purple-200")}
                            onClick={() => onViewModeChange?.('list')}
                        >
                            <ListIcon className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-6 w-6 rounded-md", isGrid && "bg-purple-500/20 text-purple-200")}
                            onClick={() => onViewModeChange?.('grid')}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-slate-500" />
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 h-9 text-sm bg-white/5 border-purple-500/20 placeholder:text-slate-600"
                        />
                    </div>
                    {/* Filter Dropdown placeholder - implementing simplified mood toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-9 w-9 bg-white/5 border-purple-500/20 text-slate-400">
                                <Filter className="h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black/90 border-purple-500/20 text-slate-300">
                            <DropdownMenuItem onClick={() => setMoodFilter(null)}>All Moods</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setMoodFilter("happy")}>Happy</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setMoodFilter("calm")}>Calm</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setMoodFilter("focused")}>Focused</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setMoodFilter("anxious")}>Anxious</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <CategoriesDialog />

                    <Button onClick={onNew} size="icon" className="h-9 w-9 bg-white text-black hover:bg-slate-200">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className={cn(
                "flex-1 overflow-y-auto custom-scrollbar p-3",
                isGrid ? "grid grid-cols-2 gap-3" : "flex flex-col gap-2"
            )}>
                {filteredEntries.length === 0 && (
                    <div className="text-center py-10 text-slate-600 text-sm">
                        No entries found.
                    </div>
                )}
                {filteredEntries.map(entry => (
                    <button
                        key={entry.id}
                        onClick={() => onSelect(entry.id)}
                        className={cn(
                            "text-left transition-all group relative overflow-hidden",
                            isGrid
                                ? "aspect-square rounded-xl p-4 border flex flex-col justify-between hover:scale-[1.02]"
                                : "w-full rounded-lg p-3 border-l-2",
                            selectedId === entry.id
                                ? (isGrid ? "bg-purple-500/10 border-purple-500/50" : "bg-purple-500/5 border-l-purple-400")
                                : (isGrid ? "bg-white/5 border-purple-500/10 hover:border-purple-500/30" : "hover:bg-white/5 border-l-transparent hover:border-l-purple-500/30 text-slate-400")
                        )}
                    >
                        <div className="flex flex-col gap-1 h-full">
                            <div className="flex justify-between items-start w-full">
                                <span className={cn(
                                    "font-medium truncate pr-2",
                                    selectedId === entry.id ? "text-purple-200" : "text-slate-300 group-hover:text-slate-200"
                                )}>
                                    {entry.title || "Untitled"}
                                </span>
                                {entry.mood && !isGrid && (
                                    <span className="text-[10px] uppercase tracking-wider text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                                        {entry.mood}
                                    </span>
                                )}
                            </div>

                            <p className={cn(
                                "text-xs line-clamp-2",
                                selectedId === entry.id ? "text-purple-300/60" : "text-slate-500"
                            )}>
                                {entry.content?.replace(/<[^>]*>/g, '').substring(0, 100) || "No content"}
                            </p>

                            <div className={cn("mt-auto pt-2 flex items-center justify-between text-[10px] text-slate-600", isGrid && "mt-auto")}>
                                <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                                {isGrid && entry.mood && (
                                    <span className="uppercase tracking-wider text-slate-500">
                                        {entry.mood}
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
