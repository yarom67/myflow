# MyFlow — Personal Finance Dashboard

## Project Overview
Hebrew RTL personal finance dashboard. Single-user, no auth, client-side only.
Premium light fintech aesthetic (Stripe/Linear/Mercury inspired).

## Tech Stack
- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 (CSS `@theme` config, no tailwind.config.js)
- **Routing**: React Router v7 (library mode, `createBrowserRouter`)
- **State**: Zustand (UI state only — sidebar, modals, selected month)
- **Database**: Dexie.js (IndexedDB wrapper) — all persistent data
- **Charts**: Recharts (dark themed, gradient fills)
- **Animations**: Framer Motion via `motion/react`
- **Icons**: Lucide React
- **CSV**: PapaParse
- **OCR**: Tesseract.js (client-side receipt scanning)
- **Fonts**: Rubik (UI + Hebrew) + DM Mono (financial numbers) via Google Fonts

## Architecture
- All persistent data (transactions, categories, settings) stored in IndexedDB via Dexie.js
- Zustand only manages ephemeral UI state (sidebar collapsed, active modal, selected month)
- Custom hooks compute all derived data (`useBudget`, `useChartData`, `useInsights`)
- Dexie's `useLiveQuery` hook for reactive data fetching from IndexedDB
- No backend — everything runs client-side

## Design System
- Background: `#F4F2FC` (lavender), Surface: `#FFFFFF`
- Accent: `#6D28D9` (violet) + `#0891B2` (cyan secondary)
- Text: `#09090B` primary (zinc-950), `#52525B` secondary, `#A1A1AA` muted
- Cards: `shadow-card` class (no border) — compound box-shadow + 1px ring
- Hover lift: `shadow-card-hover` — `0 8px 24px rgba(0,0,0,0.09)`
- Numbers: `.font-data` — DM Mono + tabular-nums + tight tracking
- Radius: `rounded-2xl` cards, `rounded-xl` inputs/buttons
- All colors in `src/index.css` via `@theme` block; utilities in `@layer utilities`

## RTL
- `<html dir="rtl" lang="he">` in index.html
- Tailwind v4 logical properties (`ps-`, `pe-`, `ms-`, `me-`)
- Charts keep LTR x-axis (standard for financial data)
- All UI text in Hebrew

## Key Directories
```
src/
├── components/   # UI components organized by feature
├── db/           # Dexie database schema and instance
├── hooks/        # Custom hooks for derived data
├── layouts/      # AppLayout (sidebar + content)
├── lib/          # Utilities (csv, ocr, dates, export, constants)
├── pages/        # 5 page components
├── routes/       # React Router config
├── store/        # Zustand UI-only store
└── types/        # TypeScript interfaces
```

## Commands
- `npm run dev` — Start dev server (Vite, port 5173)
- `npm run build` — Production build
- `npm run preview` — Preview production build

## Conventions
- All component files use PascalCase: `HeroCard.tsx`
- All utility files use camelCase: `dates.ts`
- Hebrew text strings inline (no i18n library)
- Prefer named exports over default exports
- Use `crypto.randomUUID()` for ID generation

## Gotchas
- **Tailwind v4 CSS reset**: Global `* { margin: 0; padding: 0 }` MUST be inside `@layer base {}` — outside a layer it overrides Tailwind utilities
- **Mobile layout**: `MobileHeader` (fixed top) + `MobileNav` (fixed bottom) in `src/components/sidebar/`; `AppLayout` toggles between sidebar and mobile nav
- **iOS safe area**: Bottom nav uses `env(safe-area-inset-bottom)` for notch/home indicator clearance
- **Recharts colors**: Does not inherit CSS vars — hardcode axis ticks (`#A1A1AA`) and grid strokes (`rgba(0,0,0,0.06)`)

## Repo
- **GitHub**: https://github.com/yarom67/myflow
