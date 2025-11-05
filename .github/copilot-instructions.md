# GoCart AI Development Guide

This guide provides essential context for AI agents working with this ecommerce application built with React, TypeScript, and Supabase.

## Project Architecture

### Key Components
- **Frontend**: Vite + React + TypeScript + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Query for server state, React Context for app state
- **Styling**: Tailwind CSS + shadcn/ui components

### Core Directory Structure
```
src/
  components/       # Reusable UI components
    ui/            # shadcn/ui base components
    layout/        # Page layout components
  contexts/        # React context providers
  hooks/           # Custom React hooks
  integrations/    # External service integrations
  pages/           # Route-based page components
  types/          # TypeScript type definitions
supabase/
  migrations/      # Database migration files
```

## Development Workflow

### Local Setup
1. Install dependencies: `npm install`
2. Configure Supabase:
   - Add to `.env`:
     ```
     VITE_SUPABASE_URL="https://your-project.supabase.co"
     VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
     ```
3. Start dev server: `npm run dev`

### Common Development Tasks
- Database migrations: `npm run migrate`
- Build: `npm run build` (production) or `npm run build:dev` (development)
- Lint: `npm run lint`

## Key Patterns & Conventions

### Data Fetching
Use React Query hooks in `src/hooks/` for data fetching. Example from `useProducts.ts`:
```tsx
const { data, isLoading } = useProducts({ limit: 8, featured: true });
```

### UI Components
- Use shadcn/ui components from `components/ui/` as base building blocks
- Custom components in `components/` should compose these base components
- Follow existing component structure for new features:
  ```tsx
  import { Button } from "@/components/ui/button"
  import { Card } from "@/components/ui/card"
  ```

### Database Integration
- Supabase client is pre-configured in `src/integrations/supabase/client.ts`
- Use generated types from `src/types/supabase.ts`
- Add migrations in `supabase/migrations/` with timestamp prefix

### State Management
- Server state: React Query
- Auth state: `AuthContext` (`src/contexts/AuthContext.tsx`)
- Language/localization: `LanguageContext` (`src/contexts/LanguageContext.tsx`)

### Styling
- Use Tailwind CSS classes
- Follow shadcn/ui component patterns for consistency
- Layout components in `components/layout/` handle page structure

## Common Pitfalls
- Always handle loading/error states when using React Query hooks
- Supabase client requires environment variables to be prefixed with `VITE_`
- New UI components should extend shadcn/ui base components rather than starting from scratch