"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Zap, Star, Circle, Calendar, Tag, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useMBTI } from '@/components/providers/mbti-provider';
import { MBTI_DATA, MBTIType } from '@/lib/mbti-data';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

export interface FilterState {
    status: string[];
    priority: string[];
    dateRange: 'today' | 'tomorrow' | 'this_week' | 'next_week' | 'overdue' | null;
    categories: string[];
}

interface TaskFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    availableCategories: string[];
}

// --- Constants ---

const TEMPERAMENT_THEMES = {
    Analysts: { primary: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.3)', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', suggestionBg: 'rgba(139, 92, 246, 0.1)', suggestionBorder: 'rgba(139, 92, 246, 0.2)' },
    Diplomats: { primary: '#10B981', glow: 'rgba(16, 185, 129, 0.3)', gradient: 'linear-gradient(135deg, #10B981, #059669)', suggestionBg: 'rgba(16, 185, 129, 0.1)', suggestionBorder: 'rgba(16, 185, 129, 0.2)' },
    Sentinels: { primary: '#06B6D4', glow: 'rgba(6, 182, 212, 0.3)', gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)', suggestionBg: 'rgba(6, 182, 212, 0.1)', suggestionBorder: 'rgba(6, 182, 212, 0.2)' },
    Explorers: { primary: '#F59E0B', glow: 'rgba(245, 158, 11, 0.3)', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)', suggestionBg: 'rgba(245, 158, 11, 0.1)', suggestionBorder: 'rgba(245, 158, 11, 0.2)' },
    // Fallback
    Default: { primary: '#3B82F6', glow: 'rgba(59, 130, 246, 0.3)', gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)', suggestionBg: 'rgba(59, 130, 246, 0.1)', suggestionBorder: 'rgba(59, 130, 246, 0.2)' }
};

// --- Component ---

export function TaskFilters({
    searchQuery,
    onSearchChange,
    filters,
    onFilterChange,
    availableCategories
}: TaskFiltersProps) {
    const { type } = useMBTI();
    const mbtiProfile = MBTI_DATA[type as MBTIType];
    const temperament = mbtiProfile?.temperament || 'Default';
    const theme = TEMPERAMENT_THEMES[temperament as keyof typeof TEMPERAMENT_THEMES] || TEMPERAMENT_THEMES.Default;

    const filterRef = useRef<HTMLDivElement>(null);
    const [localSearch, setLocalSearch] = useState(searchQuery);
    const [isFocused, setIsFocused] = useState(false);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    // Sync local search when prop changes
    useEffect(() => {
        setLocalSearch(searchQuery);
    }, [searchQuery]);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== searchQuery) {
                onSearchChange(localSearch);
            }
        }, 200);
        return () => clearTimeout(timer);
    }, [localSearch, onSearchChange, searchQuery]);

    // Click Outside to Close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterPanelOpen(false);
            }
        }

        if (isFilterPanelOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterPanelOpen]);

    const activeFiltersCount =
        filters.status.length +
        filters.priority.length +
        (filters.dateRange ? 1 : 0) +
        filters.categories.length;

    return (
        <div className="relative z-20" ref={filterRef}>
            {/* Search Bar Container */}
            <GlassCard className="p-1 flex items-center gap-2 bg-white/[0.03] rounded-2xl border-white/10 overflow-visible">
                {/* Search Input */}
                <div
                    className={cn(
                        "flex-1 flex items-center gap-3 px-4 h-11 rounded-xl transition-all duration-300 border border-transparent bg-white/[0.05]",
                        isFocused ? "" : "hover:bg-white/[0.08] hover:border-white/10"
                    )}
                    style={isFocused ? {
                        borderColor: theme.primary,
                        boxShadow: `0 0 15px ${theme.glow}`
                    } : {}}
                >
                    <Search className={cn(
                        "w-4 h-4 transition-colors",
                    )}
                        style={{ color: isFocused ? theme.primary : 'rgba(148, 163, 184, 1)' }}
                    />

                    <input
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Search tasks..."
                        className="bg-transparent border-none focus:ring-0 focus:outline-none outline-none text-slate-200 placeholder:text-slate-500 w-full text-sm h-full p-0"
                    />

                    {localSearch && (
                        <button
                            onClick={() => { setLocalSearch(''); onSearchChange(''); }}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Filter Toggle */}
                <Button
                    variant="ghost"
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                    className={cn(
                        "h-11 px-4 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-transparent",
                        (isFilterPanelOpen || activeFiltersCount > 0) && "text-white bg-white/10 border-white/10"
                    )}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                    {activeFiltersCount > 0 && (
                        <span className="ml-2 bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                            {activeFiltersCount}
                        </span>
                    )}
                </Button>
            </GlassCard>

            {/* Filter Panel (Dropdown) */}
            <AnimatePresence>
                {isFilterPanelOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-3 p-0 z-50"
                    >
                        <GlassCard
                            className="p-6 rounded-2xl space-y-6"
                            style={{
                                backgroundColor: 'rgba(15, 15, 35, 0.95)',
                                backdropFilter: 'blur(40px)',
                                boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px ${theme.glow}`,
                                border: `1px solid ${theme.primary}20`
                            }}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Active Filters</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-slate-500 hover:text-red-400 h-auto py-1"
                                    onClick={() => onFilterChange({ status: [], priority: [], dateRange: null, categories: [] })}
                                >
                                    Clear All
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Status & Priority */}
                                <div className="space-y-6">
                                    {/* Status */}
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-2">
                                            <Circle className="w-3 h-3" /> Status
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['todo', 'in_progress', 'done'].map(status => (
                                                <FilterChip
                                                    key={status}
                                                    label={status.replace('_', ' ')}
                                                    isActive={filters.status.includes(status)}
                                                    onClick={() => {
                                                        const newStatus = filters.status.includes(status)
                                                            ? filters.status.filter(s => s !== status)
                                                            : [...filters.status, status];
                                                        onFilterChange({ ...filters, status: newStatus });
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Priority */}
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-2">
                                            <Zap className="w-3 h-3" /> Priority
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['critical', 'high', 'medium', 'low'].map(p => (
                                                <FilterChip
                                                    key={p}
                                                    label={p}
                                                    isActive={filters.priority.includes(p)}
                                                    onClick={() => {
                                                        const newPriority = filters.priority.includes(p)
                                                            ? filters.priority.filter(x => x !== p)
                                                            : [...filters.priority, p];
                                                        onFilterChange({ ...filters, priority: newPriority });
                                                    }}
                                                    color={p === 'critical' ? 'red' : p === 'high' ? 'orange' : p === 'medium' ? 'yellow' : 'blue'}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Date & Category */}
                                <div className="space-y-6">
                                    {/* Date */}
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" /> Due Date
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { id: 'today', label: 'Today' },
                                                { id: 'tomorrow', label: 'Tomorrow' },
                                                { id: 'this_week', label: 'This Week' },
                                                { id: 'overdue', label: 'Overdue' }
                                            ].map(d => (
                                                <FilterChip
                                                    key={d.id}
                                                    label={d.label}
                                                    isActive={filters.dateRange === d.id}
                                                    onClick={() => {
                                                        onFilterChange({
                                                            ...filters,
                                                            dateRange: filters.dateRange === d.id ? null : d.id as any
                                                        });
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Categories */}
                                    {availableCategories.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-2">
                                                <Tag className="w-3 h-3" /> Categories
                                            </h4>
                                            <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto custom-scrollbar">
                                                {availableCategories.map(cat => (
                                                    <FilterChip
                                                        key={cat}
                                                        label={cat}
                                                        isActive={filters.categories.includes(cat)}
                                                        onClick={() => {
                                                            const newCats = filters.categories.includes(cat)
                                                                ? filters.categories.filter(c => c !== cat)
                                                                : [...filters.categories, cat];
                                                            onFilterChange({ ...filters, categories: newCats });
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function FilterChip({ label, isActive, onClick, color }: { label: string, isActive: boolean, onClick: () => void, color?: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize border",
                isActive
                    ? "bg-slate-700 text-white border-slate-500 shadow-md transform scale-105"
                    : "bg-white/[0.05] text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-slate-200"
            )}
        >
            {label}
        </button>
    );
}
