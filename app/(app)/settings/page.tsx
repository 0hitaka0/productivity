import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-light text-midnight-900 dark:text-cream-50">
          Settings
        </h2>
        <p className="text-sage-600 dark:text-sage-400">
          Customize your sanctuary to fit your needs
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Personalization options on the way ⚙️
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-sage-600 dark:text-sage-400">
            Soon you'll be able to customize themes, notification preferences, Google Calendar
            settings, and more — all to make this space truly yours.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
