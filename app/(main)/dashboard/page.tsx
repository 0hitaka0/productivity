
import { Suspense } from 'react';
import { getDailyTasks } from '@/lib/actions/task-actions';
import { getHabits } from '@/lib/actions/habit-actions';
import { DashboardContent } from './components/dashboard-content';
import { Loader2 } from 'lucide-react';
import { getAuthenticatedUserId } from '@/lib/actions/habit-actions';
import { getRecentJournalEntries } from '@/lib/actions/journal-actions';

import { getLifeStreakAnalytics } from '@/lib/actions/analytics-actions';

// Ensure this is a server component
export const dynamic = 'force-dynamic';

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const userId = await getAuthenticatedUserId();

    // Fetch Data in Parallel
    const [tasks, habits, entries, analytics] = await Promise.all([
        getDailyTasks(),
        getHabits(),
        getRecentJournalEntries(5),
        getLifeStreakAnalytics()
    ]);

    // Filter Habits for Today (simple logic: check if 'targetDays' includes today's short name)
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayShort = days[new Date().getDay()];
    const todayHabits = habits.filter(h => h.targetDays && Array.isArray(h.targetDays) && h.targetDays.includes(todayShort));

    // Handle search params safely
    const resolvedParams = await searchParams;
    const showWelcome = resolvedParams?.welcome === 'true';

    return (
        <Suspense fallback={
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        }>
            <DashboardContent
                initialTasks={tasks}
                initialHabits={todayHabits}
                initialEntries={entries}
                lifeStreak={analytics}
                showWelcome={showWelcome}
            />
        </Suspense>
    );
}

