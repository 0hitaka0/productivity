import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Heart, BookOpen, Calendar } from "lucide-react";

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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-gentle hover:shadow-soft-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
            <CheckSquare className="h-4 w-4 text-lavender-600 dark:text-lavender-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-midnight-900 dark:text-cream-50">
              3 of 8
            </div>
            <p className="text-xs text-sage-500 dark:text-sage-600">
              You're making progress ✨
            </p>
          </CardContent>
        </Card>

        <Card className="transition-gentle hover:shadow-soft-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Habit Streak</CardTitle>
            <Heart className="h-4 w-4 text-lavender-600 dark:text-lavender-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-midnight-900 dark:text-cream-50">
              7 days
            </div>
            <p className="text-xs text-sage-500 dark:text-sage-600">
              Keep going, you got this!
            </p>
          </CardContent>
        </Card>

        <Card className="transition-gentle hover:shadow-soft-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reflections</CardTitle>
            <BookOpen className="h-4 w-4 text-lavender-600 dark:text-lavender-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-midnight-900 dark:text-cream-50">
              12 entries
            </div>
            <p className="text-xs text-sage-500 dark:text-sage-600">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="transition-gentle hover:shadow-soft-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Event</CardTitle>
            <Calendar className="h-4 w-4 text-lavender-600 dark:text-lavender-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-midnight-900 dark:text-cream-50">
              2:30 PM
            </div>
            <p className="text-xs text-sage-500 dark:text-sage-600">
              Team sync
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Focus */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Intentions</CardTitle>
          <CardDescription>
            What matters most today? Take it one step at a time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-sage-200 p-3 dark:border-midnight-700">
            <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-lavender-400" />
            <div className="flex-1">
              <p className="text-sm text-midnight-900 dark:text-cream-50">
                Complete project proposal
              </p>
              <p className="text-xs text-sage-500 dark:text-sage-600">
                High priority • Due today
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-sage-200 p-3 dark:border-midnight-700">
            <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-lavender-400" />
            <div className="flex-1">
              <p className="text-sm text-midnight-900 dark:text-cream-50">
                Morning meditation
              </p>
              <p className="text-xs text-sage-500 dark:text-sage-600">
                Self-care • 10 minutes
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-sage-200 p-3 dark:border-midnight-700">
            <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-lavender-400" />
            <div className="flex-1">
              <p className="text-sm text-midnight-900 dark:text-cream-50">
                Review calendar for tomorrow
              </p>
              <p className="text-xs text-sage-500 dark:text-sage-600">
                Planning • Evening
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
