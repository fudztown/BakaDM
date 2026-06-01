# Lobby / Dashboard Wireframe

> **Campaign selection, creation, and management hub.**
> This is the first screen users see when opening BakaDM Activity.

---

## Desktop Layout

```
+--------------------------------------------------------------------------+
| HEADER                                                                   |
| [🎮 BakaDM]                              [⚙️ Settings] [👤 Account]       |
+--------------------------------------------------------------------------+
|                                                                          |
|  YOUR CAMPAIGNS                                    [+ New Campaign]      |
|  +------------------+ +------------------+ +------------------+         |
|  | [Cover Image]    | | [Cover Image]    | |    [+]           |         |
|  |                  | |                  | |                  |         |
|  | The Fall of Thay | | Curse of Strahd  | |  New Campaign    |         |
|  | ● Active         | | ○ 3 days ago   | |                  |         |
|  | 4 players        | | 3 players        | |                  |         |
|  |                  | |                  | |                  |         |
|  | [Resume Session] | | [Resume]         | |                  |         |
|  +------------------+ +------------------+ +------------------+         |
|                                                                          |
|  JOINED CAMPAIGNS                                                        |
|  +------------------+ +------------------+                              |
|  | [Cover Image]    | | [Cover Image]    |                              |
|  | Waterdeep: DH    | | Tomb of Annihil. |                              |
|  | DM: @username    | | DM: @username    |                              |
|  | 5 players ●     | | 4 players ○      |                              |
|  | [Enter Lobby]    | | [Enter Lobby]    |                              |
|  +------------------+ +------------------+                              |
|                                                                          |
|  QUICK ACTIONS                                                           |
|  +------------------+ +------------------+ +------------------+         |
|  | 🎮 Join with    | | 📚 Browse Public | | ❓ Help & Tutorial |         |
|  |    Code          | |    Campaigns      | |                  |         |
|  +------------------+ +------------------+ +------------------+         |
|                                                                          |
|  ARCHIVED                    [View All →]                               |
|  +------------------+                                                   |
|  | The Lost Mine... |                                                   |
|  | [Restore]        |                                                   |
|  +------------------+                                                   |
|                                                                          |
|  +----------------------------------------------------------+           |
|  | ⭐ Hero Trial: 5 days remaining                           |           |
|  | Upgrade anytime to keep unlimited access. [Upgrade Now]   |           |
|  +----------------------------------------------------------+           |
|                                                                          |
+--------------------------------------------------------------------------+
```

---

## Campaign Card States

### Active Campaign

```
+------------------+
| [Cover Image]    |
|                  |
| The Fall of Thay |
| ● Active Session |
| 4 players        |
|                  |
| [Resume Session] |
+------------------+
```

**States:**
- Default: Cover image, title, status, player count
- Hover: Slight lift (`shadow-md`), action buttons visible
- Active: Green dot indicator, "Resume Session" primary button
- Full: "Player limit reached" warning

### Inactive Campaign

```
+------------------+
| [Cover Image]    |
|                  |
| Curse of Strahd  |
| ○ 3 days ago    |
| 3 players        |
|                  |
| [Resume] [v]     |
+------------------+
```

**Actions Dropdown:**
- Resume
- Edit Campaign
- Invite Players
- Archive
- Delete

### New Campaign Placeholder

```
+------------------+
|                  |
|       [+]        |
|                  |
|  New Campaign    |
|                  |
|                  |
+------------------+
```

**Visual:**
- Dashed border (`--color-border`)
- Centered plus icon
- Hover: Solid border, primary color

---

## Empty State (First Visit)

```
+--------------------------------------------------------------------------+
|                                                                          |
|                                                                          |
|                    [Illustration: Dragon & Dice]                         |
|                                                                          |
|                    No campaigns yet!                                     |
|                    Start your first adventure.                           |
|                                                                          |
|              [Create Campaign]        [Join with Code]                   |
|                                                                          |
|                                                                          |
+--------------------------------------------------------------------------+
```

**Illustration:**
- Fantasy-themed illustration (dragon, dice, scroll)
- Subtle animation: Floating dice, breathing dragon
- `prefers-reduced-motion`: Static image

---

## Join with Code Modal

```
+--------------------------------------------------+
|  Join Campaign                          [X]        |
|                                                   |
|  Enter Campaign Code                              |
|  +----------+ +----------+ +----------+          |
|  |    B     | |    A     | |    K     |          |
|  +----------+ +----------+ +----------+          |
|  +----------+ +----------+ +----------+          |
|  |    A     | |    X     | |    7     |          |
|  +----------+ +----------+ +----------+          |
|                                                   |
|  [Cancel]              [Join Campaign]            |
+--------------------------------------------------+
```

**Input:**
- 6-character alphanumeric code
- Auto-focus next field on input
- Paste support: auto-distributes characters
- Error: "Invalid code" in red below

---

## Create Campaign Modal

### Step 1: Basic Info

```
+--------------------------------------------------+
|  Create Campaign                        [X]        |
|  Step 1 of 3                                      |
|                                                   |
|  Campaign Name *                                  |
|  [________________________]                       |
|                                                   |
|  Description                                      |
|  [________________________]                       |
|  Brief description for players                    |
|                                                   |
|  Cover Image                                      |
|  [Upload Image] or [Choose from Gallery]          |
|                                                   |
|              [Next: Settings →]                   |
+--------------------------------------------------+
```

### Step 2: Settings

```
+--------------------------------------------------+
|  Create Campaign                        [X]        |
|  Step 2 of 3                                      |
|                                                   |
|  Game System                                      |
|  [●] D&D 5e  [○] Pathfinder  [○] Custom        |
|                                                   |
|  Max Players                                      |
|  [-]  4  [+]        (Free tier: max 3)            |
|                                                   |
|  Visibility                                       |
|  [●] Private (invite only)                       |
|  [○] Public (Discord server members)             |
|                                                   |
|  AI DM Voice                                      |
|  [▼] Male Deep (British)                         |
|                                                   |
|  [Back]              [Next: Confirm →]            |
+--------------------------------------------------+
```

### Step 3: Confirm

```
+--------------------------------------------------+
|  Create Campaign                        [X]        |
|  Step 3 of 3                                      |
|                                                   |
|  Review Your Campaign                             |
|  +------------------------------------------+    |
|  | Name: The Fall of Thay                     |    |
|  | System: D&D 5e                             |    |
|  | Players: Up to 4                           |    |
|  | Visibility: Private                        |    |
|  | Voice: Male Deep (British)                 |    |
|  +------------------------------------------+    |
|                                                   |
|  [Back]              [Create Campaign]            |
+--------------------------------------------------+
```

---

## Campaign Lobby

```
+--------------------------------------------------------------------------+
| [← Back]                                                                |
|                                                                          |
|  [Cover Image - Full Width]                                              |
|                                                                          |
|  The Fall of Thay                                    [Edit] [⋮]          |
|  A dark fantasy campaign in the land of Thay                             |
|                                                                          |
|  +------------------------+ +------------------------+                  |
|  | PLAYERS                | | SESSION STATUS         |                  |
|  |                        | |                        |                  |
|  | 👑 @user1 (DM)        | | ○ Inactive            |                  |
|  | 🧝 @user2             | |                        |                  |
|  | 🧙 @user3             | | [Start Session]        |                  |
|  | 🧔 @user4             | |                        |                  |
|  | [+ Invite Player]      | | Last played: 2 days ago|                  |
|  +------------------------+ +------------------------+                  |
|                                                                          |
|  +----------------------------------------------------------+           |
|  | SESSION HISTORY                                          |           |
|  | Session 3 - The Marketplace Assault    2 days ago   [>]  |           |
|  | Session 2 - The Journey Begins         1 week ago   [>]  |           |
|  | Session 1 - The Tavern Encounter       2 weeks ago  [>]  |           |
|  +----------------------------------------------------------+           |
|                                                                          |
|  +----------------------------------------------------------+           |
|  | CAMPAIGN LORE                           [View/Edit Lore] |           |
|  | 12 entries | 3 NPCs | 5 locations                       |           |
|  +----------------------------------------------------------+           |
|                                                                          |
+--------------------------------------------------------------------------+
```

---

## Mobile Layout

```
+------------------+
| HEADER           |
+------------------+
|                  |
| YOUR CAMPAIGNS   |
| +--------------+ |
| | [Cover]      | |
| | The Fall...  | |
| | ● Active     | |
| | [Resume]     | |
| +--------------+ |
| +--------------+ |
| | [Cover]      | |
| | Curse of...  | |
| | [Resume]     | |
| +--------------+ |
|                  |
| [+ New Campaign] |
|                  |
| JOINED           |
| +--------------+ |
| | Waterdeep... | |
| | [Enter]      | |
| +--------------+ |
|                  |
| [Join with Code] |
| [Help & Tutorial]|
+------------------+
```

---

*Last updated: June 2026*
