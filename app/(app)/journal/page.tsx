import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-light text-midnight-900 dark:text-cream-50">
          Journal & Reflections
        </h2>
        <p className="text-sage-600 dark:text-sage-400">
          A private space for thoughts, feelings, and insights
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Your reflection space is being crafted 📝
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-sage-600 dark:text-sage-400">
            Write freely, reflect deeply, and look back on your journey. Your journal will be
            a calm, private sanctuary for processing and growth.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
