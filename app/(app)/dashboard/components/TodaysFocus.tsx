import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TodaysFocus() {
    return (
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
    );
}
