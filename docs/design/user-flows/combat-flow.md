# Combat User Flow

> **Turn-based combat: Initiative → Turns → Actions → Resolution → End Combat**

---

## Flow Overview

```
[Combat Triggered] → [Initiative Roll] → [Turn Order Set]
    → [Player Turn] → [Action] → [Resolution] → [Next Turn]
    → [Enemy Turn] → [DM Narrates] → [Next Turn]
    → [Combat End] → [Rewards/Summary]
```

---

## Combat Trigger

**Trigger:** DM (AI) declares combat start, or player initiates hostile action.

**Screen Transition:**
```
+--------------------------------------------------+
|  ⚠️  COMBAT INITIATED                            |
|                                                   |
|  An assassin emerges from the shadows!            |
|                                                   |
|  [Rolling initiative...]                          |
|  🎲 🎲 🎲 🎲 🎲 🎲 🎲 🎲                    |
|                                                   |
|  (Auto-rolling for all combatants...)             |
+--------------------------------------------------+
```

**Auto-Roll Rules:**
- All players roll d20 + DEX modifier
- DM rolls for enemies (hidden from players)
- Ties broken by DEX score, then coin flip

---

## Initiative Display

**Layout (Bottom Panel):**
```
+--------------------------------------------------+
|  COMBAT — Round 1                    [End Combat] |
|                                                   |
|  ◀  [●Player1] [Player2] [Enemy1] [Player3] ▶  |
|       18          15        12       10           |
|       ↑ Active                                   |
|                                                   |
|  Player1's Turn  [Move] [Action] [Bonus] [End]   |
+--------------------------------------------------+
```

**Initiative Bar:**
- Horizontal scrollable list
- Active combatant: Large, centered, orange glow
- Up next: Medium, to the right
- Previous: Small, to the left, dimmed
- Dead: Removed or grayed out at end

**States:**
- Rolling: Dice animation on each token
- Sorted: Smooth reorder animation
- Active: Pulse animation on current turn

---

## Player Turn

**Screen State:**
```
+--------------------------------------------------+
|  MAP SCENE    |        MAP         | Adventure Log|
|               |                    |              |
|  Terrain      |  [Grid with       |  DM: "The    |
|  [Forest]     |   tokens]          |   assassin   |
|               |                    |   draws a    |
|  [AI] [Ref]   |  □ Player1        |   dagger..." |
|               |  ● Enemy1          |              |
|               |  □ Player2         |              |
|               |                    |              |
+---------------+--------------------+--------------+
|  COMBAT — Round 1 — Player1's Turn               |
|                                                   |
|  [Move] [Attack] [Cast Spell] [Use Item] [Dodge]  |
|  [Dash] [Disengage] [Help] [Hide] [Ready]         |
|                                                   |
|  [Describe action...]                    [Send]   |
+--------------------------------------------------+
```

**Action Buttons:**
- **Move**: Highlight movement range on map, click destination
- **Attack**: Select target, auto-roll attack + damage
- **Cast Spell**: Open spell list, select spell, select target(s)
- **Use Item**: Open inventory, select item
- **Dodge/Dash/Disengage/Help/Hide/Ready**: Toggle state, DM narrates

**Movement Rules:**
- Click "Move" → Movement range highlighted (speed / 5 = grid squares)
- Click destination → Token animates to position
- Remaining movement shown: "30 ft remaining"

---

## Action Resolution

**Attack Flow:**
```
Player clicks "Attack" → Select target (click enemy token)
    → "Rolling attack..." → d20 + modifiers animated
    → Result displayed:
        - Hit: "18 vs AC 15 — HIT!"
        - Miss: "12 vs AC 15 — Miss"
        - Crit: "20! CRITICAL HIT! 🌟"
    → If hit: Roll damage, HP bar updates
    → DM narrates result
    → Next turn or action
```

**Damage Display:**
```
+--------------------------------------------------+
|  ⚔️ Attack Roll                                   |
|  d20: 18 + 4 (STR) + 2 (prof) = 24                |
|  vs AC 15 → HIT!                                  |
|                                                   |
|  💥 Damage: 2d6 + 4 = 7 + 3 + 4 = 14              |
|                                                   |
|  Enemy1: 45/59 HP → 31/59 HP                      |
|  [==========>        ]                            |
+--------------------------------------------------+
```

---

## Enemy Turn

**Flow:**
```
Enemy turn starts
    → Initiative bar highlights enemy token
    → DM (AI) narrates enemy action
    → If attack on player: Auto-roll, show result
    → Player HP updates if damaged
    → "[Enemy] takes [action]" log entry
    → Next turn
```

**Visual:**
- Enemy token pulses red briefly
- If player takes damage: Screen shake (subtle), red flash on HP bar
- If player drops to 0 HP: "UNCONSCIOUS" overlay, death save prompt

---

## Special Combat States

### Death Saving Throws

**Trigger:** Player HP reaches 0.

```
+--------------------------------------------------+
|  ☠️  Player1 is DYING!                            |
|                                                   |
|  Death Saving Throws: 0/3                         |
|  [○] [○] [○]                                    |
|                                                   |
|  [Roll Death Save]                                |
|  (d20: 10+ = success, 1 = 2 failures, 20 = revive)|
+--------------------------------------------------+
```

### Concentration Checks

**Trigger:** Caster takes damage while concentrating.

```
+--------------------------------------------------+
|  🚨 Concentration Check!                         |
|                                                   |
|  DC 10 (half damage taken)                        |
|  [Roll d20 + CON modifier]                        |
+--------------------------------------------------+
```

### Opportunity Attacks

**Trigger:** Player moves out of enemy reach.

```
+--------------------------------------------------+
|  ⚠️  Opportunity Attack!                         |
|                                                   |
|  Enemy1 gets an attack of opportunity.            |
|  [Continue Moving]  [Stay]                        |
+--------------------------------------------------+
```

---

## End Combat

**Trigger:** All enemies defeated, or DM clicks "End Combat".

**Flow:**
```
Last enemy defeated
    → "COMBAT ENDED" banner
    → Combat summary modal:
        - Duration (rounds + time)
        - Damage dealt/taken per player
        - Enemies defeated
        - XP earned
        - Loot found
    → Return to exploration mode
```

**Summary Screen:**
```
+--------------------------------------------------+
|  ✅  COMBAT ENDED                                 |
|                                                   |
|  Duration: 8 rounds (12 minutes)                  |
|                                                   |
|  Damage Dealt:                                    |
|  Player1: 47  Player2: 32  Player3: 18           |
|                                                   |
|  Enemies Defeated:                                |
|  ✓ Assassin (CR 3)                               |
|  ✓ Thug x2 (CR 1/2 each)                        |
|                                                   |
|  XP Earned: 450 each                              |
|  Loot: Dagger +1, 50 gp, Potion of Healing x2     |
|                                                   |
|              [Continue Adventure]                 |
+--------------------------------------------------+
```

---

## Error / Edge Cases

| Scenario | Handling |
|----------|----------|
| Player disconnects mid-combat | Pause turn, "Waiting for Player1..." |
| Player rejoins | Resume at current state |
| DM (AI) fails to respond | Retry, fallback to text prompt |
| Initiative tie | Auto-resolve by DEX, notify in log |
| Invalid target | "Target is out of range" (red tooltip) |
| Action not allowed | "You have already used your action" |

---

*Last updated: June 2026*
