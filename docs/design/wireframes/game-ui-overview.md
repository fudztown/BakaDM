# Game UI Overview Wireframe

> **Main game screen layout for the BakaDM Discord Activity.**
> Three-column layout: Left sidebar (tools), Center (map), Right sidebar (narrative).
> Bottom panel for combat state and chat input.

---

## Desktop Layout (1024px+)

```
+--------------------------------------------------------------------------+
| HEADER BAR                                                               |
| [🎮 BakaDM] [Campaign: The Fall of Thay ▼] [⚙️] [🔊 Sound On] [End Combat] |
+----------+------------------------------+--------------------------------+
|          |                              |                                |
|  LEFT    |        CENTER (MAP)          |         RIGHT                  |
|  SIDEBAR |                              |         SIDEBAR                |
|          |      +------------------+    |                                |
| MAP SCENE|      |                  |    |      ADVENTURE LOG             |
| [AI][Ref]|      |   INTERACTIVE    |    |      +--------------------+   |
|          |      |   GRID MAP       |    |      | 📜 Narrative       |   |
| Describe |      |                  |    |      |                     |   |
| [______] |      |  □ Player1      |    |      | "The party reaches  |   |
| [Set]    |      |  ● Enemy1       |    |      |  a critical        |   |
|          |      |  □ Player2      |    |      |  juncture..."      |   |
| Terrain  |      |  □ Player3      |    |      |                     |   |
| [Forest] |      |                  |    |      | 🧙 DM:              |   |
| [Tavern] |      |  [Edit Terrain]  |    |      | "There is an        |   |
| [Dungeon]|      |                  |    |      |  assassin that..." |   |
|          |      +------------------+    |      |                     |   |
| CAMPAIGN |                              |      | ⚠️ System:         |   |
| LORE     |                              |      | Initiative: 18      |   |
| Transcr. |                              |      |                     |   |
| (704)    |                              |      | ...                 |   |
| [Ask AI] |                              |      |                     |   |
|          |                              |      | [Ask about...] [Ask]|   |
| "towering|                              |      +--------------------+   |
| shelves..|                              |                                |
|          |                              |                                |
| D&D REF  |                              |                                |
| # Market |                              |                                |
| Square.. |                              |                                |
| [Ask]    |                              |                                |
|          |                              |                                |
+----------+------------------------------+--------------------------------+
| BOTTOM PANEL                                                             |
| COMBAT Round 1                                              's Turn      |
| [●Player1 18] [Player2 15] [Enemy1 12] [Player3 10]                    |
|                                                                          |
| MONSTERS:                                                                |
| ● assassin          [==========] 10/10 HP                    [X]        |
|                                                                          |
| [Describe to the Dungeon Master...]                           [Send]     |
+--------------------------------------------------------------------------+
```

---

## Layout Specifications

### Grid System

```
Desktop (1024px - 1440px):
+--------------------------------------------------+
| Left Sidebar | Center (flex) | Right Sidebar     |
|   280px      |   1fr         |   320px           |
+--------------------------------------------------+

Wide Desktop (>1440px):
+--------------------------------------------------+
| Left Sidebar | Center (flex) | Right Sidebar     |
|   320px      |   1fr         |   360px           |
+--------------------------------------------------+
```

### Panel Behavior

| Panel | Collapsible | Default | Mobile Behavior |
|-------|-------------|---------|-----------------|
| Left Sidebar | Yes | Open | Bottom sheet |
| Right Sidebar | Yes | Open | Bottom sheet |
| Bottom Panel | Yes (combat only) | Open | Fixed bottom |
| Header | No | Fixed | Fixed |

---

## Header Bar

```
+--------------------------------------------------------------------------+
| [🎮] BakaDM    Campaign: The Fall of Thay [v]    [⚙️] [🔊] [End Combat] |
+--------------------------------------------------------------------------+
```

**Elements:**
- **Logo**: BakaDM icon + text (click to return to lobby)
- **Campaign Selector**: Dropdown to switch campaigns (if multiple active)
- **Settings**: Gear icon → settings modal
- **Sound Toggle**: Speaker icon (on/off, volume slider on hover)
- **End Combat**: Red button, only visible during combat

**Height:** 48px
**Background:** `--color-bg-elevated` with bottom border
**Z-index:** `--z-sticky` (200)

---

## Left Sidebar

### Map Scene Panel

```
+----------+
| MAP SCENE|
| [AI][Ref]|
|          |
| Describe |
| [______] |
| [Set]    |
|          |
| Terrain  |
| +--+--+  |
| |Fo|Ta|  |
| |Du|Ca|  |
| +--+--+  |
+----------+
```

**Tabs:**
- **AI**: AI-generated scene descriptions
- **Terrain**: Manual terrain selection

**Terrain Grid:**
- 4 columns of buttons
- Each button: Icon + label
- Selected: Primary border, subtle glow
- Hover: Elevated background

### Campaign Lore Panel

```
+----------+
| CAMPAIGN |
| LORE     |
|          |
| [◇] The |
| Fall of..|
| [X]      |
|          |
| [Transcr]|
| (704)    |
| [ASK AI] |
| [CAST(13)|
|          |
| "towering|
| shelves..|
|          |
| [Ask...] |
| [Ask]    |
+----------+
```

**Tabs:**
- **Transcript**: Campaign narrative history
- **Cast**: Player characters and NPCs

**Transcript:**
- Scrollable text area
- Cream background for player entries
- Dark brown for DM entries
- Input at bottom for AI queries

### D&D Reference Panel

```
+----------+
| D&D REF  |
| [AI] [Clr]|
|          |
| # Market |
| Square   |
| Encount..|
| **common |  
| thugs**  |
|          |
| [Ask...] |
| [Ask]    |
+----------+
```

**Content:**
- Markdown-formatted reference text
- "Clear" button to reset
- AI query input for dynamic lookups

---

## Center: Game Map

```
+------------------+
| Marketplace    [E]|
|                  |
|  +--+--+--+--+  |
|  |  |  |  |  |  |
|  +--+--+--+--+  |
|  |  |🌳|  |□|  |
|  +--+--+--+--+  |
|  |  |●|  |□|  |
|  +--+--+--+--+  |
|  |  |  |  |□|  |
|  +--+--+--+--+  |
|  |📦|  |  |  |  |
|  +--+--+--+--+  |
|                  |
|     [D20]        |
+------------------+
```

**Map Header:**
- Scene name (e.g., "Marketplace")
- "Edit Terrain" button (DM only)

**Grid:**
- Square grid overlay on terrain texture
- Grid lines: `rgba(255,255,255,0.15)`
- Cell size: 48px (desktop), 32px (mobile)

**Tokens:**
- Player: Square, blue border, class icon
- Enemy: Circle, red border, monster icon
- NPC: Circle, green/yellow border
- Object: Square, gray border

**Token Overlay:**
- HP bar (small, bottom of token)
- Name label (on hover)
- Condition icons (top-right corner)
- Selection glow (orange)

**Dice Button:**
- Large D20 icon, bottom center of map
- Click to roll (opens dice roller modal)
- Pulse animation when it's player's turn

---

## Right Sidebar: Adventure Log

```
+--------------------------------+
| ADVENTURE LOG                  |
|                                |
| +----------------------------+ |
| | Player: "I approach the    | |
| | merchant cautiously..."     | |
| +----------------------------+ |
|                                |
| +----------------------------+ |
| | 🧙 DM: "The merchant looks | |
| | you up and down..."         | |
| +----------------------------+ |
|                                |
| +----------------------------+ |
| | ⚠️ Initiative: Player1 18  | |
| | Player2 15, Enemy1 12       | |
| +----------------------------+ |
|                                |
| +----------------------------+ |
| | 💥 Player1 hits Enemy1    | |
| | for 14 damage!              | |
| +----------------------------+ |
|                                |
| ...                            |
|                                |
| • • • NPCs are responding... |
|                                |
| [Ask about...]        [Ask]   |
+--------------------------------+
```

**Entry Types:**
- **Player**: Cream background, player avatar, white text
- **DM**: Dark brown background, DM icon, cream text
- **System**: Blue background, info icon, light text
- **Roll**: Compact, dice icon, result highlighted

**States:**
- Streaming: Typing indicator (three dots)
- New entry: Subtle slide-in animation
- Scroll: Auto-scroll to bottom on new entries

---

## Bottom Panel: Combat

```
+--------------------------------------------------------------------------+
| COMBAT — Round 1                                              's Turn     |
|                                                                          |
| ◀  [●Player1] [Player2] [Enemy1] [Player3] [Enemy2]  ▶                  |
|       18          15        12       10        8                         |
|       ↑ Active                                                           |
|                                                                          |
| ------------------------------------------------------------------------ |
|                                                                          |
| MONSTERS                              ALLIES                             |
| ● assassin    [==========] 10/10 HP   □ Player1  [==========] 45/45 HP  |
| ● thug        [======>    ]  5/10 HP   □ Player2  [========>  ] 28/30 HP  |
| ● thug        [==========] 10/10 HP   □ Player3  [==>        ]  8/25 HP  |
|                                                                          |
| ------------------------------------------------------------------------ |
|                                                                          |
| [Describe to the Dungeon Master what you want to do...]       [Send]     |
+--------------------------------------------------------------------------+
```

**Combat States:**
- **Active**: Initiative bar visible, turn indicator active
- **Inactive**: Collapsed to just chat input
- **Transition**: Slide up/down animation

**Initiative Bar:**
- Horizontal scrollable
- Current turn: Large, centered, orange glow
- Up next: Medium, to the right
- Dead: Hidden or collapsed

**Monster/Ally List:**
- Two columns: Enemies (left), Allies (right)
- Token icon + name + HP bar + current/max HP
- Click to select token on map

**Chat Input:**
- Full-width text input
- Placeholder changes based on context:
  - Combat: "Describe your action..."
  - Exploration: "What do you do?"
  - DM speaking: "Ask the DM..."

---

## Tablet Layout (640px - 1024px)

```
+------------------------------------------+
| HEADER                                   |
+------------------------------------------+
|                                          |
|           CENTER (MAP)                   |
|                                          |
|  +------------------------------------+  |
|  |                                    |  |
|  |         FULL-WIDTH MAP             |  |
|  |                                    |  |
|  +------------------------------------+  |
|                                          |
| [Map Tools] [Adventure Log] [Combat]     |
| (Bottom tabs toggle sidebars)            |
+------------------------------------------+
```

**Behavior:**
- Sidebars hidden by default
- Bottom tabs toggle sidebar content as overlays
- Map takes full width
- Bottom panel still present during combat

---

## Mobile Layout (<640px)

```
+------------------+
| HEADER           |
+------------------+
|                  |
|   MAP (swipe)    |
|                  |
|  +--+--+--+--+  |
|  |  |  |  |  |  |
|  +--+--+--+--+  |
|                  |
+------------------+
| [Tools] [Log] [ ]|  <- Bottom nav
+------------------+
```

**Behavior:**
- Single column, map full width
- Bottom navigation: Tools, Log, Menu
- Sidebars become bottom sheets
- Combat tracker as collapsible bottom sheet
- Token selection: Tap to select, drag to move

---

## PiP (Picture-in-Picture) Mode

```
+------------------+
| Adventure Log    |
|                  |
| DM: "The orc     |
| charges at you!" |
|                  |
| [D20] [Roll]     |
+------------------+
```

**Behavior:**
- Minimal view: Narrative log + dice roller only
- No map, no sidebars
- Auto-activates when Discord Activity is minimized
- Still receives real-time updates

---

## Responsive Behavior Summary

| Feature | Desktop | Tablet | Mobile | PiP |
|---------|---------|--------|--------|-----|
| Left Sidebar | Fixed | Overlay | Bottom sheet | Hidden |
| Right Sidebar | Fixed | Overlay | Bottom sheet | Hidden |
| Bottom Panel | Fixed | Fixed | Collapsible | Hidden |
| Map Grid | Full center | Full width | Full width | Hidden |
| Initiative Bar | Horizontal | Horizontal | Vertical list | Hidden |
| Token Size | 48px | 40px | 32px | Hidden |
| Chat Input | Full width | Full width | Full width | Compact |

---

*Last updated: June 2026*
