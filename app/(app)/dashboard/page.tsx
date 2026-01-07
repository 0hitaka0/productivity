import { StatsGrid } from "./components/StatsGrid";
import { TodaysFocus } from "./components/TodaysFocus";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-light text-midnight-900 dark:text-cream-50">
          Your Dashboard
        </h2>
        <p className="text-sage-600 dark:text-sage-400">
          A gentle overview of your day and intentions
        </p>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Today's Focus */}
      <TodaysFocus />
    </div>
  );
}

