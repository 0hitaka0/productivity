"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { MoodSelector, MoodData } from './mood-selector';
import { PromptCard } from './prompt-card';
import { useDebounce } from '@/lib/hooks';
import { Loader2, Maximize2, Minimize2, Save, Bold, Italic, List, Quote, Heading1, Heading2, RotateCcw, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JournalEditorProps {
    initialContent?: string;
    initialTitle?: string;
    initialMood?: MoodData | null;
}

export function JournalEditor({ initialContent = "", initialTitle = "", initialMood = null }: JournalEditorProps) {
    const [title, setTitle] = useState(initialTitle);
    const [mood, setMood] = useState<MoodData>(initialMood || { value: 5, emotions: [], context: [] });
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: 'Start writing...' }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px]',
            },
        },
        onUpdate: ({ editor }) => {
            setWordCount(editor.storage.characterCount?.words() || 0); // Note: CharacterCount ext needed ideally, but approximation ok
            // Approximate word count manually if extension missing
            const text = editor.getText();
            setWordCount(text.split(/\s+/).filter(w => w.length > 0).length);
        },
        immediatelyRender: false,
    });

    // Debounce content for auto-save
    const debouncedContent = useDebounce(editor?.getHTML(), 2000);
    const debouncedTitle = useDebounce(title, 2000);
    const debouncedMood = useDebounce(mood, 2000);

    const saveEntry = useCallback(async () => {
        if (!editor) return;
        setIsSaving(true);
        try {
            await fetch('/api/journal/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: debouncedTitle,
                    content: debouncedContent,
                    mood: debouncedMood,
                    // If we had an ID, we'd pass it here to update
                }),
            });
            setLastSaved(new Date());
        } catch (error) {
            console.error('Failed to save', error);
        } finally {
            setIsSaving(false);
        }
    }, [debouncedTitle, debouncedContent, debouncedMood, editor]);

    // Effect to trigger save
    useEffect(() => {
        if (debouncedContent || debouncedTitle) {
            saveEntry();
        }
    }, [debouncedContent, debouncedTitle, debouncedMood, saveEntry]);

    if (!editor) return null;

    return (
        <div className={cn(
            "transition-all duration-300",
            isFullScreen ? "fixed inset-0 z-50 bg-slate-950 p-8 overflow-y-auto" : "relative w-full max-w-4xl mx-auto space-y-8"
        )}>
            {/* Header Actions */}
            <div className="flex items-center justify-between text-slate-400 mb-8">
                <div className="flex items-center gap-4 text-sm">
                    {isSaving ? (
                        <span className="flex items-center gap-2 text-purple-400">
                            <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                        </span>
                    ) : lastSaved ? (
                        <span className="text-slate-500">Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    ) : (
                        <span>Unsaved</span>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="p-2 hover:bg-slate-800 rounded disabled:opacity-30"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="p-2 hover:bg-slate-800 rounded disabled:opacity-30"
                    >
                        <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                    >
                        {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Prompt */}
            {!isFullScreen && <PromptCard />}

            {/* Main Editor Area */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 min-h-[600px] shadow-2xl relative">

                {/* Formatting Toolbar */}
                <div className="sticky top-0 z-10 flex gap-1 mb-8 p-1 bg-slate-950/80 backdrop-blur border border-white/5 rounded-lg w-fit">
                    <ToolbarButton isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
                        <Bold className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
                        <Italic className="w-4 h-4" />
                    </ToolbarButton>
                    <div className="w-px h-6 bg-white/10 mx-1 self-center" />
                    <ToolbarButton isActive={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                        <Heading1 className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton isActive={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                        <Heading2 className="w-4 h-4" />
                    </ToolbarButton>
                    <div className="w-px h-6 bg-white/10 mx-1 self-center" />
                    <ToolbarButton isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                        <List className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton isActive={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                        <Quote className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Untitled Entry"
                    className="text-4xl font-bold bg-transparent border-none focus:outline-none placeholder:text-slate-700 text-white w-full mb-8 font-serif"
                />

                <EditorContent editor={editor} />

                <div className="absolute bottom-4 right-8 text-xs text-slate-600 font-mono">
                    {wordCount} words • {Math.ceil(wordCount / 200)} min read
                </div>
            </div>

            {/* Mood & Metadata Section */}
            {!isFullScreen && (
                <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-8">
                    <h3 className="text-lg font-medium text-slate-300 mb-6">Mood & Context</h3>
                    <MoodSelector value={mood} onChange={setMood} />
                </div>
            )}
        </div>
    );
}

const ToolbarButton = ({ children, isActive, onClick }: { children: React.ReactNode, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={cn(
            "p-2 rounded transition-colors",
            isActive ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
        )}
    >
        {children}
    </button>
);
