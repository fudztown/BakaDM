# Campaign Lifecycle User Flow

> **Managing campaigns: Create, join, resume, archive, and delete.**

---

## Flow Overview

```
[Lobby/Dashboard] → [Create | Join | Resume | Manage]
    → [Active Session] → [End Session] → [Lobby]
```

---

## Lobby / Dashboard

**Entry Point:** Main screen when opening BakaDM Activity.

**Layout:**
```
+--------------------------------------------------+
|  🎮 BakaDM                              [⚙️] [👤] |
+--------------------------------------------------+
|                                                   |
|  Your Campaigns                          [+]      |
|  +------------------+ +------------------+       |
|  | [Cover Image]    | | [Cover Image]    |       |
|  | The Fall of...   | | Curse of Strahd  |       |
|  | Last: 2 days ago | | Last: 1 week ago |       |
|  | 4 players ●     | | 3 players ○     |       |
|  | [Resume]         | | [Resume]         |       |
|  +------------------+ +------------------+       |
|                                                   |
|  +------------------+                            |
|  |    [+]           |                            |
|  |  New Campaign    |                            |
|  +------------------+                            |
|                                                   |
|  Joined Campaigns                                 |
|  +------------------+ +------------------+       |
|  | [Cover Image]    | | [Cover Image]    |       |
|  | Waterdeep...     | | Tomb of...       |       |
|  | DM: @user        | | DM: @user        |       |
|  | [Enter Lobby]    | | [Enter Lobby]    |       |
|  +------------------+ +------------------+       |
|                                                   |
|  Archived                    [View All →]        |
|  +------------------+                            |
|  | The Lost Mine... |                            |
|  | [Restore]        |                            |
|  +------------------+                            |
+--------------------------------------------------+
```

**Sections:**
1. **Your Campaigns** (as DM): Cards with resume, edit, share
2. **Joined Campaigns** (as player): Cards with enter lobby
3. **Archived**: Collapsed, expandable

**Empty State (First Visit):**
```
+--------------------------------------------------+
|  [Illustration: Dragon and dice]                  |
|                                                   |
|  No campaigns yet!                                |
|  Start your first adventure as DM or join one.    |
|                                                   |
|  [Create Campaign]  [Join with Code]              |
+--------------------------------------------------+
```

---

## Create Campaign

**Trigger:** Click "+" or "New Campaign" in lobby.

**Step 1: Basic Info**
```
+--------------------------------------------------+
|  Create New Campaign                    1/3       |
|                                                   |
|  Campaign Name *                                  |
|  [________________________]                       |
|  ❌ Name is required                              |
|                                                   |
|  Description                                      |
|  [________________________]                       |
|  Brief description for players                    |
|                                                   |
|  Cover Image (optional)                           |
|  [Upload or choose from gallery]                  |
|                                                   |
|              [Next: Settings →]                   |
+--------------------------------------------------+
```

**Step 2: Settings**
```
+--------------------------------------------------+
|  Create New Campaign                    2/3       |
|                                                   |
|  Game System                                      |
|  [●] D&D 5e  [○] Pathfinder  [○] Custom        |
|                                                   |
|  Max Players                                      |
|  [-]  4  [+]                                      |
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

**Step 3: Confirm**
```
+--------------------------------------------------+
|  Create New Campaign                    3/3       |
|                                                   |
|  Review Your Campaign                             |
|  +------------------------------------------+    |
|  | Name: The Fall of Thay                     |    |
|  | Players: Up to 4                           |    |
|  | Visibility: Private                        |    |
|  | Voice: Male Deep                           |    |
|  +------------------------------------------+    |
|                                                   |
|  [Back]              [Create Campaign]            |
+--------------------------------------------------+
```

**Post-Creation:**
- Campaign lobby opens
- "Invite Players" modal auto-prompts
- Campaign code generated (e.g., `BAKA-X7K9`)

---

## Campaign Lobby

**Layout:**
```
+--------------------------------------------------+
|  ← Back to Dashboard                               |
|                                                   |
|  [Cover Image: Full Width]                        |
|  The Fall of Thay                    [Edit] [⋮]  |
|  A dark fantasy campaign in Thay                  |
|                                                   |
|  +------------------+ +------------------+       |
|  | Players          | | Session Status   |       |
|  | @user1 (DM) 👑   | | ○ Inactive       |       |
|  | @user2 🧝       | | [Start Session]  |       |
|  | @user3 🧙       | |                  |       |
|  | [Invite +]       | | Last: 2 days ago |       |
|  +------------------+ +------------------+       |
|                                                   |
|  +------------------------------------------+    |
|  | Session History                          |    |
|  | Session 3 - The Marketplace (2 days ago) |    |
|  | Session 2 - The Journey (1 week ago)     |    |
|  | Session 1 - The Tavern (2 weeks ago)     |    |
|  +------------------------------------------+    |
|                                                   |
|  +------------------------------------------+    |
|  | Campaign Lore                            |    |
|  | 12 entries                               |    |
|  | [View/Edit Lore]                         |    |
|  +------------------------------------------+    |
+--------------------------------------------------+
```

**States:**
- **Inactive**: "Start Session" button available
- **Active**: "Join Session" button, "Session in progress" badge
- **Full**: "Player limit reached", invite disabled

---

## Join Campaign

**Trigger:** User clicks invite link or "Join with Code".

**Via Invite Link:**
```
+--------------------------------------------------+
|  Join Campaign                                    |
|                                                   |
|  [Cover Image]                                    |
|  "The Fall of Thay"                               |
|  Hosted by @username                              |
|  3/4 players                                      |
|                                                   |
|  [Join as Player]  [Spectate]                     |
+--------------------------------------------------+
```

**Via Code:**
```
+--------------------------------------------------+
|  Join with Code                                   |
|                                                   |
|  Enter Campaign Code                              |
|  [____-____]  (e.g., BAKA-X7K9)                   |
|                                                   |
|  [Join]                                           |
+--------------------------------------------------+
```

**Post-Join:**
- If no character: Prompt to create/select character
- If character exists: Enter campaign lobby

---

## Session Management

### Start Session

**Trigger:** DM clicks "Start Session" in lobby.

**Flow:**
```
DM clicks "Start Session"
    → "Preparing session..." (load campaign state)
    → "Waiting for players..." (lobby visible to all)
    → Players click "Join Session"
    → DM clicks "Begin Adventure"
    → Game UI loads with opening scene
```

### End Session

**Trigger:** DM clicks "End Session" or all players leave.

**Flow:**
```
DM clicks "End Session"
    → "Save session state?" (auto-save + manual)
    → Session summary generated:
        - Duration
        - Key events
        - XP earned
        - New lore entries
    → Return to campaign lobby
```

---

## Archive / Delete

**Archive Campaign:**
- Moves to "Archived" section
- Preserves all data
- Can be restored
- Does not count toward active campaign limit

**Delete Campaign:**
- Confirmation modal: "This cannot be undone."
- Type campaign name to confirm
- All data permanently deleted

---

## Error States

| Scenario | Message | Action |
|----------|---------|--------|
| Campaign name taken | "A campaign with this name exists." | Suggest alternative |
| Invite code invalid | "Campaign not found. Check your code." | Retry |
| Player limit reached | "This campaign is full (4/4)." | Spectate or request join |
| DM already active | "You are already DMing another session." | End other session |
| Save failed | "Failed to save session. Retry?" | Retry / Continue anyway |

---

*Last updated: June 2026*
