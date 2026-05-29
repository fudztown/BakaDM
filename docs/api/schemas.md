# API Schemas

> **TypeScript Type Definitions & JSON Schemas**

## Core Types

```typescript
// ============================================================
// Campaign
// ============================================================
interface Campaign {
  id: string;                    // "camp_abc123"
  name: string;
  description: string;
  dm_style: DMStyle;
  setting: string;
  level_range: string;           // "1-5"
  status: "active" | "archived";
  guild_id: string;              // Discord guild ID
  owner_id: string;              // Discord user ID
  player_count: number;
  session_count: number;
  last_played: string | null;    // ISO 8601
  created_at: string;            // ISO 8601
  updated_at: string;
}

type DMStyle = "dramatic" | "balanced" | "comedic" | "tactical" | "narrative";

// ============================================================
// Session
// ============================================================
interface Session {
  id: string;                    // "sess_xyz789"
  campaign_id: string;
  status: "active" | "paused" | "ended";
  voice_channel_id: string | null;
  players: SessionPlayer[];
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
  message_count: number;
  summary: string | null;        // AI-generated session summary
  combat_state: CombatState | null;
  usage: SessionUsage;
}

interface SessionPlayer {
  discord_user_id: string;
  character_id: string;
  character_name: string;
  joined_at: string;
}

interface CombatState {
  active: boolean;
  round: number;
  turn_index: number;
  initiative_order: InitiativeEntry[];
}

interface InitiativeEntry {
  name: string;
  type: "player" | "npc" | "monster";
  initiative: number;
  hp_current: number;
  hp_max: number;
  ac: number;
  conditions: string[];
}

// ============================================================
// Character
// ============================================================
interface Character {
  id: string;                    // "char_abc"
  campaign_id: string;
  discord_user_id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  stats: AbilityScores;
  hp: HitPoints;
  ac: number;
  backstory: string;
  inventory: InventoryItem[];
  spell_slots: SpellSlots | null;
  features: string[];
  created_at: string;
  updated_at: string;
}

interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

interface HitPoints {
  current: number;
  max: number;
  temp: number;
}

interface InventoryItem {
  name: string;
  quantity: number;
  equipped: boolean;
  description?: string;
}

interface SpellSlots {
  [level: string]: { used: number; max: number };
}

// ============================================================
// Message
// ============================================================
interface Message {
  id: string;
  session_id: string;
  role: "player" | "dm" | "system";
  character_name: string | null;  // null for DM/system
  content: string;
  source: "voice" | "text" | "system";
  tool_calls: ToolCall[];
  tool_results: ToolResult[];
  ui_updates: UIUpdate[];
  usage: MessageUsage;
  created_at: string;
}

interface ToolCall {
  tool: string;
  parameters: Record<string, unknown>;
}

interface ToolResult {
  tool: string;
  result: Record<string, unknown>;
}

// ============================================================
// UI Updates (pushed to Discord Activity)
// ============================================================
type UIUpdate =
  | { type: "narrative"; text: string }
  | { type: "dice_result"; roll: string; total: number; check: string; success?: boolean }
  | { type: "combat_start"; initiative_order: InitiativeEntry[] }
  | { type: "combat_update"; combat_state: CombatState }
  | { type: "combat_end"; summary: string }
  | { type: "map_update"; markers: MapMarker[] }
  | { type: "hp_change"; character: string; old_hp: number; new_hp: number }
  | { type: "condition_change"; character: string; condition: string; added: boolean };

interface MapMarker {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "player" | "npc" | "monster" | "object";
  visible_to: string[];  // player IDs, or ["all"]
}

// ============================================================
// Usage Tracking
// ============================================================
interface SessionUsage {
  input_tokens: number;
  output_tokens: number;
  voice_minutes_stt: number;
  voice_minutes_tts: number;
  tts_characters: number;
  api_calls: number;
}

interface MessageUsage {
  input_tokens: number;
  output_tokens: number;
  model: string;
}

interface UserUsage {
  period: string;
  sessions: number;
  total_minutes: number;
  voice_minutes: number;
  messages_sent: number;
  tokens_used: { input: number; output: number };
  tts_characters: number;
}

// ============================================================
// Subscription
// ============================================================
interface Subscription {
  tier: SubscriptionTier;
  discord_sku_id: string;
  status: "active" | "cancelled" | "past_due";
  current_period_start: string;
  current_period_end: string;
  limits: TierLimits;
}

type SubscriptionTier = "free" | "adventurer" | "hero" | "legend";

interface TierLimits {
  sessions_per_month: number;
  voice_minutes_per_month: number;
  campaigns: number;
  characters_per_campaign: number;
  custom_voices: boolean;
  priority_queue: boolean;
}

// ============================================================
// Dice Roll
// ============================================================
interface DiceRoll {
  id: string;
  session_id: string;
  expression: string;          // "2d6+3"
  rolls: number[];             // [4, 2]
  modifier: number;            // 3
  total: number;               // 9
  reason: string;              // "Damage roll"
  roller_id: string;
  roller_name: string;
  timestamp: string;
}
```

## See Also

- [API Endpoints](./endpoints.md)
- [Data Models](../data-models/schema.md)
