---
name: new-component
description: Scaffold a new React component for the MyFlow project, following project conventions (RTL Hebrew, glassmorphism, Tailwind v4 logical properties, dark theme, Framer Motion)
disable-model-invocation: true
---

# new-component

Scaffold a new MyFlow component. Usage: `/new-component <ComponentName> [feature-folder]`

## Conventions to follow

**File location**: `src/components/<feature-folder>/<ComponentName>.tsx`
Default feature-folder if not specified: `ui`

**Template to generate**:

```tsx
import { motion } from 'motion/react';
// Add other imports as needed (lucide-react icons, hooks, Card, etc.)

interface <ComponentName>Props {
  // define props
}

export function <ComponentName>({ /* props */ }: <ComponentName>Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl bg-surface border border-white/6 p-4"
    >
      {/* Hebrew label example: <span className="text-sm text-gray-400">תווית</span> */}
    </motion.div>
  );
}
```

## Rules
- **Named export only** — no default export
- **Framer Motion**: import from `motion/react`, use `motion.div` wrapper with `initial/animate` fade-in
- **Tailwind v4 logical properties**: use `ps-`, `pe-`, `ms-`, `me-` instead of `pl-`, `pr-`, `ml-`, `mr-`
- **Colors**: use theme tokens — `bg-background`, `bg-surface`, `bg-surface-elevated`, `text-accent`, `text-cyan`; never hardcode hex values
- **Border**: `border border-white/6` on cards, `border-accent/20` for accent borders
- **Radius**: `rounded-2xl` for cards, `rounded-xl` for inner elements, `rounded-lg` for buttons/inputs
- **Hebrew text**: inline strings, no i18n library
- **IDs**: `crypto.randomUUID()` (via `src/lib/id.ts`)
- **Global reset is in `@layer base`** — Tailwind utilities always win, no need for `!important`

## Design tokens (from src/index.css @theme)
- `--color-background`: `#0A0A0F`
- `--color-surface`: `#1A1A2E`
- `--color-surface-elevated`: `#16213E`
- `--color-accent`: `#7C3AED` (electric purple)
- `--color-cyan`: `#06B6D4`
- `--color-success`: `#10B981`
- `--color-warning`: `#F59E0B`
- `--color-danger`: `#EF4444`
