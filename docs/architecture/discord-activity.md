# Discord Activity Architecture

> **Service 2 — Next.js Embedded Activity (Game UI)**

## Overview

The Discord Activity is an embedded iframe application that provides the visual game interface — maps, combat tracker, character sheets, and campaign management. It runs as a Discord Embedded App (Activity) and reuses React components from the existing `cr-campaign-simulator` project.

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| UI Library | React 18+ |
| Styling | Tailwind CSS |
| State Management | Zustand / React Context |
| Real-time | WebSocket (Supabase Realtime) |
| Discord SDK | @discord/embedded-app-sdk |
| Hosting | Vercel |

## Discord Activity Integration

### How Activities Work

Discord Activities are web applications embedded as iframes within Discord. They run inside a sandboxed environment with access to the Discord SDK for:

- **User identity** — Know which Discord user is interacting
- **Voice state** — Know who's in the voice channel
- **Guild context** — Know which server/channel
- **Layout mode** — Respond to PiP (picture-in-picture) vs. full-screen

### Activity Lifecycle

```
User clicks "Launch Game UI" button in Discord
    │
    ▼
Discord opens Activity iframe (Vercel-hosted Next.js app)
    │
    ▼
Activity SDK authenticates user via Discord OAuth
    │
    ▼
App loads campaign state from Supabase
    │
    ▼
WebSocket connection established for real-time updates
    │
    ▼
Player interacts with UI (map, combat, character sheet)
    │
    ▼
UI updates pushed in real-time to all party members
```

## Reused Components from cr-campaign-simulator

The following React components are ported/adapted from the existing `cr-campaign-simulator` monorepo:

| Component | Source | Adaptation |
|-----------|--------|-----------|
| `GameMap` | `apps/dnd-simulator/src/components/GameMap` | Add real-time multi-player sync |
| `CombatTracker` | `apps/dnd-simulator/src/components/CombatTracker` | Add Discord voice channel integration |
| `CharacterSheet` | `apps/dnd-simulator/src/components/CharacterSheet` | Add Supabase persistence |
| `DiceRoller` | `apps/dnd-simulator/src/components/DiceRoller` | Add shared roll visibility |
| `NarrativeLog` | `apps/dnd-simulator/src/components/NarrativeLog` | Add real-time streaming from Claw |
| `InitiativeTracker` | New | Built for Activity |

## Page Structure

```
/app
├── layout.tsx              # Discord Activity shell, SDK init
├── page.tsx                # Campaign dashboard / lobby
├── /campaign/[id]
│   ├── page.tsx            # Active game session
│   ├── /map                # Full-screen map view
│   ├── /combat             # Combat encounter view
│   └── /characters         # Party character sheets
├── /settings
│   └── page.tsx            # User preferences, voice settings
└── /api                    # API routes (see Backend API docs)
```

## Real-Time Synchronization

All players in a session see the same state in real-time:

```
Player A interacts with map → Supabase Realtime broadcast
    → Player B's UI updates    → Player C's UI updates
    
Claw produces DM response → Backend pushes to Supabase Realtime
    → All players see narrative update
    → Combat tracker updates
    → Map markers move
```

### Supabase Realtime Channels

| Channel | Purpose |
|---------|---------|
| `session:{session_id}` | Game state updates (narrative, turns) |
| `combat:{session_id}` | Combat-specific updates (initiative, HP) |
| `map:{session_id}` | Map marker positions, fog of war |
| `dice:{session_id}` | Shared dice roll results |

## UI/UX Design Principles

1. **Mobile-friendly** — Activity can be used on Discord mobile
2. **PiP-aware** — Minimal UI in picture-in-picture mode (just narrative + dice)
3. **Dark mode first** — Matches Discord's dark theme
4. **Low bandwidth** — Minimal data transfer for real-time sync
5. **Offline resilient** — Graceful degradation if WebSocket drops

## Environment Variables

```env
NEXT_PUBLIC_DISCORD_CLIENT_ID=<discord_app_id>
NEXT_PUBLIC_SUPABASE_URL=<supabase_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase_anon_key>
DISCORD_CLIENT_SECRET=<discord_client_secret>
SUPABASE_SERVICE_ROLE_KEY=<supabase_service_key>
```
