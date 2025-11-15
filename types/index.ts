// This file will contain our TypeScript types
// Prisma will auto-generate types from the schema

export type TaskStatus = "todo" | "in_progress" | "done" | "archived";
export type TaskPriority = "low" | "medium" | "high";
export type HabitFrequency = "daily" | "weekly" | "custom";
export type Mood = "happy" | "calm" | "anxious" | "reflective" | "sad" | "excited" | "tired";

// User preferences type
export interface UserPreferences {
  theme?: "light" | "dark" | "system";
  notifications?: {
    email?: boolean;
    push?: boolean;
    habitReminders?: boolean;
    taskDueReminders?: boolean;
  };
  calendar?: {
    defaultView?: "day" | "week" | "month";
    startHour?: number;
    endHour?: number;
  };
}

// Task properties type (Notion-style flexible properties)
export interface TaskProperties {
  tags?: string[];
  estimate?: number; // time estimate in minutes
  energy?: "low" | "medium" | "high"; // energy level required
  context?: string; // work, personal, etc.
  url?: string; // related link
  [key: string]: any; // allow custom properties
}
