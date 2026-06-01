# Character Sheet Wireframe

> **Full character sheet: stats, abilities, inventory, spells, and conditions.**

---

## Desktop Layout

```
+--------------------------------------------------------------------------+
| HEADER                                                                   |
| [🎮 BakaDM] [The Fall of Thay]        Character Sheet    [← Back]      |
+--------------------------------------------------------------------------+
|                                                                          |
|  +----------------------------------------------------------+           |
|  | HEADER                                                   |           |
|  | [Avatar]  Thorin Ironbeard          Level 5 Dwarf Fighter|           |
|  |         Lawful Good                    HP: 45/45  AC: 18  |           |
|  |         [==========]                   [Edit] [Export]    |           |
|  +----------------------------------------------------------+           |
|                                                                          |
|  +------------------+ +------------------+ +------------------+         |
|  | ABILITIES        | | SKILLS           | | COMBAT           |         |
|  |                  | |                  | |                  |         |
|  | STR 18 (+4)      | | ✅ Athletics +7  | | Initiative: +2   |         |
|  | DEX 14 (+2)      | | ○ Acrobatics +2  | | Speed: 25 ft     |         |
|  | CON 16 (+3)      | | ✅ Intimidation +5| | Prof. Bonus: +3  |         |
|  | INT 10 (+0)      | | ○ History +0     | | Hit Dice: 5d10   |         |
|  | WIS 12 (+1)      | | ○ Perception +1  | |                  |         |
|  | CHA  8 (-1)      | | ✅ Survival +4    | | Attacks:         |         |
|  |                  | |                  | | Longsword +7, 1d8+4|         |
|  | [Roll] [Save]    | | [Roll] [Edit]    | | Warhammer +7, 1d8+4|         |
|  +------------------+ +------------------+ +------------------+         |
|                                                                          |
|  +------------------------+ +------------------------------------+       |
|  | INVENTORY              | | SPELLS                             |       |
|  |                        | |                                    |       |
|  | Weapons:               | | Spell Slots:                       |       |
|  | - Longsword            | | [1st] [●][●][●][○]              |       |
|  | - Warhammer            | | [2nd] [●][●][○][○]              |       |
|  | - Dagger (x2)          | | [3rd] [●][○][○][○]              |       |
|  |                        | |                                    |       |
|  | Armor:                 | | Known Spells:                      |       |
|  | - Chain Mail           | | - Shield                           |       |
|  | - Shield               | | - Bless                            |       |
|  |                        | | - Cure Wounds                      |       |
|  | Consumables:           | | - Spiritual Weapon               |       |
|  | - Potion of Healing x3 | |                                    |       |
|  | - Antitoxin x1         | | [Prepare Spells]                   |       |
|  |                        | |                                    |       |
|  | [Add Item]             | |                                    |       |
|  +------------------------+ +------------------------------------+       |
|                                                                          |
|  +----------------------------------------------------------+           |
|  | FEATURES & TRAITS                                        |           |
|  | Second Wind, Action Surge (x1), Fighting Style: Dueling  |           |
|  | Dwarven Resilience, Stonecunning, Darkvision 60ft        |           |
|  +----------------------------------------------------------+           |
|                                                                          |
+--------------------------------------------------------------------------+
```

---

## Character Header

```
+----------------------------------------------------------+
| [80px Avatar]                                            |
|                                                          |
|  Thorin Ironbeard                    Level 5 Dwarf Fighter|
|  Lawful Good                                             |
|                                                          |
|  HP: 45/45        AC: 18        Proficiency: +3         |
|  [====================]                                  |
|                                                          |
|  [Edit Character]  [Export PDF]  [Short Rest] [Long Rest]|
+----------------------------------------------------------+
```

**HP Bar:**
- Large size (16px height)
- Color-coded: Green (>50%), Yellow (25-50%), Red (<25%)
- Temp HP shown as blue extension

**Rest Buttons:**
- Short Rest: Heal hit dice, reset short rest features
- Long Rest: Full heal, reset all features, regain spell slots

---

## Abilities Panel

```
+------------------+
| ABILITIES        |
|                  |
| STR  18  (+4)    |
|      [Roll]      |
|      [Save]      |
|                  |
| DEX  14  (+2)    |
|      [Roll]      |
|      [Save]      |
|                  |
| CON  16  (+3)    |
|      [Roll]      |
|      [Save]      |
|                  |
| INT  10  (+0)    |
|      [Roll]      |
|      [Save]      |
|                  |
| WIS  12  (+1)    |
|      [Roll]      |
|      [Save]      |
|                  |
| CHA   8  (-1)    |
|      [Roll]      |
|      [Save]      |
+------------------+
```

**States:**
- Normal: Default background
- Saving throw advantage: Green border
- Saving throw disadvantage: Red border
- Proficient: Star icon next to modifier

---

## Skills Panel

```
+------------------+
| SKILLS           |
|                  |
| ✅ Athletics    +7|
| ○ Acrobatics    +2|
| ○ Sleight of H  +2|
| ○ Stealth       +2|
| ✅ Arcana        +0|
| ○ History        +0|
| ○ Investigation  +0|
| ○ Nature         +0|
| ○ Religion       +0|
| ✅ Animal Hand.   +4|
| ○ Insight        +1|
| ○ Medicine       +1|
| ○ Perception     +1|
| ✅ Survival       +4|
| ○ Deception      -1|
| ○ Intimidation   +5|
| ○ Performance    -1|
| ✅ Persuasion     -1|
+------------------+
```

**Legend:**
- ✅ = Proficient (proficiency bonus added)
- ○ = Not proficient
- Expertise: Double proficiency (marked with ⭐)

---

## Spell Slots

```
+------------------+
| SPELL SLOTS      |
|                  |
| 1st: [●][●][●][○]  3/4 |
| 2nd: [●][●][○][○]  2/4 |
| 3rd: [●][○][○][○]  1/4 |
|                  |
| [Long Rest]      |
| (Regain all)     |
+------------------+
```

**States:**
- ● = Available (filled)
- ○ = Expended (empty)
- Hover: "Click to expend/regain"

---

## Mobile Layout

```
+------------------+
| HEADER           |
+------------------+
| [Avatar]         |
| Thorin Ironbeard |
| Lvl 5 Fighter    |
| HP: 45/45 AC: 18 |
+------------------+
| [Stats] [Skills] |
| [Spells] [Inv.]  |
| (Tab bar)        |
+------------------+
|                  |
| ABILITIES TAB    |
| STR 18 (+4)      |
| DEX 14 (+2)      |
| ...              |
|                  |
+------------------+
```

---

*Last updated: June 2026*
