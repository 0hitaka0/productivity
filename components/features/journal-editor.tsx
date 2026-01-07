"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Trash2, Calendar, Clock, Smile, Tag, RotateCcw, XCircle } from "lucide-react";
import { createEntry, updateEntry, deleteEntry, restoreEntry, permanentDeleteEntry } from "@/actions/journal";
import { cn } from "@/lib/utils";
import { RichEditor } from "@/components/ui/rich-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagSelector } from "@/components/features/tag-selector";
import { Badge } from "@/components/ui/badge";

interface JournalEditorProps {
    entry: any; // Type properly, e.g. Prisma JournalEntry
    categories?: any[]; // Passed from parent
    isTrash?: boolean;
    onSave: () => void;
    onDelete: () => void;
}

export function JournalEditor({ entry, categories = [], isTrash = false, onSave, onDelete }: JournalEditorProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [mood, setMood] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [tagIds, setTagIds] = useState<string[]>([]);
    const [loadedTags, setLoadedTags] = useState<any[]>([]); // Store full tag objects for display
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Sync state when entry prop changes
    useEffect(() => {
        if (entry) {
            setTitle(entry.title || "");
            setContent(entry.content || "");
            setMood(entry.mood || "");
            setCategoryId(entry.categoryId || "");
            setTagIds(entry.tags ? entry.tags.map((t: any) => t.id) : []);
            setLoadedTags(entry.tags || []);
            setLastSaved(null);
        } else {
            setTitle("");
            setContent("");
            setMood("");
            setCategoryId("");
            setTagIds([]);
            setLoadedTags([]);
            setLastSaved(null);
        }
    }, [entry?.id]); // Only reset if ID changes (switching entries)

    // Debounced Auto-save (Disable in Trash)
    useEffect(() => {
        if (!entry || isTrash) return;

        const timeout = setTimeout(async () => {
            if (entry.id) {
                // If it's an existing entry, update it automatically
                // Avoid saving if no changes - but hard to track dirty state perfectly here without more logic
                // For MVP, just save on change after debounce
                handleSave(true);
            }
        }, 2000); // 2 second debounce

        return () => clearTimeout(timeout);
    }, [title, content, mood, categoryId, tagIds]);

    async function handleSave(silent = false) {
        if (!content && !title) return;
        if (isTrash) return; // Prevent save in trash

        setIsSaving(true);
        try {
            if (entry?.id) {
                await updateEntry(entry.id, { title, content, mood, categoryId, tagIds });
            } else {
                const newEntry = await createEntry({
                    userId: entry.userId, // Provided by parent for new entries
                    title,
                    content,
                    mood,
                    categoryId,
                    tagIds
                });
                onSave(); // Parent should reload/reselect the new entry
            }
            setLastSaved(new Date());
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete() {
        if (!entry?.id) return;
        if (confirm("Are you sure you want to delete this entry?")) {
            await deleteEntry(entry.id);
            onDelete();
        }
    }

    async function handleRestore() {
        if (!entry?.id) return;
        await restoreEntry(entry.id);
        onDelete(); // Remove from current list (Trash list)
    }

    async function handlePermanentDelete() {
        if (!entry?.id) return;
        if (confirm("This will permanently delete this entry. This action cannot be undone.")) {
            await permanentDeleteEntry(entry.id);
            onDelete(); // Remove from list
        }
    }

    // Word Count
    const wordCount = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(w => w.length > 0).length;

    if (!entry) {
        return (
            <div className="h-full flex items-center justify-center text-slate-500 font-light italic">
                {isTrash ? "Select a deleted entry to view." : "Select an entry or start a new one."}
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm rounded-r-2xl border-y border-r border-purple-500/20">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/10">
                <div className="flex-1 mr-4">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Untitled Entry..."
                        disabled={isTrash}
                        className="text-2xl font-light bg-transparent border-none px-0 placeholder:text-slate-600 focus-visible:ring-0 h-auto disabled:opacity-80"
                    />
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        {/* Display Tags */}
                        {loadedTags.map(tag => tagIds.includes(tag.id) && (
                            <Badge key={tag.id} variant="secondary" className="bg-purple-500/20 text-purple-200 hover:bg-purple-500/30">
                                #{tag.name}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 font-mono">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date().toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {lastSaved && !isTrash && <span className="text-purple-400">Saved {lastSaved.toLocaleTimeString()}</span>}
                        {isSaving && <span className="animate-pulse text-purple-400">Saving...</span>}
                        {isTrash && <span className="text-red-400 font-bold">DELETED (Read Only)</span>}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isTrash ? (
                        <>
                            <Button variant="ghost" size="sm" onClick={handlePermanentDelete} className="text-red-500 hover:bg-red-500/10 hover:text-red-400">
                                <XCircle className="h-4 w-4 mr-2" />
                                Delete Forever
                            </Button>
                            <Button size="sm" onClick={handleRestore} className="bg-purple-600 text-white hover:bg-purple-500">
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Restore
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-slate-500 hover:text-red-400">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => handleSave()} disabled={isSaving} className="bg-white text-black hover:bg-slate-200">
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Toolbar / Mood / Category / Tags */}
            <div className="px-6 py-3 flex items-center gap-3 border-b border-purple-500/10 bg-white/5 overflow-x-auto min-h-[56px]">
                {/* Visual Separator */}

                {/* Mood Select - Disabled in Trash */}
                <div className="flex items-center gap-2 min-w-[120px]">
                    <Smile className="h-4 w-4 text-slate-500" />
                    <Select value={mood} onValueChange={setMood} disabled={isTrash}>
                        <SelectTrigger className="w-[110px] h-8 bg-transparent border-none text-slate-300 focus:ring-0">
                            <SelectValue placeholder="Mood" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-slate-800 text-slate-300">
                            <SelectItem value="happy">✨ Happy</SelectItem>
                            <SelectItem value="calm">🌊 Calm</SelectItem>
                            <SelectItem value="focused">🎯 Focused</SelectItem>
                            <SelectItem value="anxious">🌪️ Anxious</SelectItem>
                            <SelectItem value="tired">💤 Tired</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="h-4 w-px bg-white/10" />

                {/* Category Select - Disabled in Trash */}
                <div className="flex items-center gap-2 min-w-[140px]">
                    <Tag className="h-4 w-4 text-slate-500" />
                    <Select value={categoryId} onValueChange={setCategoryId} disabled={isTrash}>
                        <SelectTrigger className="w-[130px] h-8 bg-transparent border-none text-slate-300 focus:ring-0">
                            <SelectValue placeholder="No Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-slate-800 text-slate-300">
                            <SelectItem value="_none">No Category</SelectItem>
                            {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    <span className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                        {cat.name}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="h-4 w-px bg-white/10" />

                {/* Tag Selector - Hide add button in trash or disable? TagSelector has internal state. */}
                {/* The easiest way is to wrap it or modify it. TagSelector manages its own open state. */}
                {/* Let's just hide it in trash for now or display as read-only list already handled in header? */}
                {/* The header shows BADGES (read only). The TagSelector is for adding. */}
                {/* So in Trash, we just don't show the TagSelector button or show it disabled. */}
                <div className="flex items-center gap-2">
                    {!isTrash && <TagSelector selectedTagIds={tagIds} onChange={setTagIds} onTagsLoaded={setLoadedTags} />}
                </div>

                <div className="flex-1" /> {/* Spacer */}

                <div className="text-xs text-slate-500 whitespace-nowrap">
                    {wordCount} words
                </div>
            </div>

            {/* Editor - ReadOnly in Trash */}
            <div className={cn("flex-1 p-6 overflow-y-auto custom-scrollbar", isTrash && "opacity-80 pointer-events-none")}>
                <RichEditor
                    content={content}
                    onChange={setContent}
                    placeholder={isTrash ? "RESTORE TO EDIT..." : "Capture your thoughts..."}
                // RichEditor likely needs a disabled prop or we just pointer-events-none the wrapper
                />
            </div>
        </div>
    );
}
