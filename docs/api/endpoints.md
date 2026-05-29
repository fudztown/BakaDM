# API Endpoints Specification

> **Backend API — RESTful Endpoints**

## Base URL

```
Production:  https://api.dnd-ai-dm.vercel.app/api
Development: http://localhost:3000/api
```

## Authentication

All endpoints require authentication via Discord OAuth2 Bearer token:

```
Authorization: Bearer <discord_access_token>
```

Bot-to-API calls use a shared API key:

```
X-Bot-API-Key: <bot_api_key>
```

---

## Campaigns

### `GET /api/campaigns`

List all campaigns for the authenticated user.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | int | 1 | Page number |
| `limit` | int | 20 | Items per page |
| `status` | string | "active" | Filter: active, archived, all |

**Response: `200 OK`**
```json
{
  "campaigns": [
    {
      "id": "camp_abc123",
      "name": "The Curse of Strahd",
      "description": "A gothic horror campaign...",
      "dm_style": "dramatic",
      "player_count": 4,
      "session_count": 12,
      "last_played": "2026-05-28T20:00:00Z",
      "status": "active",
      "created_at": "2026-03-15T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 3 }
}
```

### `POST /api/campaigns`

Create a new campaign.

**Request Body:**
```json
{
  "name": "The Lost Mines of Phandelver",
  "description": "A classic introductory adventure...",
  "dm_style": "balanced",
  "setting": "Forgotten Realms",
  "level_range": "1-5",
  "guild_id": "discord_guild_123"
}
```

**Response: `201 Created`**
```json
{
  "id": "camp_def456",
  "name": "The Lost Mines of Phandelver",
  "status": "active",
  "created_at": "2026-05-29T10:00:00Z"
}
```

### `GET /api/campaigns/:id`

Get campaign details.

### `PATCH /api/campaigns/:id`

Update campaign settings.

### `DELETE /api/campaigns/:id`

Archive a campaign (soft delete).

---

## Sessions

### `POST /api/campaigns/:id/sessions`

Start a new game session.

**Request Body:**
```json
{
  "voice_channel_id": "discord_vc_123",
  "players": [
    { "discord_user_id": "user_123", "character_id": "char_abc" },
    { "discord_user_id": "user_456", "character_id": "char_def" }
  ]
}
```

**Response: `201 Created`**
```json
{
  "session_id": "sess_xyz789",
  "campaign_id": "camp_abc123",
  "status": "active",
  "started_at": "2026-05-29T20:00:00Z"
}
```

### `GET /api/sessions/:id`

Get session state (current narrative, combat state, etc.).

### `POST /api/sessions/:id/message`

Send a player message and get a DM response. **(Core gameplay endpoint)**

**Request Body:**
```json
{
  "player_id": "discord_user_123",
  "character_name": "Thorin",
  "text": "I search the chest for traps",
  "source": "voice"
}
```

**Response: `200 OK`**
```json
{
  "dm_text": "You carefully examine the ornate chest. Roll an Investigation check.",
  "voice_id": "dm_narrator",
  "tool_results": [],
  "ui_updates": [
    {
      "type": "narrative",
      "text": "Thorin kneels before the chest, examining it closely..."
    }
  ],
  "usage": {
    "input_tokens": 1250,
    "output_tokens": 85,
    "model": "claw-dm-v1"
  }
}
```

### `POST /api/sessions/:id/voice`

Process transcribed voice input (called by Discord Bot).

**Request Body:**
```json
{
  "player_id": "discord_user_123",
  "audio_transcript": "I want to cast fireball at the group of goblins",
  "confidence": 0.95,
  "duration_ms": 2400
}
```

### `POST /api/sessions/:id/end`

End the current session and save all state.

**Response: `200 OK`**
```json
{
  "session_id": "sess_xyz789",
  "duration_minutes": 145,
  "message_count": 87,
  "summary": "The party explored the goblin caves and defeated the bugbear chief...",
  "usage_total": {
    "input_tokens": 125000,
    "output_tokens": 34000,
    "voice_minutes": 42.5,
    "tts_characters": 28000
  }
}
```

---

## Characters

### `GET /api/campaigns/:id/characters`

List characters in a campaign.

### `POST /api/campaigns/:id/characters`

Create a new character.

**Request Body:**
```json
{
  "name": "Thorin Ironforge",
  "race": "Dwarf",
  "class": "Fighter",
  "level": 5,
  "discord_user_id": "user_123",
  "stats": {
    "str": 16, "dex": 12, "con": 14,
    "int": 10, "wis": 13, "cha": 8
  },
  "hp": { "current": 44, "max": 44 },
  "ac": 18,
  "backstory": "A dwarven blacksmith turned adventurer..."
}
```

### `GET /api/characters/:id`

Get character details.

### `PATCH /api/characters/:id`

Update character (level up, HP change, etc.).

---

## Dice

### `POST /api/dice/roll`

Roll dice and broadcast to session.

**Request Body:**
```json
{
  "session_id": "sess_xyz789",
  "expression": "1d20+5",
  "reason": "Investigation check",
  "roller_id": "discord_user_123"
}
```

**Response: `200 OK`**
```json
{
  "roll_id": "roll_abc",
  "expression": "1d20+5",
  "rolls": [14],
  "modifier": 5,
  "total": 19,
  "reason": "Investigation check",
  "roller": "Thorin Ironforge",
  "timestamp": "2026-05-29T20:15:00Z"
}
```

---

## Usage & Billing

### `GET /api/usage`

Get usage statistics for the authenticated user.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `period` | string | "current_month", "last_month", "all_time" |

**Response: `200 OK`**
```json
{
  "period": "current_month",
  "usage": {
    "sessions": 8,
    "total_minutes": 420,
    "voice_minutes": 180,
    "messages_sent": 340,
    "tokens_used": {
      "input": 450000,
      "output": 120000
    },
    "tts_characters": 95000
  },
  "subscription": {
    "tier": "adventurer",
    "limits": {
      "sessions_per_month": 20,
      "voice_minutes_per_month": 600
    },
    "usage_percentage": {
      "sessions": 40,
      "voice_minutes": 30
    }
  }
}
```

---

## Health

### `GET /api/health`

**Response: `200 OK`**
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "services": {
    "supabase": "connected",
    "qdrant": "connected",
    "claw": "available",
    "elevenlabs": "available"
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or expired token |
| `FORBIDDEN` | 403 | User lacks permission |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `USAGE_EXCEEDED` | 402 | Subscription usage limit exceeded |
| `SESSION_ACTIVE` | 409 | Campaign already has active session |
| `CLAW_ERROR` | 502 | Claw agent error |
| `VOICE_ERROR` | 503 | Voice pipeline (STT/TTS) error |

## See Also

- [API Schemas](./schemas.md)
- [Backend API Architecture](../architecture/backend-api.md)
