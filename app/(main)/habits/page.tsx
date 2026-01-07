import { HabitTrackerView } from '@/components/habits/habit-tracker-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Habits | Clarity',
    description: 'Build consistent routines personalized to your MBTI type.',
};

export default function HabitsPage() {
    return (
        <div className="h-full p-4 md:p-8 animate-fade-in text-slate-200 overflow-y-auto">
            <HabitTrackerView />
        </div>
    );
}
