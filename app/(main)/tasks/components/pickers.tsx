import React, { useState, useEffect } from 'react';
import { format, addDays, nextSaturday, nextMonday, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfToday } from 'date-fns';
import { ChevronRight, Zap, Clock, Calendar as CalendarIcon, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

// --- Date Picker (Trigger + Content) ---
interface DatePickerProps {
    date: Date | null;
    setDate: (d: Date | null) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className={cn("flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border transition-colors", date ? "bg-white/10 border-white/20 text-white" : "bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-slate-300")}>
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{date ? format(date, 'MMM d') : "Today"}</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#0f172a] border-white/10 text-white z-[200]" align="start">
                <CalendarPicker selected={date} onSelect={setDate} />
            </PopoverContent>
        </Popover>
    );
}

// --- Calendar Picker (Content Only) ---
interface CalendarPickerProps {
    selected: Date | null;
    onSelect: (d: Date | null) => void;
}

export function CalendarPicker({ selected, onSelect }: CalendarPickerProps) {
    const today = startOfToday();
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));

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
                            isSameDay(day, today) && !selected && "text-blue-400 font-bold"
                        )}
                    >
                        {format(day, 'd')}
                    </button>
                ))}
            </div>
        </div>
    );
}

// --- Priority Picker ---
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low' | null;

interface PriorityPickerProps {
    value: PriorityLevel;
    onChange: (p: PriorityLevel) => void;
}

export function PriorityPicker({ value, onChange }: PriorityPickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className={cn("flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border transition-colors", value ? "bg-white/10 border-white/20 text-white" : "bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-slate-300")}>
                    <Zap className={cn("w-3.5 h-3.5", value === 'critical' ? 'text-red-400 fill-red-400' : value === 'high' ? 'text-orange-400' : 'text-slate-400')} />
                    <span className="capitalize">{value || "Priority"}</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1 bg-[#1e1e2e] border-white/10 z-[200]" align="start">
                <div className="space-y-1">
                    {['critical', 'high', 'medium', 'low'].map((p) => (
                        <button key={p} onClick={() => onChange(p as PriorityLevel)} className={cn("w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded capitalize transition-colors", value === p ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/10")}>
                            <div className={cn("w-2 h-2 rounded-full", p === 'critical' ? 'bg-red-500' : p === 'high' ? 'bg-orange-500' : p === 'medium' ? 'bg-yellow-500' : 'bg-green-500')} />
                            {p}
                        </button>
                    ))}
                    <button onClick={() => onChange(null)} className={cn("w-full text-left px-2 py-1.5 text-xs rounded transition-colors", !value ? "bg-white/10 text-white" : "text-slate-500 hover:bg-white/10")}>None</button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

// --- Duration Picker ---
interface DurationPickerProps {
    value: number | null; // in minutes
    onChange: (d: number | null) => void;
}

export function DurationPicker({ value, onChange }: DurationPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button className={cn("flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border transition-colors", value ? "bg-white/10 border-white/20 text-white" : "bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-slate-300")}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{value ? (value >= 60 ? `${value / 60}h` : `${value}m`) : "Duration"}</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1 bg-[#1e1e2e] border-white/10 z-[200]" align="start">
                <div className="space-y-1">
                    {[15, 30, 45, 60, 90, 120, 180, 240, 480].map(m => (
                        <button key={m} onClick={() => { onChange(m); setIsOpen(false); }} className={cn("w-full text-left px-2 py-1.5 text-xs rounded transition-colors", value === m ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/10")}>
                            {m < 60 ? `${m} min` : m === 240 ? 'Half day (4h)' : m === 480 ? 'Full day (8h)' : `${m / 60} hours`}
                        </button>
                    ))}
                    <button onClick={() => { onChange(null); setIsOpen(false); }} className="w-full text-left px-2 py-1.5 text-xs text-slate-500 hover:bg-white/10 rounded">
                        Clear
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

// --- Category Picker ---
interface CategoryPickerProps {
    category: string | null;
    setCategory: (c: string) => void;
}

export function CategoryPicker({ category, setCategory }: CategoryPickerProps) {
    const [open, setOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');

    const handleCreate = () => {
        if (newName.trim()) {
            setCategory(newName.trim());
            setIsCreating(false);
            setOpen(false);
            setNewName('');
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className={cn("flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border transition-colors", category ? "bg-white/10 border-white/20 text-white" : "bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-slate-300")}>
                    <Hash className="w-3.5 h-3.5" />
                    <span>{category || "Category"}</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0 bg-[#1e1e2e] border-white/10 z-[200]" align="start">
                {isCreating ? (
                    <div className="p-2 space-y-2">
                        <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider px-1">New Category Name</div>
                        <input
                            autoFocus
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleCreate();
                                }
                                if (e.key === 'Escape') {
                                    setIsCreating(false);
                                    setNewName('');
                                }
                            }}
                            placeholder="e.g. Wellness"
                            className="w-full bg-black/20 border border-white/10 rounded-md text-xs px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                        />
                        <div className="flex justify-end gap-1 pt-1">
                            <button
                                onClick={() => { setIsCreating(false); setNewName(''); }}
                                className="px-2 py-1 text-[10px] text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={!newName.trim()}
                                className="px-2 py-1 text-[10px] text-white bg-blue-600 hover:bg-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                ) : (
                    <Command className="bg-transparent text-white">
                        <CommandInput placeholder="Search category..." className="h-8 text-xs" />
                        <CommandList>
                            <CommandGroup>
                                {[
                                    { icon: '💼', label: 'Work' }, { icon: '🏠', label: 'Personal' },
                                    { icon: '💪', label: 'Health' }, { icon: '📚', label: 'Learning' },
                                    { icon: '🎨', label: 'Creative' }, { icon: '💰', label: 'Finance' },
                                ].map(c => (
                                    <CommandItem
                                        key={c.label}
                                        value={c.label.toLowerCase()}
                                        onSelect={() => { setCategory(c.label); setOpen(false); }}
                                        className="text-xs text-slate-300 aria-selected:bg-white/10 cursor-pointer !pointer-events-auto"
                                    >
                                        <span className="mr-2">{c.icon}</span> {c.label}
                                    </CommandItem>
                                ))}
                                <CommandItem
                                    value="create_new"
                                    onSelect={() => { setIsCreating(true); setNewName(''); }}
                                    className="text-xs text-slate-500 aria-selected:bg-white/10 cursor-pointer !pointer-events-auto"
                                >
                                    + Create new
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                )}
            </PopoverContent>
        </Popover>
    );
}
