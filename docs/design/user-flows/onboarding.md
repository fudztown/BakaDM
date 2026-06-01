# Onboarding User Flow

> **New user journey: Discovery → Signup → First Campaign → First Session**

---

## Flow Overview

```
[Discover BakaDM] → [Discord Auth] → [Welcome Modal] → [Tutorial Prompt]
    → [Create Character] → [Create/Join Campaign] → [Launch First Session]
```

---

## Step 1: Discovery

**Trigger:** User sees BakaDM in Discord App Directory, invite link, or server invite.

**Screens:**
- Discord App Directory listing (icon, description, screenshots)
- Server invite with "Add BakaDM to Server" button

**Key Copy:**
- Headline: "Your AI Dungeon Master Awaits"
- Subhead: "Voice-powered D&D inside Discord. No downloads. No setup. Just adventure."
- CTA: "Add to Server" or "Try Demo"

---

## Step 2: Discord OAuth Authorization

**Trigger:** User clicks "Add to Server" or launches Activity.

**Flow:**
```
User clicks "Add to Server"
    → Discord OAuth consent screen
    → Grant permissions: bot, applications.commands, voice
    → Select server (if not already in one)
    → Redirect back to BakaDM
```

**Permissions Requested:**
- `bot` — Respond to messages, join voice channels
- `applications.commands` — Register slash commands
- `voice` — Connect and speak in voice channels

**Design Notes:**
- Show permission explanation with friendly icons
- Reassure user: "BakaDM only accesses voice channels you invite it to"

---

## Step 3: Welcome Modal

**Trigger:** First time user opens BakaDM Activity.

**Screen Layout:**
```
+--------------------------------------------------+
|  🎮  Welcome to BakaDM!                          |
|                                                   |
|  [Animated dice illustration]                     |
|                                                   |
|  "Speak naturally to your AI Dungeon Master.      |
|   See maps, roll dice, and track combat —        |
|   all inside Discord."                            |
|                                                   |
|  [Start Tutorial]    [Skip for Now]               |
+--------------------------------------------------+
```

**States:**
- First visit: Show full welcome modal
- Returning (no campaigns): "Ready to start your first campaign?"
- Returning (has campaigns): Skip to lobby

---

## Step 4: Interactive Tutorial ("The Tutorial Tavern")

**Trigger:** User clicks "Start Tutorial".

**Flow:**
```
1. Introduction
   "Welcome, adventurer! I'm your AI Dungeon Master.
    Let's learn the basics in a quick scenario."

2. Text Interaction
   User types: "I look around the tavern"
   DM responds with narrative + "💬 Try speaking next!"

3. Voice Introduction
   "You can also speak to me! Click the microphone
    icon and say something."
   [User speaks] → STT transcription shown → DM responds via TTS

4. Dice Rolling
   "Let's roll for initiative! Click the D20."
   [Animated roll] → Result shown → "Great roll!"

5. Map Introduction
   "This is your battle map. Your token is the blue square.
    Click and drag to move."
   [Guided token movement]

6. Combat Basics
   "An enemy appears! This is combat mode.
    You'll see turn order at the bottom."
   [Show initiative bar, HP bars]

7. Completion
   "You're ready! Create your first real campaign?"
   [Create Campaign] [Play Tutorial Again]
```

**Design Notes:**
- Each step has a highlighted UI element with tooltip arrow
- User can exit tutorial at any time
- Tutorial state saved (can resume later)
- Estimated duration: 3-5 minutes

---

## Step 5: Character Creation

**Trigger:** User starts first campaign or clicks "Create Character".

**Flow:**
```
[Choose Race] → [Choose Class] → [Ability Scores] → [Background]
    → [Equipment] → [Name & Appearance] → [Review]
```

**Screen: Race Selection**
```
+--------------------------------------------------+
|  Create Your Character                    1/6    |
|                                                   |
|  Choose Your Race                                 |
|  +----------+ +----------+ +----------+          |
|  | 🧝 Human | | 🧙 Elf   | | 🧔 Dwarf |          |
|  | Versatile| | Graceful | | Hardy    |          |
|  +----------+ +----------+ +----------+          |
|  +----------+ +----------+ +----------+          |
|  | 🍭 Halfling| | 🐉 Dragonborn| | 👺 Half-Orc| |
|  +----------+ +----------+ +----------+          |
|                                                   |
|  [Back]              [Next: Class →]              |
+--------------------------------------------------+
```

**Design Notes:**
- Each step shows progress indicator (e.g., "1/6")
- Race/class cards show icon, name, and one-line description
- Ability scores: Offer "Point Buy", "Standard Array", or "Roll" options
- Name step: Generate random fantasy name button
- Review: Collapsible summary of all choices

---

## Step 6: Campaign Creation

**Trigger:** User clicks "Create Campaign" after tutorial or from lobby.

**Screen:**
```
+--------------------------------------------------+
|  Start Your Adventure                             |
|                                                   |
|  Campaign Name *                                  |
|  [________________________]                       |
|                                                   |
|  Description (optional)                           |
|  [________________________]                       |
|                                                   |
|  Choose a Setting                                 |
|  [●] The Forgotten Realms  [○] Homebrew        |
|  [○] Critical Role      [○] Eberron           |
|                                                   |
|  [Advanced Options ▼]                            |
|                                                   |
|  [Cancel]              [Create Campaign]          |
+--------------------------------------------------+
```

**Post-Creation:**
- Campaign lobby opens
- "Invite Players" button prominent
- "Start Session" button (disabled until 1+ player joins)

---

## Step 7: First Session Launch

**Trigger:** User clicks "Start Session" in campaign lobby.

**Flow:**
```
User clicks "Start Session"
    → "Launching Game UI..." loading screen
    → Discord Activity iframe opens
    → Game UI loads with:
        - Map (default tavern scene)
        - Party tokens placed
        - Narrative log: "Your adventure begins..."
        - Bottom panel: "Waiting for DM..."
    → AI DM generates opening scene
    → "What do you do?" prompt appears
```

---

## Alternative Flow: Join Existing Campaign

**Trigger:** User receives campaign invite link.

```
User clicks invite link
    → Discord opens BakaDM
    → "Join 'The Fall of Thazi...'?"
    → [Join as Player] [Join as Spectator]
    → If player: Create/select character
    → Enter campaign lobby
    → Wait for DM to start session
```

---

## Error States

| Scenario | Message | Action |
|----------|---------|--------|
| OAuth denied | "BakaDM needs permission to join voice channels." | Retry button |
| Server full | "This server has reached the player limit." | Upgrade prompt |
| Voice unsupported | "Voice features require Discord desktop app." | Text-only mode |
| Tutorial timeout | "Still there? Continue your tutorial?" | Resume/Restart |

---

## Success Metrics

- Tutorial completion rate: Target >70%
- Campaign creation rate (post-tutorial): Target >80%
- First session start rate: Target >60%
- Time to first session: Target <10 minutes

---

*Last updated: June 2026*
