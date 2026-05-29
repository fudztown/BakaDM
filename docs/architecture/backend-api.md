# Backend API Architecture

> **Service 3 — Next.js API Routes (Orchestration Layer)**

## Overview

The Backend API serves as the orchestration layer between the Discord Bot, Discord Activity, Abacus Claw, and all data stores. It is implemented as Next.js API Routes, co-located with the Discord Activity frontend, and deployed on Vercel.

## Responsibilities

1. **Request Orchestration** — Route player inputs to Claw, return DM responses
2. **Session Management** — Create, load, save game sessions
3. **Campaign CRUD** — Manage campaigns, characters, and game state
4. **Usage Tracking** — Meter API calls, token usage, voice minutes for billing
5. **Webhook Handling** — Receive Discord webhooks, n8n workflow triggers
6. **Auth Middleware** — Validate Discord OAuth tokens, enforce permissions

## API Route Structure

```
/app/api
├── /auth
│   ├── /discord/callback    # Discord OAuth callback
│   └── /session             # Session token management
├── /campaigns
│   ├── route.ts             # GET (list), POST (create)
│   └── /[id]
│       ├── route.ts         # GET, PATCH, DELETE
│       ├── /sessions        # GET (list), POST (create)
│       ├── /characters      # GET (list), POST (create)
│       └── /load            # POST (load into active session)
├── /sessions
│   └── /[id]
│       ├── route.ts         # GET, PATCH (save state)
│       ├── /message         # POST (player message → Claw → DM response)
│       ├── /voice           # POST (transcribed voice → process)
│       └── /end             # POST (end session, save)
├── /characters
│   └── /[id]
│       └── route.ts         # GET, PATCH, DELETE
├── /dice
│   └── /roll                # POST (roll dice, broadcast)
├── /usage
│   └── route.ts             # GET (usage stats for billing)
├── /webhooks
│   ├── /discord             # Discord webhook events
│   └── /n8n                 # n8n workflow callbacks
└── /health                  # GET (health check)
```

## Request Flow: Player Message → DM Response

```
POST /api/sessions/{id}/message
{
  "player_id": "discord_user_123",
  "character_name": "Thorin",
  "text": "I search the chest for traps",
  "source": "voice"  // or "text"
}

Backend Flow:
1. Validate auth token
2. Load session context from Supabase
3. Build Claw request:
   - System prompt (DM persona + campaign rules)
   - Conversation history (last N messages)
   - Available tools (dice_roll, lookup_spell, update_map, etc.)
   - RAG context from Qdrant (relevant campaign lore)
4. Call Abacus Claw API
5. Process Claw response:
   - Extract narrative text
   - Execute any tool calls (dice rolls, map updates)
   - Determine voice ID for TTS
6. Save message to Supabase
7. Track usage (tokens, API calls)
8. Return response

Response:
{
  "dm_text": "You carefully examine the chest...",
  "voice_id": "dm_narrator",
  "tool_results": [
    {"tool": "dice_roll", "result": {"roll": "1d20+5", "total": 18}}
  ],
  "ui_updates": [
    {"type": "narrative", "text": "Thorin examines the chest..."},
    {"type": "dice_result", "roll": "1d20+5", "total": 18, "check": "Investigation"}
  ],
  "usage": {
    "input_tokens": 1250,
    "output_tokens": 340,
    "model": "claw-dm-v1"
  }
}
```

## Middleware Stack

```typescript
// middleware.ts
export const middleware = [
  rateLimiter,        // Per-user rate limiting
  discordAuth,        // Validate Discord OAuth / bot token
  usageTracker,       // Log API usage for billing
  errorHandler,       // Consistent error responses
];
```

## Error Handling

All API routes return consistent error responses:

```json
{
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "Session abc-123 does not exist or has expired",
    "status": 404
  }
}
```

## n8n Workflow Integration

Existing n8n workflows on the Hostinger VPS are wrapped by the Backend API:

| Workflow | API Wrapper | Purpose |
|----------|-------------|---------|
| D&D Critical Role Simulator | `/api/webhooks/n8n/simulate` | Trigger campaign simulation |
| Cursor-Rome Bridge | `/api/webhooks/n8n/bridge` | Sync state between systems |
| D&D Transcript Processor | `/api/webhooks/n8n/process-transcript` | Process YouTube transcripts → Qdrant |

## See Also

- [API Endpoints Specification](../api/endpoints.md)
- [API Schemas](../api/schemas.md)
- [Claw Integration](./claw-integration.md)
