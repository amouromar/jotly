# Jotly Product Requirements Document (PRD)

**Instruction**: This document outlines the development phases for the Jotly note-taking app. Do not deviate from the specified features, tech stack (Next.js, Tailwind CSS with Poppins font, Supabase, Clerk), or phase structure. Ensure all details remain consistent with the requirements and do not add unsolicited features or technologies.

## Overview

Jotly is a minimalist note-taking application designed for simplicity and efficiency. The frontend is built with Next.js (App Router) and styled with Tailwind CSS using the Poppins font. The backend uses Supabase for data storage and Clerk for user authentication. This PRD defines phased development, ensuring a structured rollout of features.

## Phase 1: Foundation

- **Objective**: Establish core infrastructure, authentication, and basic note functionality.
- **Features**:
  - User authentication: Sign-up, login, logout using Clerk.
  - Basic note creation: Users can write and save plain text notes.
  - Minimal UI: Homepage with login CTA, note input form, and a list of user notes.
- **Deliverables**:
  - Clerk integration with Next.js middleware for auth protection.
  - Supabase database setup with `notes` table (columns: `id`, `user_id`, `title`, `content`, `created_at`).
  - Next.js routes: `/` (homepage), `/notes` (note list).
  - Tailwind CSS configuration with Poppins font imported via Google Fonts.
- **Tasks**:
  - Configure Clerk dashboard and environment variables.
  - Set up Supabase project with Row-Level Security (RLS) for `notes` table.
  - Create reusable components: `Button`, `Input`, `NoteList`.
  - Implement server-side data fetching for notes.
- **Milestones**:
  - Users can sign up, log in, create notes, and view their note list.
- **Success Criteria**:
  - 100% successful auth flows.
  - Notes persist in Supabase and display correctly.

## Phase 2: Core Functionality

- **Objective**: Enhance note management with editing, deletion, and organization.
- **Features**:
  - Note editing: Update existing notes.
  - Note deletion: Remove notes permanently.
  - Note tags: Add and filter by tags for organization.
  - Basic search: Search notes by title or content.
- **Deliverables**:
  - Supabase CRUD operations for notes (update, delete).
  - `notes` table schema update to include `tags` (array of strings).
  - UI components: `NoteEditor`, `TagFilter`, `SearchBar`.
  - Routes: `/notes/[id]` (view note), `/notes/edit/[id]` (edit note).
- **Tasks**:
  - Implement Supabase queries for tag filtering and text search.
  - Build responsive note detail and edit pages.
  - Add client-side validation for inputs.
  - Ensure RLS policies restrict note access to owners.
- **Milestones**:
  - Users can edit, delete, tag, and search their notes.
- **Success Criteria**:
  - CRUD operations function without errors.
  - Search returns relevant results in &lt;1 second.

## Phase 3: Enhancements

- **Objective**: Add advanced features and improve user experience.
- **Features**:
  - Rich text editing: Support bold, italic, and bulleted lists.
  - Note sharing: Generate public/private shareable links.
  - Offline support: Cache notes locally for offline access.
  - Theme toggle: Switch between dark and light modes.
- **Deliverables**:
  - Tiptap editor integration for rich text.
  - Supabase schema update: Add `is_public` (boolean) and `share_id` (UUID) to `notes`.
  - Service worker for offline caching of notes.
  - Theme toggle component with local storage persistence.
  - Routes: `/notes/share/[share_id]` (view shared note).
- **Tasks**:
  - Configure Tiptap with minimal toolbar (bold, italic, list).
  - Implement Supabase policies for public note access.
  - Register service worker in `/public/sw.js`.
  - Style components for dark/light modes using Tailwind.
- **Milestones**:
  - Users can format notes, share them, use the app offline, and switch themes.
- **Success Criteria**:
  - Rich text saves correctly.
  - Shared notes are accessible via links.
  - Offline mode functions seamlessly.

## Phase 4: Optimization

- **Objective**: Polish, test, and deploy the production-ready app.
- **Features**:
  - Performance: Lazy loading for note lists, optimized images.
  - Testing: Unit tests for components, integration tests for flows.
  - Error handling: User-friendly error messages and toasts.
  - Deployment: Production environment on Vercel.
- **Deliverables**:
  - Next.js optimizations: SSG for public pages, SSR for user-specific pages.
  - Testing suite: Jest for components, Cypress for E2E.
  - Toast notification system (e.g., react-hot-toast).
- **Tasks**:
  - Optimize API routes for minimal latency.
  - Write tests covering 80% of critical paths.
  - Implement error boundaries in Next.js.
- **Success Criteria**:
  - Page load time &lt;2 seconds.
  - 90% test coverage.
  - Zero critical bugs in production.
