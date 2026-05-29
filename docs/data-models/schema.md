# Data Models — Supabase Schema

> **PostgreSQL Database Schema (Supabase)**

## Entity Relationship Diagram

```
┌──────────┐     ┌────────────┐     ┌──────────────┐
│  users   │────<│ campaigns   │────<│  sessions     │
└──────────┘     └────────────┘     └──────┬───────┘
                       │                    │
                       │                    │
                 ┌─────┴──────┐      ┌──────┴───────┐
                 │ characters  │      │  messages     │
                 └────────────┘      └──────────────┘
                                           │
┌──────────────┐                    ┌──────┴───────┐
│ subscriptions│                    │ usage_events  │
└──────────────┘                    └──────────────┘

┌──────────────┐
│ dice_rolls   │
└──────────────┘
```

## Tables

### `users`

Maps Discord users to the system. Created on first Discord OAuth login.

```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_user_id TEXT UNIQUE NOT NULL,
  discord_username TEXT NOT NULL,
  avatar_url      TEXT,
  email           TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'adventurer', 'hero', 'legend')),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_discord_id ON users(discord_user_id);
```

### `campaigns`

A campaign is a persistent D&D adventure with its own lore, characters, and session history.

```sql
CREATE TABLE campaigns (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  guild_id        TEXT NOT NULL,           -- Discord server ID
  name            TEXT NOT NULL,
  description     TEXT,
  dm_style        TEXT DEFAULT 'balanced' CHECK (dm_style IN ('dramatic', 'balanced', 'comedic', 'tactical', 'narrative')),
  setting         TEXT DEFAULT 'Forgotten Realms',
  level_range     TEXT DEFAULT '1-5',
  status          TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  claw_agent_id   TEXT,                    -- Abacus Claw deployment ID
  qdrant_collection TEXT,                  -- Qdrant collection for campaign lore
  session_count   INT DEFAULT 0,
  last_played     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_campaigns_owner ON campaigns(owner_id);
CREATE INDEX idx_campaigns_guild ON campaigns(guild_id);
```

### `characters`

Player characters belonging to a campaign.

```sql
CREATE TABLE characters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id     UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  race            TEXT NOT NULL,
  class           TEXT NOT NULL,
  level           INT DEFAULT 1,
  -- Ability scores
  str             INT NOT NULL,
  dex             INT NOT NULL,
  con             INT NOT NULL,
  int_score       INT NOT NULL,           -- 'int' is reserved
  wis             INT NOT NULL,
  cha             INT NOT NULL,
  -- Combat stats
  hp_current      INT NOT NULL,
  hp_max          INT NOT NULL,
  hp_temp         INT DEFAULT 0,
  ac              INT NOT NULL,
  -- Flavor
  backstory       TEXT,
  inventory       JSONB DEFAULT '[]',
  spell_slots     JSONB,                  -- null for non-casters
  features        JSONB DEFAULT '[]',
  -- Meta
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),

  UNIQUE(campaign_id, user_id)            -- One character per player per campaign
);

CREATE INDEX idx_characters_campaign ON characters(campaign_id);
CREATE INDEX idx_characters_user ON characters(user_id);
```

### `sessions`

A game session — a single play sitting within a campaign.

```sql
CREATE TABLE sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id     UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  status          TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  voice_channel_id TEXT,
  players         JSONB DEFAULT '[]',     -- Array of {discord_user_id, character_id}
  combat_state    JSONB,                  -- Current combat state (null if not in combat)
  game_state      JSONB DEFAULT '{}',     -- Arbitrary game state (map, quest tracker, etc.)
  summary         TEXT,                   -- AI-generated session summary (set on end)
  message_count   INT DEFAULT 0,
  started_at      TIMESTAMPTZ DEFAULT now(),
  ended_at        TIMESTAMPTZ,
  duration_minutes INT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sessions_campaign ON sessions(campaign_id);
CREATE INDEX idx_sessions_status ON sessions(status);
```

### `messages`

All messages exchanged during sessions (player inputs and DM responses).

```sql
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID REFERENCES sessions(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('player', 'dm', 'system')),
  character_name  TEXT,                   -- null for DM/system
  content         TEXT NOT NULL,
  source          TEXT DEFAULT 'text' CHECK (source IN ('voice', 'text', 'system')),
  tool_calls      JSONB DEFAULT '[]',
  tool_results    JSONB DEFAULT '[]',
  ui_updates      JSONB DEFAULT '[]',
  -- Usage tracking per message
  input_tokens    INT DEFAULT 0,
  output_tokens   INT DEFAULT 0,
  model           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_session ON messages(session_id);
CREATE INDEX idx_messages_created ON messages(created_at);
```

### `dice_rolls`

Dice roll history for auditing and display.

```sql
CREATE TABLE dice_rolls (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id),
  character_name  TEXT,
  expression      TEXT NOT NULL,          -- "2d6+3"
  rolls           JSONB NOT NULL,         -- [4, 2]
  modifier        INT DEFAULT 0,
  total           INT NOT NULL,
  reason          TEXT,                   -- "Attack roll"
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_dice_rolls_session ON dice_rolls(session_id);
```

### `usage_events`

Granular usage tracking for billing and analytics.

```sql
CREATE TABLE usage_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id      UUID REFERENCES sessions(id),
  event_type      TEXT NOT NULL CHECK (event_type IN (
    'claw_call', 'stt_minute', 'tts_minute', 'tts_characters',
    'embedding', 'qdrant_query', 'open5e_lookup'
  )),
  quantity        NUMERIC NOT NULL,       -- Amount (tokens, minutes, characters)
  unit            TEXT NOT NULL,           -- "tokens", "minutes", "characters", "calls"
  cost_usd        NUMERIC(10,6),          -- Estimated cost in USD
  metadata        JSONB DEFAULT '{}',     -- Additional context
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_usage_user ON usage_events(user_id);
CREATE INDEX idx_usage_session ON usage_events(session_id);
CREATE INDEX idx_usage_created ON usage_events(created_at);
CREATE INDEX idx_usage_type ON usage_events(event_type);
```

### `subscriptions`

Tracks Discord Premium Apps subscription state.

```sql
CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  discord_sku_id  TEXT NOT NULL,
  tier            TEXT NOT NULL CHECK (tier IN ('free', 'adventurer', 'hero', 'legend')),
  status          TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
  period_start    TIMESTAMPTZ NOT NULL,
  period_end      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE UNIQUE INDEX idx_subscriptions_active ON subscriptions(user_id) WHERE status = 'active';
```

## Row-Level Security (RLS)

Supabase RLS ensures users can only access their own data:

```sql
-- Users can only read their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (discord_user_id = auth.jwt() ->> 'sub');

-- Campaign access: owner or player
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Campaign access" ON campaigns
  FOR SELECT USING (
    owner_id = auth.uid()
    OR id IN (SELECT campaign_id FROM characters WHERE user_id = auth.uid())
  );

-- Characters: user owns character or is campaign owner
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Character access" ON characters
  FOR SELECT USING (
    user_id = auth.uid()
    OR campaign_id IN (SELECT id FROM campaigns WHERE owner_id = auth.uid())
  );
```

## Migrations Strategy

- Use Supabase CLI for migration management: `supabase migration new <name>`
- Migrations stored in `/supabase/migrations/`
- Seed data for development in `/supabase/seed.sql`

## See Also

- [API Schemas (TypeScript)](../api/schemas.md)
- [API Endpoints](../api/endpoints.md)
