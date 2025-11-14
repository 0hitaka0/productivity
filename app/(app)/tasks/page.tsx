import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-light text-midnight-900 dark:text-cream-50">
          Tasks & Intentions
        </h2>
        <p className="text-sage-600 dark:text-sage-400">
          Organize your thoughts and priorities with gentle structure
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            We're building your Notion-style task management system ✨
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-sage-600 dark:text-sage-400">
            Soon you'll be able to create, organize, and track your tasks with beautiful databases,
            filters, and views — all designed for clarity and peace of mind.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
