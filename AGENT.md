# Agent Documentation

## Project Overview
This project is a productivity application focused on a "gentle" approach to task management and habit building. It utilizes Next.js with the App Router, Shadcn UI for components, and Tailwind CSS for styling.

## Directory Structure
The project follows a standard Next.js App Router structure with a focus on colocation for feature-specific components.

### `app/`
Contains the application routes and pages.
- `app/(app)/`: The main authenticated application layout.
- `app/(app)/dashboard/`: Dashboard feature.
  - `components/`: Feature-specific components colocated here.
- `app/api/`: API routes.

### `components/`
- `ui/`: Shared, atomic UI components (Shadcn UI).
- `layout/`: Global layout components (Sidebar, Header).

### `lib/`
Utility functions and database helpers.

## Conventions & Patterns

### Colocation
- **Do**: Store components specific to a feature within that feature's directory (e.g., `dashboard/components`).
- **Don't**: Dump everything into a global `components/` folder unless it is truly shared across multiple features.

### Styling
- Use Tailwind CSS for all styling.
- Use the predefined color palette (midnight, sage, lavender, cream) to maintain the "gentle" aesthetic.
- Support Dark Mode using the `dark:` prefix.

### Components
- Use functional components.
- Use the `export function` syntax.
- Ensure all text contrasts meet accessibility standards.

## Domain Knowledge
- **Gentle Productivity**: The app avoids "hustle culture" language. Use terms like "Intentions", "Reflections", "Gentle overview", "Peace of mind".
- **Design Language**: Soft shadows, rounded corners, pastel/calming colors.

## Do's and Don'ts
- **DO** keep the file structure flat where possible.
- **DO** use semantic HTML.
- **DON'T** remove the `.gemini` folder or its contents.
- **DON'T** mix different styling libraries (e.g., no raw CSS modules if Tailwind can do it).

## Common Tasks

### Adding a New Feature
1. Create a new directory in `app/(app)/[feature-name]`.
2. Create `page.tsx` for the route.
3. If complex, create a `components/` subdirectory within it.

### Modifying the Theme
- Update `tailwind.config.ts` for global color changes.
- Update `app/globals.css` for base styles.
