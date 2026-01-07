"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Task } from './task-card';
import { TaskList } from './task-list';
import { TaskBoard } from './task-board';
import { CreateTaskDialog } from './create-task-dialog';
import { TaskDetailPanel } from './task-detail-panel';
import { TaskFilters, FilterState } from './task-filters';
import { LayoutGrid, List, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskPersonalization } from '@/components/hooks/use-task-personalization';
import { isToday, isTomorrow, isThisWeek, isPast, isSameDay } from 'date-fns';

export function TasksView() {
    const { config } = useTaskPersonalization();
    const [view, setView] = useState<'list' | 'board'>(config.defaultView);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<FilterState>({
        status: [],
        priority: [],
        dateRange: null,
        categories: []
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/tasks');
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    // Derived: Available Categories for Filter
    const availableCategories = useMemo(() => {
        const cats = new Set<string>();
        tasks.forEach(t => {
            if (t.category) cats.add(t.category);
            t.tags?.forEach(tag => cats.add(tag.name));
        });
        return Array.from(cats);
    }, [tasks]);

    // Derived: Filtered Tasks
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            // 1. Search Query
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchesTitle = task.title.toLowerCase().includes(q);
                const matchesDesc = task.description?.toLowerCase().includes(q);
                const matchesSubtask = task.subtasks?.some(s => s.title.toLowerCase().includes(q));
                const matchesTags = task.tags?.some(t => t.name.toLowerCase().includes(q)) || task.category?.toLowerCase().includes(q);

                if (!matchesTitle && !matchesDesc && !matchesSubtask && !matchesTags) return false;
            }

            // 2. Status Filter
            if (filters.status.length > 0) {
                if (!filters.status.includes(task.status)) return false;
            }

            // 3. Priority Filter
            if (filters.priority.length > 0) {
                if (!filters.priority.includes(task.priority || 'none')) return false;
            }

            // 4. Category Filter
            if (filters.categories.length > 0) {
                const taskCats = [task.category, ...(task.tags?.map(t => t.name) || [])].filter(Boolean);
                const hasMatch = taskCats.some(c => filters.categories.includes(c!));
                if (!hasMatch) return false;
            }

            // 5. Date Filter
            if (filters.dateRange) {
                if (!task.dueDate) return false; // If filtering by date, tasks without date are excluded
                const date = new Date(task.dueDate);

                switch (filters.dateRange) {
                    case 'today':
                        if (!isToday(date)) return false;
                        break;
                    case 'tomorrow':
                        if (!isTomorrow(date)) return false;
                        break;
                    case 'this_week':
                        if (!isThisWeek(date)) return false;
                        break;
                    case 'overdue':
                        // Check if past AND not today (since isPast includes today typically depending on time)
                        // Simplified: isPast && !isToday
                        if (!isPast(date) || isToday(date)) return false;
                        break;
                }
            }

            return true;
        });
    }, [tasks, searchQuery, filters]);


    // Handlers (Move, Update, Delete etc.) - kept same
    const handleTaskMove = async (taskId: string, newStatus: string, newIndex: number) => {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;

        const updatedTasks = [...tasks];
        updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], status: newStatus };
        setTasks(updatedTasks);

        if (selectedTask?.id === taskId) {
            setSelectedTask({ ...selectedTask, status: newStatus });
        }

        try {
            await fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, order: newIndex })
            });
        } catch (error) {
            console.error("Failed to move task", error);
        }
    };

    const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
        if (selectedTask?.id === taskId) {
            setSelectedTask(prev => prev ? { ...prev, ...updates } : null);
        }

        try {
            await fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
        } catch (error) {
            console.error("Failed to update task", error);
            fetchTasks();
        }
    };

    const handleTaskDelete = async (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        setSelectedTask(null);

        try {
            await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
        } catch (error) {
            console.error("Failed to delete task", error);
            fetchTasks();
        }
    };

    const handleTaskToggle = (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        handleTaskUpdate(taskId, { status: newStatus });
    };

    const handleTaskCreated = (newTask: Task) => {
        setTasks([newTask, ...tasks]);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Tasks</h1>
                    <p className="text-slate-400 text-sm">{config.focusModeQuote}</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-900/50 p-1 rounded-lg border border-white/5">
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 rounded-md transition-all ${view === 'list' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setView('board')}
                            className={`p-2 rounded-md transition-all ${view === 'board' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>

                    <Button
                        onClick={() => setShowCreateDialog(true)}
                        className="bg-[#0f172a] hover:bg-[#1e293b] text-white border border-white/10"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                    </Button>
                </div>
            </div>

            {/* Filters / Search Bar */}
            <TaskFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filters}
                onFilterChange={setFilters}
                availableCategories={availableCategories}
            />

            {/* Content Area */}
            <div className="flex-1 min-h-0">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-slate-500">
                        Loading stars...
                    </div>
                ) : (
                    <>
                        {view === 'list' ? (
                            <TaskList
                                tasks={filteredTasks}
                                groupBy="priority"
                                onTaskClick={setSelectedTask}
                                onToggle={handleTaskToggle}
                                searchQuery={searchQuery}
                            />
                        ) : (
                            <TaskBoard
                                tasks={filteredTasks}
                                onTaskMove={handleTaskMove}
                                onTaskClick={setSelectedTask}
                                onToggle={handleTaskToggle}
                                searchQuery={searchQuery}
                            />
                        )}

                        {filteredTasks.length === 0 && !loading && (
                            <div className="h-64 flex flex-col items-center justify-center text-slate-500 animate-in fade-in">
                                <Search className="w-8 h-8 mb-2 opacity-50" />
                                <p>No matches found</p>
                                <Button
                                    variant="link"
                                    className="text-blue-400"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setFilters({ status: [], priority: [], dateRange: null, categories: [] });
                                    }}
                                >
                                    Clear filters
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <CreateTaskDialog
                isOpen={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onTaskCreated={handleTaskCreated}
            />

            <TaskDetailPanel
                task={selectedTask}
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                onUpdate={handleTaskUpdate}
                onDelete={handleTaskDelete}
            />
        </div>
    );
}
