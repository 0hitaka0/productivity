import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-light text-midnight-900 dark:text-cream-50">
          Calendar & Schedule
        </h2>
        <p className="text-sage-600 dark:text-sage-400">
          Your time, beautifully organized and synced with Google Calendar
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Two-way Google Calendar sync is on the way 🗓️
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-sage-600 dark:text-sage-400">
            We're setting up seamless integration with your Google Calendar, plus intelligent
            scheduling and gentle reminders for your day.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
