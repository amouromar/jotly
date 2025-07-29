# Jotly Technical Implementation

**Instruction to AI**: This document details the technical implementation for Jotly. Strictly use Next.js 14 (App Router, `app/` not `src/`), Tailwind CSS with Poppins font, Supabase, and Clerk. Do not deviate from the specified folder structure, routes, or dependencies. Ensure all code and configurations align with the requirements and avoid introducing unrequested technologies or structures.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS 4, Poppins font (Google Fonts).
- **Backend**: Supabase (PostgreSQL) for data storage.
- **Authentication**: Clerk for user management.
- **Rich Text**: Tiptap for note formatting.
- **Testing**: Jest (unit), Cypress (E2E).
- **Deployment**: Vercel for hosting.
- **Offline**: Service worker for caching.

## Folder Structure

```
/app
  /notes
    /[id]
      page.tsx          # View single note
    /edit
      /[id]
        page.tsx        # Edit note
    page.tsx            # List all notes
  /share
    /[share_id]
      page.tsx          # View shared note
  /api
    /notes
      route.ts          # CRUD API for notes
  /components
    Button.tsx          # Reusable button
    Input.tsx           # Reusable input
    Textarea.tsx        # Reusable textarea
    NoteCard.tsx        # Note preview card
    NoteEditor.tsx      # Tiptap rich text editor
    SearchBar.tsx       # Search input with icon
    TagFilter.tsx       # Tag selection UI
    ThemeToggle.tsx     # Dark/light mode switch
    Toast.tsx           # Notification component
  /lib
    supabase.ts         # Supabase client initialization
    clerk.ts            # Clerk auth utilities
    types.ts            # TypeScript interfaces
  /public
    sw.js               # Service worker for offline
  /styles
    globals.css         # Tailwind and Poppins styles
  layout.tsx            # Root layout with Clerk provider
  page.tsx              # Homepage
middleware.ts           # Clerk auth middleware
tailwind.config.js      # Tailwind configuration
tsconfig.json           # TypeScript configuration
```

## Routes

- `/`: Homepage with welcome message and login/signup CTAs.
- `/notes`: List user’s notes (protected route).
- `/notes/[id]`: View single note (protected).
- `/notes/edit/[id]`: Edit note (protected).
- `/share/[share_id]`: View shared note (public).
- `/api/notes`: API endpoints for note CRUD.

## Dependencies

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "tailwindcss": "3.x",
    "@supabase/supabase-js": "2.x",
    "@clerk/nextjs": "latest",
    "@tiptap/react": "latest",
    "@tiptap/starter-kit": "latest",
    "react-hot-toast": "latest"
  },
  "devDependencies": {
    "typescript": "5.x",
    "@types/react": "18.x",
    "jest": "latest",
    "cypress": "latest",
    "autoprefixer": "latest",
    "postcss": "latest"
  }
}
```

## Configurations

- **Tailwind (**`tailwind.config.js`**)**:

  ```js
  module.exports = {
    content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: "#4A90E2",
          secondary: "#50C878",
          accent: "#F6AD55",
          error: "#E53E3E",
          "bg-light": "#F5F7FA",
          "bg-dark": "#1A202C",
        },
        fontFamily: {
          poppins: ["Poppins", "sans-serif"],
        },
      },
    },
    plugins: [],
  };
  ```

- **Global CSS (**`app/styles/globals.css`**)**:

  ```css
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap");
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  body {
    font-family: "Poppins", sans-serif;
  }
  ```

- **Supabase Client (**`app/lib/supabase.ts`**)**:

  ```ts
  import { createClient } from "@supabase/supabase-js";
  export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  ```

- **Clerk Middleware (**`middleware.ts`**)**:

  ```ts
  import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
  const isProtected = createRouteMatcher(["/notes(.*)"]);
  export default clerkMiddleware((auth, req) => {
    if (isProtected(req)) auth().protect();
  });
  ```

## Supabase Schema

- **Table**: `notes`

  ```sql
  CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    title TEXT NOT NULL,
    content JSONB, -- For rich text (Tiptap JSON)
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    share_id UUID UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

- **RLS Policies**:
  - Read: `user_id = auth.uid() OR is_public = TRUE`.
  - Write: `user_id = auth.uid()`.
  - Update/Delete: `user_id = auth.uid()`.

## Implementation Details

- **Authentication**:
  - Use Clerk’s `<ClerkProvider>` in `layout.tsx`.
  - Sync Clerk users with Supabase via webhooks.
  - Protect routes with Clerk middleware.
- **Note Management**:
  - Server Components for fetching notes (`/notes`, `/notes/[id]`).
  - Client Components for interactive UI (`NoteEditor`, `SearchBar`).
  - API routes (`/api/notes`) handle CRUD with Supabase.
- **Rich Text**:
  - Tiptap with Starter Kit (bold, italic, list).
  - Store content as JSONB in Supabase.
- **Offline Support**:
  - Service worker caches notes and static assets.
  - LocalStorage for draft notes (sync on reconnect).
- **Theming**:
  - Use Tailwind’s `dark:` prefix.
  - Store theme in localStorage, toggle via `ThemeToggle`.
- **Performance**:
  - Lazy load note list with `useInfiniteQuery` (e.g., TanStack Query).
  - Optimize images with Next.js `Image` component.
- **Testing**:
  - Jest: Test components (`Button`, `NoteCard`).
  - Cypress: Test flows (auth, note CRUD, search).
- **Error Handling**:
  - Use Next.js error boundaries.
  - Show toasts for success/error states.

## Deployment

- **Vercel**:
  - Connect GitHub repo.
  - Set environment variables: Supabase URL/key, Clerk keys.
  - Enable auto-scaling and CDN.
- **CI/CD**:
  - Run tests on push.
  - Auto-deploy on merge to `main`.
