import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Heart, BookOpen, Calendar } from "lucide-react";

export function StatsGrid() {
  return (
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
  );
}
