# BakaDM Design System

> **Visual foundation for the BakaDM Discord Activity UI.**
> Defines colors, typography, spacing, iconography, and design tokens.

---

## 🎨 Color Palette

### Primary Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-primary` | `#F59E0B` | 245, 158, 11 | Primary buttons, CTAs, dice, highlights |
| `--color-primary-hover` | `#D97706` | 217, 119, 6 | Primary button hover state |
| `--color-primary-active` | `#B45309` | 180, 83, 9 | Primary button active/pressed |
| `--color-primary-subtle` | `#FEF3C7` | 254, 243, 199 | Primary backgrounds, badges |

### Secondary Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-secondary` | `#8B5CF6` | 139, 92, 246 | AI-related elements, campaign badges, magic |
| `--color-secondary-hover` | `#7C3AED` | 124, 58, 237 | Secondary button hover |
| `--color-secondary-subtle` | `#EDE9FE` | 237, 233, 254 | AI chat bubbles, tool backgrounds |

### Semantic Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-success` | `#22C55E` | 34, 197, 94 | Health bars, positive rolls, save states |
| `--color-warning` | `#EAB308` | 234, 179, 8 | Warnings, limited uses, concentration |
| `--color-danger` | `#EF4444` | 239, 68, 68 | Damage, enemy tokens, errors, combat alerts |
| `--color-info` | `#3B82F6` | 59, 130, 246 | Player tokens, info tooltips, water/ice |

### Neutral Colors (Discord Dark Theme Aligned)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-bg-base` | `#1A1A1A` | 26, 26, 26 | Main app background |
| `--color-bg-elevated` | `#252525` | 37, 37, 37 | Cards, panels, sidebars |
| `--color-bg-sunken` | `#121212` | 18, 18, 18 | Input fields, code blocks |
| `--color-border` | `#333333` | 51, 51, 51 | Dividers, borders, grid lines |
| `--color-border-hover` | `#444444` | 68, 68, 68 | Border hover state |
| `--color-text-primary` | `#F3F4F6` | 243, 244, 246 | Headings, primary text |
| `--color-text-secondary` | `#9CA3AF` | 156, 163, 175 | Body text, labels, descriptions |
| `--color-text-muted` | `#6B7280` | 107, 114, 128 | Placeholders, disabled text, timestamps |
| `--color-text-inverse` | `#111827` | 17, 24, 39 | Text on primary/secondary backgrounds |

### Map & Game Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--map-floor-default` | `#C2410C` | Default terracotta floor |
| `--map-floor-stone` | `#4B5563` | Stone dungeon floor |
| `--map-floor-grass` | `#166534` | Grass/forest floor |
| `--map-floor-water` | `#1E40AF` | Water/river |
| `--map-obstacle` | `#78350F` | Crates, barrels, rocks |
| `--map-vegetation` | `#15803D` | Trees, bushes |
| `--fog-of-war` | `rgba(0,0,0,0.7)` | Unexplored areas |
| `--map-grid` | `rgba(255,255,255,0.15)` | Grid line overlay |

### Narrative Log Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--narrative-player-bg` | `#FEF3C7` | Player message background (cream) |
| `--narrative-player-text` | `#78350F` | Player message text (dark brown) |
| `--narrative-dm-bg` | `#451A03` | DM message background (dark brown) |
| `--narrative-dm-text` | `#FEF3C7` | DM message text (cream) |
| `--narrative-system-bg` | `#1E3A5F` | System/roll result background |
| `--narrative-system-text` | `#BFDBFE` | System/roll result text |

---

## 🔤 Typography

### Font Stack

```css
--font-sans: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
--font-display: 'Cinzel', 'Georgia', serif; /* For headings, fantasy flavor */
```

> **Note**: Use `Cinzel` or similar fantasy serif sparingly — only for major headings, campaign titles, and decorative elements. Body text must remain highly readable sans-serif.

### Type Scale

| Token | Size | Line Height | Weight | Letter Spacing | Usage |
|-------|------|-------------|--------|----------------|-------|
| `--text-hero` | 32px | 1.1 | 700 | -0.02em | Landing page hero, campaign title |
| `--text-h1` | 24px | 1.2 | 700 | -0.01em | Page titles, modal headers |
| `--text-h2` | 20px | 1.3 | 600 | 0 | Section headings, sidebar titles |
| `--text-h3` | 16px | 1.4 | 600 | 0 | Card titles, panel headers |
| `--text-body` | 14px | 1.5 | 400 | 0 | Body text, descriptions, narrative |
| `--text-small` | 12px | 1.4 | 400 | 0.01em | Labels, timestamps, meta info |
| `--text-xs` | 10px | 1.3 | 500 | 0.02em | Badges, tags, HP numbers on tokens |
| `--text-mono` | 13px | 1.4 | 400 | 0 | Dice results, stat blocks, code |

### Typography Rules

- **Maximum line length**: 60ch for narrative text (readability)
- **Minimum text size**: 12px for UI elements (accessibility)
- **Token HP text**: 10px allowed on map tokens with high contrast
- **Text shadow on tokens**: `0 1px 2px rgba(0,0,0,0.8)` for readability over images

---

## 📐 Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps, icon padding |
| `--space-2` | 8px | Default element gap, inline spacing |
| `--space-3` | 12px | Card padding, button internal padding |
| `--space-4` | 16px | Panel padding, section gaps |
| `--space-5` | 20px | Modal padding, form sections |
| `--space-6` | 24px | Major section separators |
| `--space-8` | 32px | Page-level padding |
| `--space-10` | 40px | Hero sections, large gaps |
| `--space-12` | 48px | Layout gutters |

### Layout Grid

- **Desktop**: 12-column grid, 24px gutters, max-width 1440px
- **Tablet**: 8-column grid, 16px gutters
- **Mobile**: 4-column grid, 12px gutters

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Buttons, inputs, small elements |
| `--radius-md` | 8px | Cards, panels, tokens |
| `--radius-lg` | 12px | Modals, large containers |
| `--radius-xl` | 16px | Hero cards, feature sections |
| `--radius-full` | 9999px | Pills, badges, circular tokens |

---

## 🎯 Shadows & Effects

### Elevation

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Buttons, small elements |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.4)` | Cards, panels, tokens |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.5)` | Modals, dropdowns, floating UI |
| `--shadow-glow-primary` | `0 0 12px rgba(245,158,11,0.4)` | Active player turn, selected token |
| `--shadow-glow-danger` | `0 0 12px rgba(239,68,68,0.4)` | Enemy aggro, damage alert |

### Backdrop Blur

| Token | Value | Usage |
|-------|-------|-------|
| `--blur-sm` | `blur(4px)` | Subtle overlays |
| `--blur-md` | `blur(8px)` | Modal backdrops, glass panels |
| `--blur-lg` | `blur(16px)` | Full-screen overlays |

---

## 🎭 Iconography

### Icon Set

- **Primary**: [Lucide React](https://lucide.dev/) — consistent, lightweight, customizable
- **Game-specific**: Custom SVG icons for:
  - Dice (d4, d6, d8, d10, d12, d20)
  - Status conditions (poisoned, stunned, prone, etc.)
  - Terrain types (tavern, dungeon, forest, etc.)
  - Class icons (fighter, wizard, rogue, etc.)

### Icon Sizing

| Token | Size | Usage |
|-------|------|-------|
| `--icon-xs` | 12px | Inline text, badges |
| `--icon-sm` | 16px | Buttons, list items |
| `--icon-md` | 20px | Navigation, toolbars |
| `--icon-lg` | 24px | Feature icons, empty states |
| `--icon-xl` | 32px | Hero sections, major actions |

### Icon Colors

- Default: `--color-text-secondary`
- Active/Selected: `--color-primary`
- Danger: `--color-danger`
- Success: `--color-success`

---

## 🧩 Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: #F59E0B;
  --color-primary-hover: #D97706;
  --color-primary-active: #B45309;
  --color-primary-subtle: #FEF3C7;
  
  --color-secondary: #8B5CF6;
  --color-secondary-hover: #7C3AED;
  --color-secondary-subtle: #EDE9FE;
  
  --color-success: #22C55E;
  --color-warning: #EAB308;
  --color-danger: #EF4444;
  --color-info: #3B82F6;
  
  --color-bg-base: #1A1A1A;
  --color-bg-elevated: #252525;
  --color-bg-sunken: #121212;
  --color-border: #333333;
  --color-border-hover: #444444;
  --color-text-primary: #F3F4F6;
  --color-text-secondary: #9CA3AF;
  --color-text-muted: #6B7280;
  --color-text-inverse: #111827;
  
  /* Typography */
  --font-sans: 'Inter', 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-display: 'Cinzel', 'Georgia', serif;
  
  --text-hero: 32px;
  --text-h1: 24px;
  --text-h2: 20px;
  --text-h3: 16px;
  --text-body: 14px;
  --text-small: 12px;
  --text-xs: 10px;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  
  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.4);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.5);
  --shadow-glow-primary: 0 0 12px rgba(245,158,11,0.4);
  --shadow-glow-danger: 0 0 12px rgba(239,68,68,0.4);
  
  /* Animation */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
  
  /* Z-Index Scale */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 300;
  --z-modal: 400;
  --z-tooltip: 500;
  --z-toast: 600;
}
```

---

## 🎬 Animation & Motion

### Timing

| Token | Duration | Usage |
|-------|----------|-------|
| `--duration-instant` | 100ms | Button active states, checkbox ticks |
| `--duration-fast` | 150ms | Hover states, color transitions |
| `--duration-base` | 250ms | Panel opens, modal transitions |
| `--duration-slow` | 350ms | Page transitions, large movements |
| `--duration-dice` | 800ms | Dice roll animation |

### Easing

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements exiting |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Dice rolls, celebratory |

### Motion Rules

- **Respect `prefers-reduced-motion`**: Disable animations for users who prefer reduced motion
- **No auto-playing animations** that can't be paused
- **Loading states**: Skeleton screens preferred over spinners for content
- **Dice rolls**: 3D CSS transform with random rotation, settle on result

---

## ♿ Accessibility

### Color Contrast

All text must meet **WCAG 2.1 AA** standards:

| Combination | Ratio | Pass? |
|-------------|-------|-------|
| `--color-text-primary` on `--color-bg-base` | 15.8:1 | ✅ AAA |
| `--color-text-secondary` on `--color-bg-base` | 7.2:1 | ✅ AA |
| `--color-primary` on `--color-bg-base` | 8.9:1 | ✅ AA |
| `--color-danger` on `--color-bg-base` | 6.1:1 | ✅ AA |
| `--color-text-inverse` on `--color-primary` | 8.9:1 | ✅ AA |

### Focus States

- All interactive elements must have visible focus indicators
- Focus ring: `2px solid var(--color-primary)` with `2px offset`
- Focus visible only (not on mouse click): `:focus-visible`

### Keyboard Navigation

- **Tab order**: Logical, top-to-bottom, left-to-right
- **Escape key**: Close modals, dropdowns, panels
- **Space/Enter**: Activate buttons, toggle switches
- **Arrow keys**: Navigate lists, grids, token selection

### Screen Reader Support

- All images have descriptive `alt` text
- Map tokens have `aria-label` with character name + position
- Live regions for:
  - New narrative log entries (`aria-live="polite"`)
  - Combat turn changes (`aria-live="assertive"`)
  - Dice roll results (`aria-live="polite"`)

---

## 📱 Responsive Breakpoints

| Name | Width | Target |
|------|-------|--------|
| `--bp-mobile` | < 640px | Discord mobile, PiP mode |
| `--bp-tablet` | 640px - 1024px | Discord tablet, split-screen |
| `--bp-desktop` | 1024px - 1440px | Discord desktop, full Activity |
| `--bp-wide` | > 1440px | Large monitors, expanded view |

### Layout Behavior

- **Mobile**: Single column, map takes full width, sidebars become bottom sheets
- **Tablet**: Two columns, map + one sidebar visible
- **Desktop**: Three columns (left sidebar, map, right sidebar)
- **PiP**: Minimal mode — narrative log + dice roller only

---

*Last updated: June 2026*
