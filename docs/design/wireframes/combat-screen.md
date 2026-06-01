# Combat Screen Wireframe

> **Detailed combat interface: initiative tracker, turn management, HP/conditions, and action selection.**

---

## Desktop Combat Layout

```
+--------------------------------------------------------------------------+
| HEADER                                                                   |
| [🎮 BakaDM] [The Fall of Thay]        COMBAT — Round 3    [End Combat] |
+--------------------------------------------------------------------------+
|                                                                          |
|  LEFT SIDEBAR  |        MAP              | RIGHT SIDEBAR                |
|                |                         |                              |
|  COMBAT LOG    |  [Grid with tokens]     |  ADVENTURE LOG               |
|  +----------+  |                         |  +--------------------+      |
|  | Round 3  |  |  □ Player1 (active)    |  | DM: "The assassin  |      |
|  | Turn 2   |  |  ● Enemy1              |  | lunges at Player1! |      |
|  |          |  |  □ Player2              |  |                    |      |
|  | Player1  |  |  ● Enemy2              |  | ⚠️ Attack of Opp.  |      |
|  | hit for  |  |  □ Player3              |  | Enemy1: 18 vs AC   |      |
|  | 14 dmg   |  |                         |  | 16 → HIT!          |      |
|  |          |  |  [Movement: 15ft rem.]  |  | Damage: 12         |      |
|  | Enemy1   |  |                         |  | Player1: 33/45 HP  |      |
|  | attacked |  |  [D20]                  |  |                    |      |
|  | Player1  |  |                         |  | Player1's turn!    |      |
|  | for 12   |  |                         |  |                    |      |
|  +----------+  |                         |  +--------------------+      |
|                |                         |                              |
+--------------------------------------------------------------------------+
| BOTTOM PANEL — COMBAT                                                    |
|                                                                          |
| INITIATIVE BAR                                                           |
| ◀ [●Player1 ★] [Player2] [●Enemy1] [Player3] [●Enemy2] ▶           |
|       ACTIVE                                                             |
|                                                                          |
| ------------------------------------------------------------------------ |
|                                                                          |
| PLAYER ACTIONS (Player1's Turn)                                          |
| [Move] [Attack] [Cast Spell] [Use Item] [Dodge] [Dash] [Help] [Hide]    |
|                                                                          |
| SELECTED ACTION: ATTACK                                                  |
| Target: [▼ Enemy1]  Weapon: [▼ Longsword]  Modifier: +6                |
| [Roll Attack]                                                            |
|                                                                          |
| ------------------------------------------------------------------------ |
|                                                                          |
| COMBATANTS                                                               |
| ENEMIES                          ALLIES                                  |
| ● Assassin    [========> ]  8/15 HP    □ Player1  [========> ] 33/45 HP |
|   🔴 Poisoned                     ★ Active Turn                        |
| ● Thug        [==========] 10/10 HP    □ Player2  [==========] 30/30 HP |
| ● Thug        [=====>    ]  5/10 HP    □ Player3  [==>       ]  8/25 HP |
|                                          🔴 Wounded                      |
|                                                                          |
| ------------------------------------------------------------------------ |
|                                                                          |
| [Describe your action to the DM...]                           [Send]     |
+--------------------------------------------------------------------------+
```

---

## Initiative Bar

```
+--------------------------------------------------------------------------+
| ◀  [●Player1 ★]  [Player2]  [●Enemy1]  [Player3]  [●Enemy2]  ▶  |
|        ↑ Active    Up next    Later      Later      Later               |
|        Large       Medium     Small      Small      Small               |
|        Glow        Normal     Dim        Dim        Dim                |
+--------------------------------------------------------------------------+
```

**Specifications:**
- **Active**: 64px token, orange glow shadow, star icon
- **Up next**: 48px token, normal opacity
- **Later**: 40px token, 60% opacity
- **Previous**: 40px token, 40% opacity, left of active
- **Dead**: Hidden or 20% opacity at far right

**Scroll Behavior:**
- Auto-scroll to keep active token centered
- Smooth animation when turn changes
- Click any token to select (not change turn)

---

## Action Buttons

```
+--------------------------------------------------------------------------+
| [Move] [Attack] [Cast Spell] [Use Item] [Dodge] [Dash] [Disengage] [Help]|
|                                                                          |
| Action      | Type    | Used? | Description                             |
|-------------|---------|-------|-----------------------------------------|
| Move        | Move    | —     | Move up to your speed                   |
| Attack      | Action  | ○     | Make a weapon attack                    |
| Cast Spell  | Action  | ○     | Cast a prepared spell                   |
| Use Item    | Action  | ○     | Use an item or potion                   |
| Dodge       | Action  | ○     | Enemies have disadvantage attacking you |
| Dash        | Action  | ○     | Double your movement this turn          |
| Disengage   | Action  | ○     | Avoid opportunity attacks               |
| Help        | Action  | ○     | Give ally advantage on next roll        |
| Hide        | Action  | ○     | Make a Stealth check                    |
| Ready       | Action  | ○     | Prepare an action for a trigger         |
+--------------------------------------------------------------------------+
```

**States:**
- Available: Primary background, clickable
- Used: Gray background, checkmark, disabled
- Not applicable: Hidden or disabled with tooltip
- Hover: Elevated, tooltip with description

---

## Attack Resolution Flow

### Step 1: Select Target

```
+--------------------------------------------------+
|  ATTACK                                          |
|                                                   |
|  Click a target on the map:                       |
|                                                   |
|  ● Enemy1 (Assassin)        AC 15                |
|  ● Enemy2 (Thug)            AC 12                |
|  ● Enemy3 (Thug)            AC 12                |
|                                                   |
|  [Cancel]                                         |
+--------------------------------------------------+
```

**Map Feedback:**
- Hover over enemy: Red highlight, AC tooltip
- Click enemy: Selection glow, attack panel updates

### Step 2: Roll Attack

```
+--------------------------------------------------+
|  ATTACK — Enemy1 (Assassin)                      |
|                                                   |
|  Weapon: Longsword (+6 to hit)                    |
|  Damage: 1d8 + 4 slashing                         |
|                                                   |
|  [Roll Attack]                                    |
|                                                   |
|  Advantage? [○ Normal] [○ Advantage] [○ Disadv.] |
+--------------------------------------------------+
```

### Step 3: Result

```
+--------------------------------------------------+
|  ⚔️ ATTACK ROLL                                  |
|                                                   |
|  d20: 18 + 4 (STR) + 2 (prof) = 24                |
|  vs AC 15 → HIT! ✅                               |
|                                                   |
|  💥 DAMAGE ROLL                                  |
|  1d8: 7 + 4 (STR) = 11 slashing                   |
|                                                   |
|  Enemy1: 15/26 HP → 4/26 HP                      |
|  [====>             ]                             |
|                                                   |
|  [Continue]  [Roll Again]                         |
+--------------------------------------------------+
```

**Critical Hit:**
```
+--------------------------------------------------+
|  🌟 CRITICAL HIT!                                |
|                                                   |
|  d20: 20!                                         |
|  Automatic hit!                                   |
|                                                   |
|  💥 DAMAGE (doubled dice)                        |
|  2d8: 7 + 3 + 4 (STR) = 14 slashing               |
|                                                   |
|  Enemy1: 15/26 HP → 1/26 HP                      |
|  [=>                ]                             |
|                                                   |
|  🎉 Critical hit animation!                      |
+--------------------------------------------------+
```

---

## HP Bar States

```
Full HP:     [====================] 45/45 HP  (green)
Healthy:     [================>   ] 38/45 HP  (green)
Wounded:     [==========>         ] 25/45 HP  (yellow)
Critical:    [==>                 ]  8/45 HP  (red, pulsing)
Dead:        [☠️] 0/45 HP                    (gray)
Temp HP:     [====================++] 45+10 HP (green + blue)
```

**Animation:**
- Damage: Bar shrinks from right, red flash
- Healing: Bar grows from left, green glow
- Death: Gray out, skull icon, token falls

---

## Condition Badges

```
+--------------------------------------------------+
|  ● Assassin                                       |
|  [Poisoned 🔴] [Prone 🧍] [Concentrating 🧠]    |
|                                                   |
|  Hover: "Poisoned: Disadvantage on attacks and    |
|          ability checks"                          |
+--------------------------------------------------+
```

**Common Conditions:**
| Condition | Icon | Color |
|-----------|------|-------|
| Poisoned | 🔴 | Red |
| Prone | 🧍 | Brown |
| Stunned | ⚡ | Yellow |
| Invisible | 👻 | White |
| Concentrating | 🧠 | Purple |
| Blessed | ✨ | Gold |
| Hexed | 👿 | Black |

---

## Death Saving Throws

```
+--------------------------------------------------+
|  ☠️  Player3 is DYING!                            |
|                                                   |
|  Death Saving Throws:                             |
|  Success: [○] [○] [○]                           |
|  Failure: [○] [○] [○]                           |
|                                                   |
|  [Roll Death Save]                                |
|  (d20: 10+ = success, 1 = 2 failures, 20 = revive)|
|                                                   |
|  [Stabilize] (Medicine DC 10)                     |
+--------------------------------------------------+
```

**States:**
- Success: Green checkmark
- Failure: Red X
- 3 Successes: "STABILIZED" — HP set to 1
- 3 Failures: "DEAD" — Token grayed out

---

## Spell Casting

```
+--------------------------------------------------+
|  CAST SPELL                                       |
|                                                   |
|  Spell Level: [Cantrip] [1st] [2nd] [3rd] [...]   |
|                                                   |
|  Cantrips:                                        |
|  [Fire Bolt] [Ray of Frost] [Mage Hand] [...]    |
|                                                   |
|  1st Level (3 slots remaining):                   |
|  [Magic Missile] [Shield] [Burning Hands] [...]  |
|                                                   |
|  Selected: Fire Bolt                              |
|  Range: 120 ft  Damage: 1d10 fire                 |
|                                                   |
|  [Cast]  [Cancel]                                 |
+--------------------------------------------------+
```

---

## Mobile Combat Layout

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
| [Move][Attack][..]|
+------------------+
| INITIATIVE       |
| [●P1][P2][●E1]  |
+------------------+
| COMBATANTS       |
| ● Enemy1 8/15   |
| □ Player1 33/45 |
| (scrollable)     |
+------------------+
| [Action...] [Send]|
+------------------+
```

---

*Last updated: June 2026*
