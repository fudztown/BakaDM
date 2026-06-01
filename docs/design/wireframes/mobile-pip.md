# Mobile & PiP Mode Wireframe

> **Responsive layouts for Discord mobile and Picture-in-Picture mode.**

---

## Mobile Layout (<640px)

### Main Game Screen

```
+------------------+
| HEADER           |
| BakaDM    [Menu] |
+------------------+
|                  |
|   MAP (swipe)    |
|                  |
|  +--+--+--+--+  |
|  |  |  |  |  |  |
|  +--+--+--+--+  |
|  |  |🌳|  |□|  |
|  +--+--+--+--+  |
|  |  |●|  |□|  |
|  +--+--+--+--+  |
|                  |
|     [D20]        |
|                  |
+------------------+
| [Tools] [Log] [ ]|  <- Bottom nav
+------------------+
```

**Bottom Navigation:**
- **Tools**: Opens left sidebar as bottom sheet
- **Log**: Opens right sidebar as bottom sheet
- **Menu**: Opens settings/combat/actions menu

### Tools Bottom Sheet

```
+------------------+
| ──────────────── |
|     (drag bar)    |
+------------------+
| MAP SCENE         |
| [AI] [Terrain]    |
|                   |
| Describe          |
| [____________]    |
| [Set]             |
|                   |
| Terrain           |
| [Fo][Ta][Du][Ca] |
| [To][Ho][St][Un] |
|                   |
| CAMPAIGN LORE     |
| Transcript (704)  |
| [Ask AI]          |
|                   |
| "towering..."     |
|                   |
| [Ask...] [Ask]    |
+------------------+
```

**Sheet Behavior:**
- Default: 25% height (peek)
- Drag up: 50% height
- Drag up again: 85% height
- Swipe down: Collapse or dismiss
- Back button: Dismiss sheet

### Adventure Log Bottom Sheet

```
+------------------+
| ──────────────── |
|     (drag bar)    |
+------------------+
| ADVENTURE LOG     |
|                   |
| "The party..."    |
|                   |
| DM: "There is..." |
|                   |
| ⚠️ Initiative... |
|                   |
| ...               |
|                   |
| ••• Responding   |
|                   |
| [Ask...] [Ask]    |
+------------------+
```

### Combat Mobile Layout

```
+------------------+
| HEADER           |
| COMBAT Round 3   |
+------------------+
|                  |
|   MAP (swipe)    |
|                  |
|  +--+--+--+--+  |
|  |  |  |  |  |  |
|  +--+--+--+--+  |
|                  |
+------------------+
| ACTIONS          |
| [Move][Attack][.]|
+------------------+
| INITIATIVE       |
| [●P1][P2][●E1]  |
|   ↑ Active      |
+------------------+
| COMBATANTS       |
| ● Enemy1 8/15   |
| □ Player1 33/45 |
| (scrollable)     |
+------------------+
| [Action...] [Send]|
+------------------+
```

**Combat Bottom Sheet (Actions):**
```
+------------------+
| ──────────────── |
|     (drag bar)    |
+------------------+
| YOUR TURN!        |
| Player1's turn    |
|                   |
| MOVE              |
| [Move on map]     |
|                   |
| ACTION            |
| [Attack] [Cast]   |
| [Item] [Dodge]    |
| [Dash] [Help]     |
| [Hide] [Ready]    |
|                   |
| BONUS ACTION      |
| [Second Wind]     |
| [Off-hand Attack] |
|                   |
| [End Turn]        |
+------------------+
```

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
| (Bottom tabs toggle overlays)            |
+------------------------------------------+
```

**Tab Behavior:**
- Tap tab: Open corresponding sidebar as overlay (50% width from edge)
- Tap again: Close overlay
- Map remains visible behind overlay
- Overlay has close button (X)

---

## PiP (Picture-in-Picture) Mode

### Minimal View

```
+------------------+
| Adventure Log    |
|                  |
| DM: "The orc     |
| charges at you!" |
|                  |
| Player1: "I      |
| draw my sword."  |
|                  |
| ⚠️ Your turn!    |
|                  |
| [D20] [Roll]     |
+------------------+
```

**Dimensions:**
- Minimum: 320px x 240px
- Default: 400px x 300px
- Aspect ratio: 4:3 (maintained on resize)

**Content:**
- Narrative log (scrollable)
- Dice roller button
- Turn notification
- No map, no sidebars, no combat tracker

### PiP States

```
+------------------+
| ● Active Session |
| The Fall of Thay |
+------------------+
|                  |
| DM: "What do     |
| you do?"         |
|                  |
| [Speak] [Text]   |
+------------------+
```

**Controls:**
- **Speak**: Push-to-talk microphone button
- **Text**: Quick text input
- **Expand**: Return to full Activity view
- **Close**: End session or return to Discord

### PiP Combat Notification

```
+------------------+
| ⚠️ COMBAT!        |
| Your turn!         |
|                    |
| [View Map] [Roll]  |
+------------------+
```

**Auto-expand triggers:**
- Player's turn in combat
- Death saving throw required
- Concentration check required
- Opportunity attack prompt

---

## Responsive Breakpoints

| Feature | Desktop | Tablet | Mobile | PiP |
|---------|---------|--------|--------|-----|
| Left Sidebar | Fixed 280px | Overlay | Bottom sheet | Hidden |
| Right Sidebar | Fixed 320px | Overlay | Bottom sheet | Hidden |
| Bottom Panel | Fixed | Fixed | Collapsible | Hidden |
| Map | Center flex | Full width | Full width | Hidden |
| Initiative | Horizontal | Horizontal | Vertical list | Hidden |
| Token Size | 48px | 40px | 32px | Hidden |
| Chat Input | Full width | Full width | Full width | Compact |
| Dice Button | Bottom center | Bottom center | Floating | Inline |

---

## Touch Interactions

### Map Gestures
- **Tap**: Select token
- **Double-tap**: Open token details
- **Long press**: Context menu (move, attack, info)
- **Drag**: Move token (in move mode)
- **Pinch**: Zoom in/out
- **Two-finger pan**: Scroll map

### Token Gestures
- **Tap**: Select
- **Drag**: Move (if player's turn)
- **Swipe left**: Quick attack (selects nearest enemy)
- **Swipe right**: Quick heal (selects self)

### Bottom Sheet Gestures
- **Swipe up**: Expand sheet
- **Swipe down**: Collapse/dismiss
- **Tap handle**: Toggle between peek and expanded

---

*Last updated: June 2026*
