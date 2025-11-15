# 🌙 Clarity Setup Guide

Welcome to your INFJ productivity sanctuary! This guide will help you get everything set up and running smoothly.

## ✨ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up the Database

First, generate the Prisma Client:

```bash
npx prisma generate
```

Then create and seed your database:

```bash
npx prisma db push
```

This will create a local SQLite database file at `prisma/dev.db`.

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then update the values in `.env`:

```env
# Database (already configured for SQLite)
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secret-with-openssl-rand-base64-32"

# Google OAuth (for Calendar integration)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Copy the output and replace the `NEXTAUTH_SECRET` value in your `.env` file.

### 5. (Optional) Set Up Google Calendar Integration

To enable Google Calendar sync:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy the Client ID and Client Secret to your `.env` file

### 6. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your sanctuary!

---

## 📂 Project Structure

```
productivity/
├── app/                    # Next.js app directory
│   ├── (app)/             # Main app routes (dashboard, tasks, etc.)
│   ├── api/               # API routes (coming soon)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── layout/           # Layout components (Sidebar, Header)
│   └── ui/               # UI components (Button, Card, etc.)
├── lib/                   # Utility functions
│   ├── db.ts             # Prisma client singleton
│   ├── db-helpers.ts     # Database helper functions
│   └── utils.ts          # General utilities
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Database models
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

---

## 🎨 Features Overview

### Current Features ✅

- **Beautiful UI**: INFJ-friendly design with sage, lavender, cream, and midnight colors
- **Dark Mode**: Automatic theme switching with localStorage persistence
- **Responsive Layout**: Sidebar navigation with smooth animations
- **Database Schema**: Complete models for tasks, habits, journal, and calendar

### Coming Soon 🚧

- **Task Management**: Notion-style databases with flexible properties
- **Habit Tracking**: Visual streaks and gentle reminders
- **Journal**: Rich text editor for reflections
- **Google Calendar Sync**: Two-way synchronization
- **Daily Schedule**: Auto-generated daily plans
- **Notifications**: Gentle reminders and nudges

---

## 🗄️ Database Schema

### Models

- **User**: Authentication and profile (with Google OAuth support)
- **Task**: Notion-style tasks with flexible properties
- **Habit**: Daily habits with streak tracking
- **HabitLog**: Individual habit completions
- **JournalEntry**: Reflections and notes
- **CalendarEvent**: Events with Google Calendar sync
- **Tag**: Organize tasks and journal entries

### Viewing Your Database

You can explore your database with Prisma Studio:

```bash
npx prisma studio
```

This opens a visual editor at [http://localhost:5555](http://localhost:5555).

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format Prisma schema
npx prisma format

# Create migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

---

## 💡 Tips for INFJ Developers

- **Take breaks**: The app is designed to support gentle productivity, and so is this codebase
- **Iterate slowly**: Build one feature at a time, test it, feel it
- **Customize freely**: Change colors, spacing, wording — make it yours
- **Reflect often**: Journal about what works and what doesn't

---

## 🐛 Troubleshooting

### Prisma Client issues

If you encounter Prisma Client errors, try:

```bash
npx prisma generate
npx prisma db push
```

### Build errors

Clear Next.js cache:

```bash
rm -rf .next
npm run build
```

### Port already in use

Kill the process on port 3000:

```bash
lsof -ti:3000 | xargs kill
```

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [NextAuth.js](https://next-auth.js.org/)

---

**You got this.** ✨

Built with intention, care, and calm energy for INFJs who want to work with clarity and peace.
