# Project Agent Documentation

## Project Overview
Hitaka is a productivity application designed to help users manage habits, tasks, journals, and track their personal growth. It leverages MBTI types for personalized reflections and insights.
Built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Prisma** (PostgreSQL).

## Directory Structure
```
.
├── app/                  # Next.js App Router pages and API routes
│   ├── (main)/           # Main application layout group
│   ├── api/              # API endpoints
│   ├── dashboard/        # Dashboard specific routes (legacy/redirects?)
│   └── ...
├── components/           # React components
│   ├── dashboard/        # Dashboard-specific components
│   ├── features/         # Feature-specific components
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   └── ...
├── lib/                  # Utility functions and shared logic
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── ...
```

## Conventions & Patterns
- **Components**: Functional components using TypeScript. Place feature-specific components in `components/<feature>/` or `components/features/<feature>/`.
- **UI Components**: Use `components/ui` for generic design system elements (buttons, inputs, etc.).
- **Styling**: Tailwind CSS for styling. Use `clsx` or `tailwind-merge` for class manipulation.
- **State Management**: React hooks and context where necessary. `sonner` for toasts.
- **Data Fetching**: Server Components for data fetching where possible. API routes for client-side interactions.
- **Database**: Prisma ORM. Update `schema.prisma` for DB changes and run `npx prisma migrate dev`.
- **Authentication**: NextAuth.js (v5 beta) handling sessions.

## Domain Knowledge
- **MBTI**: The app uses Myers-Briggs Type Indicator to personalize content (reflections, greetings).
- **Habits**: Daily tracking of positive routines.
- **Journaling**: Mood tracking and text entries.
- **Tasks**: To-do list management.

## Do's and Don'ts
- **DO** use semantic HTML.
- **DO** keep components small and focused.
- **DO** use the `components/ui` library for consistency.
- **DON'T** put business logic in UI components if it can be extracted to hooks or utils.
- **DON'T** leave unused files or test scripts in production folders.
- **DON'T** hardcode secrets. Use environment variables.

## Common Tasks
### Running Locally
```bash
npm run dev
```

### Database Migration
```bash
npx prisma migrate dev
```

### Adding a Component
1. Check `components/ui` first.
2. If it's a new feature, create `components/<feature>/<component-name>.tsx`.

### Docker Build
```bash
docker-compose up --build
```
