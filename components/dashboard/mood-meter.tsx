'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoodSelector, MoodData } from '@/components/mood-selector';
import { saveMood } from '@/lib/actions/mood-actions';
import { Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

export function DashboardMoodMeter() {
    const [moodData, setMoodData] = useState<MoodData>({
        value: 5,
        emotions: [],
        context: []
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await saveMood(moodData);
            if (res.success) {
                setIsSaved(true);
                toast.success("Mood recorded successfully!");
                // Reset after delay to allow another entry if needed, or keep as "checked in"
                setTimeout(() => setIsSaved(false), 3000);
            } else {
                toast.error("Failed to save mood.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isSaved) {
        return (
            <Card className="p-6 bg-slate-900/50 border-white/5 flex flex-col items-center justify-center h-[300px] animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Mood Recorded!</h3>
                <p className="text-slate-400 text-sm text-center">Thanks for checking in today.</p>
                <Button
                    variant="ghost"
                    className="mt-6 text-slate-500 hover:text-white"
                    onClick={() => setIsSaved(false)}
                >
                    Record another
                </Button>
            </Card>
        );
    }

    return (
        <Card className="p-6 bg-slate-900/50 border-white/5 space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                    Mood Check-in
                </h3>
            </div>

            <MoodSelector value={moodData} onChange={setMoodData} />

            <div className="pt-2">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Log Mood"
                    )}
                </Button>
            </div>
        </Card>
    );
}
