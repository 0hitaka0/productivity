import { prisma } from "./db";
import type { TaskStatus, TaskPriority, Mood } from "@/types";

/**
 * Task helpers - INFJ-friendly task management
 */
export const taskHelpers = {
  /**
   * Get tasks for today with gentle prioritization
   */
  async getTodaysTasks(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await prisma.task.findMany({
      where: {
        userId,
        status: { in: ["todo", "in_progress"] },
        OR: [
          { dueDate: { gte: today, lt: tomorrow } },
          { dueDate: null }, // Include tasks without due dates
        ],
      },
      include: { tags: true },
      orderBy: [
        { priority: "desc" },
        { createdAt: "asc" },
      ],
    });
  },

  /**
   * Create a new task with gentle defaults
   */
  async createTask(
    userId: string,
    data: {
      title: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: Date;
      properties?: any;
    }
  ) {
    return await prisma.task.create({
      data: {
        ...data,
        userId,
      },
      include: { tags: true },
    });
  },

  /**
   * Complete a task with celebration
   */
  async completeTask(taskId: string) {
    return await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "done",
        completedAt: new Date(),
      },
    });
  },
};

/**
 * Habit helpers - Building consistency with gentleness
 */
export const habitHelpers = {
  /**
   * Get active habits for a user
   */
  async getActiveHabits(userId: string) {
    return await prisma.habit.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        logs: {
          orderBy: { completedAt: "desc" },
          take: 7, // Last 7 logs for streak calculation
        },
      },
      orderBy: { createdAt: "asc" },
    });
  },

  /**
   * Log a habit completion and update streak
   */
  async logHabitCompletion(
    habitId: string,
    data?: { note?: string; mood?: Mood }
  ) {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
      include: { logs: { orderBy: { completedAt: "desc" }, take: 1 } },
    });

    if (!habit) throw new Error("Habit not found");

    // Create the log
    const log = await prisma.habitLog.create({
      data: {
        habitId,
        ...data,
      },
    });

    // Calculate new streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastLog = habit.logs[0];

    let newStreak = 1;
    if (lastLog) {
      const lastLogDate = new Date(lastLog.completedAt);
      lastLogDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor(
        (today.getTime() - lastLogDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 0) {
        // Already logged today, keep streak
        newStreak = habit.streak;
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        newStreak = habit.streak + 1;
      }
      // If daysDiff > 1, streak resets to 1
    }

    // Update habit with new streak
    const updatedHabit = await prisma.habit.update({
      where: { id: habitId },
      data: {
        streak: newStreak,
        longestStreak: Math.max(newStreak, habit.longestStreak),
        lastCompletedAt: new Date(),
      },
    });

    return { log, habit: updatedHabit };
  },
};

/**
 * Journal helpers - Space for reflection
 */
export const journalHelpers = {
  /**
   * Get recent journal entries
   */
  async getRecentEntries(userId: string, limit: number = 10) {
    return await prisma.journalEntry.findMany({
      where: { userId },
      include: { tags: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  /**
   * Create a new journal entry
   */
  async createEntry(
    userId: string,
    data: {
      title?: string;
      content: string;
      mood?: Mood;
    }
  ) {
    return await prisma.journalEntry.create({
      data: {
        ...data,
        userId,
      },
    });
  },
};

/**
 * Calendar helpers - Time management with Google Calendar sync
 */
export const calendarHelpers = {
  /**
   * Get events for a date range
   */
  async getEvents(
    userId: string,
    startDate: Date,
    endDate: Date
  ) {
    return await prisma.calendarEvent.findMany({
      where: {
        userId,
        startTime: { gte: startDate },
        endTime: { lte: endDate },
      },
      orderBy: { startTime: "asc" },
    });
  },

  /**
   * Get today's events
   */
  async getTodaysEvents(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.getEvents(userId, today, tomorrow);
  },
};
