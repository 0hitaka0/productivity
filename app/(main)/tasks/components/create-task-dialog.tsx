"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandList, CommandInput } from '@/components/ui/command';
import {
    Calendar as CalendarIcon, Clock, Zap, Hash, Sparkles, X,
    CheckCircle2, Circle, Plus, ChevronRight, ChevronDown,
    MoreHorizontal, Link as LinkIcon, Folder, Bell, Repeat,
    Trash2, Search
} from 'lucide-react';
import { DatePicker, PriorityPicker, DurationPicker, CategoryPicker } from './pickers';
import { parseTaskInput } from '@/lib/smart-input';
import { cn } from '@/lib/utils';
import { format, addDays, nextSaturday, nextMonday, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfToday } from 'date-fns';
import { useMBTI } from '@/components/providers/mbti-provider';
import { MBTI_DATA, MBTIType } from '@/lib/mbti-data';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onTaskCreated: (task: any) => void;
}

// --- Types ---
interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

interface Reminder {
    id: string;
    type: 'before_due' | 'specific_time';
    value: number | Date;
    unit?: 'minutes' | 'hours' | 'days';
    label: string;
}

// --- Constants & Themes ---
const TEMPERAMENT_THEMES = {
    Analysts: { primary: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.3)', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', suggestionBg: 'rgba(139, 92, 246, 0.1)', suggestionBorder: 'rgba(139, 92, 246, 0.2)' },
    Diplomats: { primary: '#10B981', glow: 'rgba(16, 185, 129, 0.3)', gradient: 'linear-gradient(135deg, #10B981, #059669)', suggestionBg: 'rgba(16, 185, 129, 0.1)', suggestionBorder: 'rgba(16, 185, 129, 0.2)' },
    Sentinels: { primary: '#06B6D4', glow: 'rgba(6, 182, 212, 0.3)', gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)', suggestionBg: 'rgba(6, 182, 212, 0.1)', suggestionBorder: 'rgba(6, 182, 212, 0.2)' },
    Explorers: { primary: '#F59E0B', glow: 'rgba(245, 158, 11, 0.3)', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)', suggestionBg: 'rgba(245, 158, 11, 0.1)', suggestionBorder: 'rgba(245, 158, 11, 0.2)' }
};

const PLACEHOLDERS: Record<MBTIType, string> = {
    INTJ: "What strategic action awaits?", INTP: "What problem to solve?", ENTJ: "What needs to be conquered?", ENTP: "What possibility to explore?",
    INFJ: "What meaningful task calls you?", INFP: "What feels important right now?", ENFJ: "Who or what needs your attention?", ENFP: "What exciting thing to tackle?",
    ISTJ: "What responsibility to handle?", ISFJ: "What needs your care today?", ESTJ: "What needs to be organized?", ESFJ: "How can you help today?",
    ISTP: "What to fix or build?", ISFP: "What would feel right to do?", ESTP: "What action to take?", ESFP: "What fun thing to get done?",
};

export function CreateTaskDialog({ isOpen, onClose, onTaskCreated }: CreateTaskDialogProps) {
    const { type } = useMBTI();
    const mbtiProfile = MBTI_DATA[type as MBTIType];
    const temperament = mbtiProfile?.temperament || 'Analysts';
    const theme = TEMPERAMENT_THEMES[temperament];

    // --- Refined CreateTaskDialog Logic ---

    // --- State ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);

    // --- Parse Subtasks from Description ---
    useEffect(() => {
        if (!description) return;

        const lines = description.split('\n');
        const newSubtasks: string[] = [];
        const cleanLines: string[] = [];

        let foundSubtask = false;

        lines.forEach(line => {
            const trimmed = line.trim();
            // Regex for "- ", "* ", "1. ", "[] "
            const match = trimmed.match(/^(-\s|\*\s|\d+\.\s|\[\s*\]\s)(.+)/);

            if (match) {
                newSubtasks.push(match[2]);
                foundSubtask = true;
            } else {
                cleanLines.push(line);
            }
        });

        if (foundSubtask) {
            const nextSubtasks = newSubtasks.map(t => ({ id: crypto.randomUUID(), title: t, completed: false }));
            setSubtasks(prev => [...prev, ...nextSubtasks]);
            setDescription(cleanLines.join('\n'));
        }
    }, [description]);

    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [priority, setPriority] = useState<'critical' | 'high' | 'medium' | 'low' | null>(null);
    const [category, setCategory] = useState<string | null>(null);
    const [duration, setDuration] = useState<number | null>(null);

    // Popover States
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isDurationOpen, setIsDurationOpen] = useState(false);
    const [isProjectOpen, setIsProjectOpen] = useState(false);

    const [showMore, setShowMore] = useState(false);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [projectId, setProjectId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showUnsavedAlert, setShowUnsavedAlert] = useState(false);

    // Project Creation State
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');

    // Category Creation State
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // --- Parsing & Suggestions ---
    useEffect(() => {
        if (!title) return;
        const parsed = parseTaskInput(title);
        // Only apply if not manually set
        if (parsed.priority && !priority) setPriority(parsed.priority as any);
        if (parsed.dueDate && !dueDate) setDueDate(parsed.dueDate);
        if (parsed.tags.length > 0 && !category) setCategory(parsed.tags[0]);
    }, [title]); // Debounce could be added

    // --- Handlers ---
    const handleClose = (force = false) => {
        if (!force && (title || description || subtasks.length > 0) && !showUnsavedAlert) {
            setShowUnsavedAlert(true);
            return;
        }
        // Reset
        setTitle(''); setDescription(''); setSubtasks([]);
        setDueDate(null); setPriority(null); setCategory(null); setDuration(null);
        setReminders([]); setProjectId(null); setShowMore(false);
        setShowUnsavedAlert(false);
        onClose();
    };

    const handleCreate = async () => {
        if (!title.trim()) return;
        setIsSubmitting(true);
        try {
            const taskData = {
                title,
                description,
                priority,
                dueDate,
                tags: category ? [category] : [],
                estimatedDuration: duration,
                subtasks: subtasks.map(s => ({ title: s.title, completed: s.completed })),
                reminders, // stored in properties
                projectId, // stored in category
            };

            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
            console.log('[CreateTask] Retrieved accessToken from storage:', token ? `${token.substring(0, 10)}...` : 'null');

            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers,
                credentials: 'include', // Ensure cookies are sent (double safety)
                body: JSON.stringify(taskData)
            });

            if (res.ok) {
                const newTask = await res.json();
                onTaskCreated(newTask);
                handleClose(true); // Force close and reset
            } else {
                if (res.status === 401) {
                    // Redirect to login if unauthorized
                    window.location.href = '/login?callbackUrl=/tasks';
                    return;
                }
                const errorText = await res.text();
                console.error("Create failed (Server):", errorText);
                alert(`Failed to create task: ${errorText}`);
            }
        } catch (e) {
            console.error("Create failed (Network/Client):", e);
            alert(`Failed to create task: ${e instanceof Error ? e.message : 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addSubtask = () => {
        setSubtasks([...subtasks, { id: crypto.randomUUID(), title: '', completed: false }]);
    };

    const updateSubtask = (id: string, val: string) => {
        setSubtasks(subtasks.map(s => s.id === id ? { ...s, title: val } : s));
    };

    const toggleSubtask = (id: string) => {
        setSubtasks(subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
    };

    const removeSubtask = (id: string) => {
        setSubtasks(subtasks.filter(s => s.id !== id));
    };

    // --- Render Helpers ---
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent
                className="max-w-[600px] p-0 gap-0 border-white/10 overflow-hidden sm:rounded-[24px] [&>button.absolute]:hidden"
                style={{
                    backgroundColor: 'rgba(15, 15, 35, 0.95)',
                    backdropFilter: 'blur(40px)',
                    boxShadow: `0 25px 80px rgba(0, 0, 0, 0.5), 0 0 100px ${theme.glow}`
                }}
            >
                {/* Floating Particles */}
                <Particles />

                {/* Unsaved Alert Overlay */}
                {showUnsavedAlert && (
                    <div className="absolute inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-[#1e1e2e] border border-white/10 p-6 rounded-xl shadow-2xl max-w-xs text-center">
                            <h4 className="text-white font-medium mb-2">Discard Changes?</h4>
                            <p className="text-slate-400 text-sm mb-4">You have unsaved changes.</p>
                            <div className="flex gap-2 justify-center">
                                <Button variant="ghost" onClick={() => setShowUnsavedAlert(false)}>Keep Editing</Button>
                                <Button variant="destructive" onClick={() => handleClose(true)}>Discard</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="relative flex items-center justify-between px-8 py-6 border-b border-white/5">
                    <div className="flex items-center gap-2 text-white/60 font-semibold text-sm">
                        <Sparkles className="w-4 h-4 text-white/80 animate-pulse" />
                        <span>New Task</span>
                    </div>
                    <button onClick={() => handleClose()} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Title */}
                    <div className="flex items-start gap-4">
                        <div className="mt-1 w-7 h-7 rounded-full border-2 border-white/30 flex items-center justify-center shrink-0">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary }} />
                        </div>
                        <input
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCreate(); }
                                if (e.key === 'Tab') {
                                    e.preventDefault();
                                    document.getElementById('task-desc-input')?.focus();
                                }
                            }}
                            placeholder={PLACEHOLDERS[type as MBTIType] || "What needs to be done?"}
                            className="w-full bg-transparent text-2xl font-medium text-white placeholder:text-white/20 focus:outline-none"
                        />
                    </div>

                    {/* Quick Options */}
                    <div className="flex flex-wrap gap-3 pl-11">
                        {/* Date Picker */}
                        <DatePicker date={dueDate} setDate={setDueDate} />

                        {/* Priority Picker */}
                        <PriorityPicker value={priority as any} onChange={setPriority} />

                        {/* Category Picker */}
                        <CategoryPicker category={category} setCategory={setCategory} />

                        {/* Duration Picker */}
                        <DurationPicker value={duration} onChange={setDuration} />
                    </div>

                    {/* Description & Subtasks */}
                    <div className="pl-11 space-y-4">
                        <div className="bg-black/20 border border-white/5 rounded-2xl p-4 min-h-[100px]">
                            <Textarea
                                id="task-desc-input"
                                value={description}
                                onChange={(e: any) => setDescription(e.target.value)}
                                placeholder="Add details or break into steps...&#10;- Sort files&#10;- Dust surfaces"
                                className="bg-transparent border-none p-0 focus-visible:ring-0 text-slate-300 placeholder:text-slate-600 resize-none text-sm min-h-[60px] mb-2"
                            />

                            {/* Subtask List */}
                            <div className="space-y-2">
                                {subtasks.map((task, idx) => (
                                    <div key={task.id} className="flex items-center gap-2 group animate-in fade-in slide-in-from-top-1">
                                        <button onClick={() => toggleSubtask(task.id)} className={cn("text-slate-500 hover:text-white transition-colors", task.completed && "text-green-500")}>
                                            {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                        </button>
                                        <input
                                            value={task.title}
                                            onChange={(e) => updateSubtask(task.id, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') addSubtask();
                                                if (e.key === 'Backspace' && !task.title) removeSubtask(task.id);
                                            }}
                                            className={cn("bg-transparent flex-1 text-sm focus:outline-none", task.completed ? "text-slate-600 line-through" : "text-slate-300")}
                                            autoFocus={!task.title} // Autofocus only if empty (newly created)
                                        />
                                        <button onClick={() => removeSubtask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-opacity">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button onClick={addSubtask} className="mt-2 text-xs font-medium text-slate-500 hover:text-white transition-colors flex items-center gap-1">
                                <Plus className="w-3 h-3" /> Add subtask
                            </button>
                        </div>
                    </div>

                    {/* Smart Suggestions */}
                    {(title.toLowerCase().includes("clean") || title.toLowerCase().includes("report") || title.toLowerCase().includes("email")) && (
                        <div className="pl-11 space-y-3 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.primary }}>
                                <Sparkles className="w-3 h-3" />
                                <span>Smart Suggestions</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {title.toLowerCase().includes("clean") && (
                                    <button onClick={() => { setDueDate(nextSaturday(new Date())); }} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors hover:brightness-110" style={{ backgroundColor: theme.suggestionBg, border: `1px solid ${theme.suggestionBorder}`, color: theme.primary }}>
                                        <CalendarIcon className="w-3 h-3" /> Suggest: Do on Saturday
                                    </button>
                                )}
                                {title.toLowerCase().includes("report") && (
                                    <button onClick={() => console.log('Weekly')} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors hover:brightness-110" style={{ backgroundColor: theme.suggestionBg, border: `1px solid ${theme.suggestionBorder}`, color: theme.primary }}>
                                        <Repeat className="w-3 h-3" /> Make this weekly?
                                    </button>
                                )}
                                {(title.toLowerCase().includes("email") || title.toLowerCase().includes("call")) && (
                                    <button onClick={() => { setDuration(15); }} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors hover:brightness-110" style={{ backgroundColor: theme.suggestionBg, border: `1px solid ${theme.suggestionBorder}`, color: theme.primary }}>
                                        <Clock className="w-3 h-3" /> Set duration: 15m
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* More Options */}
                    <div className="pl-11">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowMore(!showMore)}
                            className="text-slate-500 hover:text-white hover:bg-white/5 h-8 px-2 -ml-2 mb-2"
                        >
                            <MoreHorizontal className="w-4 h-4 mr-2" />
                            <span className="text-xs animate-in fade-in">{showMore ? "Less options" : "More options"}</span>
                        </Button>

                        <AnimatePresence>
                            {showMore && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="pt-3 pb-1 space-y-2">
                                        {/* Reminders Row */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-wrap gap-2">
                                                {reminders.map(r => (
                                                    <div key={r.id} className="flex items-center gap-1 bg-white/10 text-xs px-2 py-1 rounded-md text-slate-300">
                                                        <Bell className="w-3 h-3" />
                                                        <span>{r.label}</span>
                                                        <button onClick={() => setReminders(reminders.filter(rem => rem.id !== r.id))} className="hover:text-white"><X className="w-3 h-3" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="justify-start text-slate-400 border-white/10 hover:bg-white/5 hover:text-white h-9 text-xs w-full sm:w-auto">
                                                        <Bell className="w-3.5 h-3.5 mr-2" />
                                                        Add Reminder
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-56 p-1 bg-[#1e1e2e] border-white/10 z-[200]" align="start">
                                                    <div className="space-y-1">
                                                        {['15 min before', '1 hour before', '1 day before'].map((label, i) => (
                                                            <button
                                                                key={label}
                                                                onClick={() => {
                                                                    setReminders([...reminders, { id: crypto.randomUUID(), type: 'before_due', value: i + 1, label }]);
                                                                }}
                                                                className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-white/10 rounded"
                                                            >
                                                                {label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        {/* Projects Row */}
                                        <div className="flex items-center gap-2">
                                            <Popover open={isProjectOpen} onOpenChange={setIsProjectOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className={cn("justify-start border-white/10 hover:bg-white/5 h-9 text-xs w-full sm:w-auto", projectId ? "text-blue-400 border-blue-500/30" : "text-slate-400 hover:text-white")}>
                                                        <Folder className="w-3.5 h-3.5 mr-2" />
                                                        {projectId || "Assign Project"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-56 p-0 bg-[#1e1e2e] border-white/10 z-[200]" align="start">
                                                    {isCreatingProject ? (
                                                        <div className="p-2 space-y-2">
                                                            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider px-1">New Project Name</div>
                                                            <input
                                                                autoFocus
                                                                value={newProjectName}
                                                                onChange={(e) => setNewProjectName(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && newProjectName.trim()) {
                                                                        e.preventDefault();
                                                                        setProjectId(newProjectName);
                                                                        setIsCreatingProject(false);
                                                                        setIsProjectOpen(false);
                                                                        setNewProjectName('');
                                                                    }
                                                                    if (e.key === 'Escape') {
                                                                        setIsCreatingProject(false);
                                                                        setNewProjectName('');
                                                                    }
                                                                }}
                                                                placeholder="e.g. Website Overhaul"
                                                                className="w-full bg-black/20 border border-white/10 rounded-md text-xs px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                                                            />
                                                            <div className="flex justify-end gap-1 pt-1">
                                                                <button
                                                                    onClick={() => { setIsCreatingProject(false); setNewProjectName(''); }}
                                                                    className="px-2 py-1 text-[10px] text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        if (newProjectName.trim()) {
                                                                            setProjectId(newProjectName);
                                                                            setIsCreatingProject(false);
                                                                            setIsProjectOpen(false);
                                                                            setNewProjectName('');
                                                                        }
                                                                    }}
                                                                    disabled={!newProjectName.trim()}
                                                                    className="px-2 py-1 text-[10px] text-white bg-blue-600 hover:bg-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                >
                                                                    Create Project
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Command className="bg-transparent text-white">
                                                            <CommandInput placeholder="Search projects..." className="h-8 text-xs" />
                                                            <CommandList>
                                                                <CommandGroup>
                                                                    {['Website Redesign', 'Q4 Planning', 'Home Renovation'].map(p => (
                                                                        <CommandItem
                                                                            key={p}
                                                                            value={p.toLowerCase()}
                                                                            onSelect={() => { console.log('Select project:', p); setProjectId(p); setIsProjectOpen(false); }}
                                                                            onMouseDown={(e) => { console.log('MouseDown project:', p); e.preventDefault(); e.stopPropagation(); setProjectId(p); setIsProjectOpen(false); }}
                                                                            className="text-xs text-slate-300 aria-selected:bg-white/10 cursor-pointer !pointer-events-auto data-[disabled]:!pointer-events-auto data-[disabled]:!opacity-100"
                                                                        >
                                                                            <Folder className="w-3 h-3 mr-2" />
                                                                            {p}
                                                                        </CommandItem>
                                                                    ))}
                                                                    <CommandItem
                                                                        value="create_new_project"
                                                                        onSelect={() => {
                                                                            setIsCreatingProject(true);
                                                                            setNewProjectName('');
                                                                        }}
                                                                        onMouseDown={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            setIsCreatingProject(true);
                                                                            setNewProjectName('');
                                                                        }}
                                                                        className="text-xs text-slate-500 aria-selected:bg-white/10 cursor-pointer !pointer-events-auto data-[disabled]:!pointer-events-auto data-[disabled]:!opacity-100"
                                                                    >
                                                                        <Plus className="w-3 h-3 mr-2" /> Create new project
                                                                    </CommandItem>
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    )}
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-[200] p-6 pt-2 pl-12 flex items-center justify-between border-t border-white/5 mt-auto bg-[#0f0f23]/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <kbd className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-slate-300 font-mono text-[10px]">Enter</kbd>
                        <span>to create</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => handleClose()} className="text-sm text-white/50 hover:text-white transition-colors">Cancel</button>
                        <button
                            onClick={handleCreate}
                            disabled={!title.trim() || isSubmitting}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium text-sm transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: theme.gradient, boxShadow: `0 4px 20px ${theme.glow}` }}
                        >
                            {isSubmitting ? <Clock className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Create Task
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Minimal Calendar Implementation
function CalendarPicker({ selected, onSelect }: { selected: Date | null, onSelect: (d: Date | null) => void }) {
    const today = startOfToday();
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));

    // Switch to selected month if available
    useEffect(() => {
        if (selected) setCurrentMonth(startOfMonth(selected));
    }, [selected]);

    const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <div className="p-3 w-64 bg-[#0f172a]">
            {/* Quick Options */}
            <div className="space-y-1 mb-3 pb-3 border-b border-white/10">
                <button onClick={() => onSelect(today)} className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-white/10 rounded flex justify-between">
                    <span>Today</span> <span className="text-slate-500">{format(today, 'EEE')}</span>
                </button>
                <button onClick={() => onSelect(addDays(today, 1))} className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-white/10 rounded flex justify-between">
                    <span>Tomorrow</span> <span className="text-slate-500">{format(addDays(today, 1), 'EEE')}</span>
                </button>
                <button onClick={() => onSelect(nextSaturday(today))} className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-white/10 rounded flex justify-between">
                    <span>This Weekend</span> <span className="text-slate-500">Sat</span>
                </button>
                <button onClick={() => onSelect(nextMonday(today))} className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-white/10 rounded flex justify-between">
                    <span>Next Week</span> <span className="text-slate-500">Mon</span>
                </button>
                <div className="my-1 h-px bg-white/10 mx-2" />
                <button onClick={() => onSelect(null)} className="w-full text-left px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-800/50 rounded hover:text-slate-400">
                    No Date
                </button>
            </div>

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-2">
                <button onClick={() => setCurrentMonth(prev => addDays(prev, -30))} className="p-1 hover:bg-white/10 rounded"><ChevronRight className="w-4 h-4 rotate-180 text-slate-400" /></button>
                <span className="text-xs font-medium text-white">{format(currentMonth, 'MMMM yyyy')}</span>
                <button onClick={() => setCurrentMonth(prev => addDays(prev, 30))} className="p-1 hover:bg-white/10 rounded"><ChevronRight className="w-4 h-4 text-slate-400" /></button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {weekDays.map(d => <div key={d} className="text-[10px] text-slate-500">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map(day => (
                    <button
                        key={day.toString()}
                        onClick={() => onSelect(day)}
                        className={cn(
                            "h-7 w-7 rounded-full text-xs flex items-center justify-center transition-colors",
                            isSameDay(day, selected || new Date(0)) ? "bg-blue-600 text-white font-bold" : "text-slate-300 hover:bg-white/10",
                            isSameDay(day, today) && !selected && "text-blue-400 font-bold" // Highlight today if not selected
                        )}
                    >
                        {format(day, 'd')}
                    </button>
                ))}
            </div>
        </div>
    );
}

function SuggestionChip({ theme, icon, text, onClick }: { theme: any, icon: React.ReactNode, text: string, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-left transition-all hover:brightness-125 hover:-translate-y-0.5"
            style={{
                backgroundColor: theme.suggestionBg,
                border: `1px solid ${theme.suggestionBorder}`,
                color: theme.primary
            }}
        >
            {icon}
            <span>{text}</span>
        </button>
    );
}

function Particles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/20"
                    style={{
                        width: Math.random() * 2 + 1 + 'px',
                        height: Math.random() * 2 + 1 + 'px',
                        top: Math.random() * 100 + '%',
                        left: Math.random() * 100 + '%',
                    }}
                    animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, delay: Math.random() * 2 }}
                />
            ))}
        </div>
    );
}
