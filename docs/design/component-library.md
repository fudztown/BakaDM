# BakaDM Component Library

> **Reusable UI component specifications for developers.**
> Each component includes props, states, usage guidelines, and accessibility notes.

---

## 📦 Layout Components

### `AppShell`

The root layout wrapper for the Discord Activity.

```tsx
interface AppShellProps {
  children: React.ReactNode;
  mode: 'desktop' | 'tablet' | 'mobile' | 'pip';
  sidebarLeft?: React.ReactNode;
  sidebarRight?: React.ReactNode;
  bottomPanel?: React.ReactNode;
}
```

**States:**
- Default: Three-column layout (desktop)
- Mobile: Single column, sidebars as bottom sheets
- PiP: Minimal layout (narrative + dice only)

**Usage:**
```tsx
<AppShell
  mode="desktop"
  sidebarLeft={<MapToolsPanel />}
  sidebarRight={<AdventureLog />}
  bottomPanel={<CombatTracker />}
>
  <GameMap />
</AppShell>
```

---

### `Panel`

Collapsible sidebar panel with header.

```tsx
interface PanelProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
  badge?: string | number;
  actions?: React.ReactNode; // Header action buttons
}
```

**States:**
- Expanded: Full content visible
- Collapsed: Only header visible
- Loading: Skeleton content

**Accessibility:**
- Header is clickable to toggle collapse
- `aria-expanded` on toggle button
- `aria-controls` linking to content region

---

### `BottomSheet`

Mobile-only slide-up panel (replaces sidebars on mobile).

```tsx
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  snapPoints?: number[]; // [0.25, 0.5, 0.85] of viewport height
}
```

---

## 🎮 Game Components

### `GameMap`

Interactive tactical grid map.

```tsx
interface GameMapProps {
  terrain: TerrainType;
  gridSize: number; // e.g., 20 (20x20 grid)
  cellSize: number; // pixels per cell
  tokens: MapToken[];
  fogOfWar?: boolean[][];
  onTokenMove: (tokenId: string, x: number, y: number) => void;
  onCellClick: (x: number, y: number) => void;
  activeTokenId?: string;
}

interface MapToken {
  id: string;
  type: 'player' | 'enemy' | 'npc' | 'object';
  name: string;
  imageUrl: string;
  x: number;
  y: number;
  hp?: number;
  maxHp?: number;
  conditions?: Condition[];
  isVisible: boolean;
}
```

**States:**
- Default: Grid with tokens
- Token selected: Glow effect, movement range highlighted
- Token dragging: Ghost preview, snap to grid
- Combat active: Initiative order indicators on tokens

**Accessibility:**
- Keyboard navigation: Arrow keys to move selection, Enter to select
- `aria-label` on each token: "{name} at position {x},{y}, {hp}/{maxHp} HP"
- High contrast mode: Increase grid line visibility

---

### `Token`

Individual map token (character or object).

```tsx
interface TokenProps {
  token: MapToken;
  isSelected?: boolean;
  isActiveTurn?: boolean;
  onClick?: () => void;
  size?: number; // pixels, default 48
}
```

**Visual Variants:**
- Player: Square shape, blue border, class icon overlay
- Enemy: Circle shape, red border, monster type icon
- NPC: Circle shape, yellow/green border
- Object: Square shape, gray border, no portrait

**HP Indicator:**
- Full HP (100%): No indicator
- Damaged (>50%): Green arc
- Wounded (<50%): Yellow arc
- Critical (<25%): Red arc, pulsing glow
- Dead (0%): Grayed out, skull icon overlay

---

### `CombatTracker`

Bottom panel showing initiative order and turn state.

```tsx
interface CombatTrackerProps {
  combatants: Combatant[];
  currentTurnIndex: number;
  roundNumber: number;
  onEndTurn: () => void;
  onEndCombat: () => void;
}

interface Combatant {
  id: string;
  name: string;
  avatarUrl: string;
  initiative: number;
  hp: number;
  maxHp: number;
  ac: number;
  conditions: Condition[];
  type: 'player' | 'enemy' | 'npc';
}
```

**States:**
- Active: Current turn highlighted with glow
- Waiting: Other combatants dimmed
- Dead: Grayscale, moved to bottom of list
- Delaying: Italic name, "Delaying" badge

---

### `InitiativeBar`

Horizontal initiative order display.

```tsx
interface InitiativeBarProps {
  combatants: Combatant[];
  currentIndex: number;
  onSelectCombatant: (id: string) => void;
}
```

**Visual:**
- Horizontal scrollable list of token portraits
- Current turn: Large, centered, orange glow
- Up next: Medium size, to the right
- Previous: Small, to the left, dimmed
- Dead combatants: Hidden or collapsed

---

### `DiceRoller`

Animated dice roll component.

```tsx
interface DiceRollerProps {
  dice: DiceType[]; // ['d20', 'd6', 'd6']
  modifier?: number;
  onRoll: (results: number[]) => void;
  isRolling?: boolean;
  results?: number[];
}

type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';
```

**States:**
- Idle: Dice icons ready to roll
- Rolling: 3D CSS animation, random rotation
- Result: Dice settle, total displayed with modifier breakdown
- Critical: Special styling for natural 20 (gold glow) or 1 (red flash)

**Accessibility:**
- Announce result via `aria-live` region
- Visual result also shown as text

---

### `NarrativeLog`

Scrolling adventure log with DM and player messages.

```tsx
interface NarrativeLogProps {
  entries: LogEntry[];
  isStreaming?: boolean;
  onAskAI?: (question: string) => void;
}

interface LogEntry {
  id: string;
  type: 'dm' | 'player' | 'system' | 'roll';
  author?: string;
  content: string;
  timestamp: Date;
  metadata?: RollMetadata | ConditionMetadata;
}
```

**States:**
- Default: Scrollable message list
- Streaming: Typing indicator at bottom
- Empty: Placeholder with "Your adventure begins..."
- Loading: Skeleton messages

---

### `LogEntry`

Individual narrative log message.

```tsx
interface LogEntryProps {
  entry: LogEntry;
  showTimestamp?: boolean;
}
```

**Visual Variants:**
- DM: Dark brown background, cream text, diamond icon
- Player: Cream background, dark brown text, user avatar
- System: Blue background, light text, dice icon
- Roll: Compact format, dice result highlighted

---

## 🖼️ Map Tool Components

### `TerrainSelector`

Grid of terrain preset buttons.

```tsx
interface TerrainSelectorProps {
  selected: TerrainType;
  onSelect: (terrain: TerrainType) => void;
}

type TerrainType = 
  | 'tavern' | 'dungeon' | 'forest' | 'cave' 
  | 'town' | 'house' | 'street' | 'underground'
  | 'estate' | 'gallery' | 'marketplace' | 'castle'
  | 'temple' | 'camp' | 'river' | 'custom';
```

**Visual:**
- Grid of 4 columns
- Each button: Terrain icon + label
- Selected: Primary color border, subtle glow

---

### `MapToolbar`

Tools for interacting with the map.

```tsx
interface MapToolbarProps {
  activeTool: MapTool;
  onToolChange: (tool: MapTool) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

type MapTool = 'select' | 'move' | 'pan' | 'measure' | 'fog' | 'draw';
```

**Tools:**
- Select: Click to select tokens
- Move: Drag tokens
- Pan: Drag to scroll map
- Measure: Click and drag to measure distance
- Fog: Toggle fog of war visibility
- Draw: Draw annotations on map

---

## 👤 Character Components

### `CharacterSheet`

Full character sheet display.

```tsx
interface CharacterSheetProps {
  character: Character;
  isEditable?: boolean;
  onUpdate?: (updates: Partial<Character>) => void;
}

interface Character {
  id: string;
  name: string;
  avatarUrl: string;
  class: string;
  level: number;
  race: string;
  alignment: string;
  hp: number;
  maxHp: number;
  ac: number;
  speed: number;
  abilities: AbilityScores;
  skills: SkillProficiency[];
  inventory: Item[];
  spells?: Spell[];
}
```

**Sections:**
- Header: Avatar, name, class/level, HP bar
- Abilities: STR, DEX, CON, INT, WIS, CHA with modifiers
- Skills: Proficient skills highlighted
- Inventory: Categorized item list
- Spells: Spell slots, known spells

---

### `HpBar`

Health point bar with color states.

```tsx
interface HpBarProps {
  current: number;
  max: number;
  temporary?: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}
```

**Color States:**
- 100-50%: Green (`--color-success`)
- 49-25%: Yellow (`--color-warning`)
- 24-1%: Red (`--color-danger`)
- 0%: Gray with skull icon

**Sizes:**
- sm: 4px height (token overlay)
- md: 8px height (combat tracker)
- lg: 16px height (character sheet)

---

### `ConditionBadge`

Status condition indicator.

```tsx
interface ConditionBadgeProps {
  condition: Condition;
  onRemove?: () => void;
}

type Condition = 
  | 'blinded' | 'charmed' | 'deafened' | 'frightened' 
  | 'grappled' | 'incapacitated' | 'invisible' | 'paralyzed'
  | 'petrified' | 'poisoned' | 'prone' | 'restrained'
  | 'stunned' | 'unconscious' | 'exhaustion';
```

**Visual:**
- Small pill badge with condition icon
- Hover: Tooltip with condition description
- Removable: X button if DM/admin

---

## 📋 Form Components

### `CampaignCard`

Campaign selection card for lobby.

```tsx
interface CampaignCardProps {
  campaign: Campaign;
  onContinue: () => void;
  onDelete: () => void;
  onShare: () => void;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  lastPlayed: Date;
  playerCount: number;
  sessionCount: number;
  isActive: boolean;
}
```

**States:**
- Default: Cover image, title, meta info
- Hover: Slight lift, action buttons appear
- Active: "Resume" CTA prominent
- Empty: Placeholder illustration

---

### `CharacterCreator`

Step-by-step character creation wizard.

```tsx
interface CharacterCreatorProps {
  onComplete: (character: Character) => void;
  onCancel: () => void;
}
```

**Steps:**
1. Race & Subrace
2. Class & Subclass
3. Ability Scores (point buy or roll)
4. Background
5. Equipment
6. Name & Appearance
7. Review & Confirm

---

## 💳 Payment Components

### `SubscriptionTierCard`

Pricing tier display.

```tsx
interface SubscriptionTierCardProps {
  tier: SubscriptionTier;
  isCurrent?: boolean;
  onSelect: () => void;
}

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: UsageLimits;
  isPopular?: boolean;
}
```

**Visual:**
- Card with tier name, price, feature list
- Popular tier: Highlighted border, "Most Popular" badge
- Current tier: "Current Plan" badge, disabled select button

---

### `UsageMeter`

Usage limit indicator for current billing period.

```tsx
interface UsageMeterProps {
  used: number;
  limit: number;
  label: string;
  unit: string; // "hours", "messages", "tokens"
  warningThreshold?: number; // 0.8 = warn at 80%
}
```

**States:**
- Normal: Green bar
- Warning (>80%): Yellow bar + warning text
- Exceeded (>100%): Red bar + "Limit reached" message

---

## 🔔 Feedback Components

### `Toast`

Temporary notification.

```tsx
interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // ms, default 5000
  onDismiss: () => void;
}
```

**Position:** Top-right on desktop, top-center on mobile

---

### `LoadingSkeleton`

Placeholder loading state.

```tsx
interface LoadingSkeletonProps {
  variant: 'card' | 'list' | 'text' | 'token' | 'map';
  count?: number;
}
```

**Animation:** Subtle shimmer gradient, `prefers-reduced-motion` disables animation

---

### `EmptyState`

Placeholder for empty content areas.

```tsx
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

---

## ♿ Accessibility Components

### `SkipLink`

Keyboard navigation skip link.

```tsx
<SkipLink targetId="main-content">Skip to main content</SkipLink>
```

Hidden until focused, then appears at top-left.

---

### `LiveRegion`

ARIA live region for screen reader announcements.

```tsx
<LiveRegion politeness="polite" aria-label="Game updates">
  {announcement}
</LiveRegion>
```

---

## 📝 Component Checklist for Developers

Before marking a component complete:

- [ ] All props defined with TypeScript interfaces
- [ ] All states visually designed (default, hover, active, disabled, loading)
- [ ] Accessibility: keyboard navigation, focus states, ARIA attributes
- [ ] Responsive: works at all breakpoints
- [ ] Dark mode: colors use design tokens
- [ ] Animation: respects `prefers-reduced-motion`
- [ ] Storybook story created (if using Storybook)

---

*Last updated: June 2026*
