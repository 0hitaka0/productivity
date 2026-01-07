# 🏗️ Architecture & Concepts

This document provides a technical overview of **Clarity** for developers and curious users.

## 🛠️ Technology Stack

Clarity is built on a modern, type-safe stack:

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [SQLite](https://sqlite.org/) (via [Prisma](https://www.prisma.io/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Editor**: [Tiptap](https://tiptap.dev/) (Headless WYSIWYG editor)

## 📂 Design Patterns

### Directory Structure
We follow the standard Next.js App Router structure:
- `app/`: Application routes and pages.
- `components/`: Reusable React components.
  - `ui/`: Atomic UI components (buttons, inputs).
- `lib/`: Utility functions and shared business logic.
- `prisma/`: Database schema and migrations.

### Data Fetching
We mostly use **Server Components** for fetching data directly from the database using Prisma. Client components are used for interactive elements (like the text editor or habit checkboxes).

## 🗄️ Database Schema

Our data model is centered around the User. Here are the core models:

### User
The central entity. Stores profile info and settings.
*Relations*: Has many `Tasks`, `Habits`, `JournalEntries`, `Goals`, `Moods`.

### Task
Represents a todo item with Notion-style properties.
- `status`: "todo", "in_progress", "done", "archived"
- `priority`: "low", "medium", "high", "critical"
- `dueDate`: DateTime?
- `properties`: Flexible JSON field for custom attributes.

### Habit
A daily or regular habit to track.
- `frequency`: daily, weekly, custom
- `streak`: Current streak counter
*Relations*: Has many `HabitLogs` (records of completion).

### JournalEntry & Mood
Reflections and emotional tracking.
- `JournalEntry`: Rich text content, mood, and tags.
- `Mood`: Detailed emotional tracking (valency, intensity) linked to users or journal entries.

### Goal
Long-term objectives.
- `status`: active, paused, completed, abandoned
- `progress`: 0-100 integer.

### Insight
AI-generated patterns and growth suggestions based on user data.


## 🎨 Design Philosophy

Clarity's code should reflect its purpose: **calm and explicitly typed**.

1.  **Semantic Naming**: Variables should tell you exactly what they are specific to domain (e.g., `dailyIntention` vs `text`).
2.  **Component Modularity**: Small, single-purpose components are preferred over large monolithic ones.
3.  **Aesthetics as Function**: Visual details (animations, spacing) are treated as first-class citizens, not afterthoughts.
