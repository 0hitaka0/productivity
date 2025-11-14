import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HabitsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-light text-midnight-900 dark:text-cream-50">
          Habits & Consistency
        </h2>
        <p className="text-sage-600 dark:text-sage-400">
          Build meaningful routines with gentle encouragement
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Your habit tracker is taking shape 🌱
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-sage-600 dark:text-sage-400">
            Track daily habits, see your streaks grow, and celebrate consistency — all with
            beautiful visualizations and supportive reminders.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
