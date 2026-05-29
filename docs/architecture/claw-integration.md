# Abacus Claw Integration

> **AI DM Agent Brain**

## Overview

**Abacus Claw** (managed OpenClaw) is the AI agent that powers the Dungeon Master. It handles:

- Natural language understanding of player actions
- Campaign narrative generation
- D&D 5e rules adjudication via tools
- Campaign memory and lore retrieval via RAG (Qdrant)
- Multi-turn conversation with persistent context

## Why Claw?

| Requirement | Claw Capability |
|-------------|----------------|
| Persistent memory | Built-in conversation memory + Qdrant RAG |
| Tool use | Native tool/function calling |
| Managed infrastructure | No self-hosted LLM infra needed |
| Custom persona | System prompt customization |
| Multi-model | Can leverage Claude, GPT-4, etc. under the hood |

## Agent Configuration

### System Prompt (DM Persona)

```
You are an expert Dungeon Master for D&D 5th Edition campaigns. You are running
the campaign "{campaign_name}" for a party of {party_size} players.

Your role:
- Narrate the story with vivid, immersive descriptions
- Adjudicate rules fairly using D&D 5e SRD rules
- Control all NPCs and monsters
- Track initiative, combat, and encounter state
- Respond to player actions with appropriate consequences
- Use available tools for dice rolls, spell lookups, and monster stats

Campaign Context:
{campaign_summary}

Current Session State:
{session_state}

Party Members:
{character_summaries}

Rules:
- Always ask for ability checks when appropriate
- Use the dice_roll tool for all random outcomes
- Reference the D&D 5e SRD for rules questions
- Keep responses concise for voice (2-4 sentences for narration)
- For combat, always track initiative order
```

### Tools Available to Claw

| Tool | Description | Trigger |
|------|-------------|---------|
| `dice_roll` | Roll any dice expression (e.g., 2d6+3) | Ability checks, attacks, damage |
| `lookup_spell` | Query Open5e API for spell details | Player casts a spell |
| `lookup_monster` | Query Open5e API for monster stats | Combat encounter |
| `lookup_rule` | Query Open5e SRD for rules | Rules questions |
| `update_combat` | Update initiative tracker, HP, conditions | Combat actions |
| `update_map` | Move tokens, reveal areas on map | Movement, exploration |
| `save_lore` | Save important narrative events to Qdrant | Key story moments |
| `recall_lore` | Search campaign history in Qdrant | Reference past events |
| `end_combat` | Resolve combat encounter | Combat ends |

### Tool Definitions (JSON Schema)

```json
{
  "name": "dice_roll",
  "description": "Roll dice using standard D&D notation",
  "parameters": {
    "type": "object",
    "properties": {
      "expression": {
        "type": "string",
        "description": "Dice expression, e.g., '2d6+3', '1d20', '4d6kh3'"
      },
      "reason": {
        "type": "string",
        "description": "Why the roll is being made, e.g., 'Perception check'"
      },
      "dc": {
        "type": "integer",
        "description": "Difficulty Class if this is a check (optional)"
      }
    },
    "required": ["expression", "reason"]
  }
}
```

## RAG Pipeline (Qdrant)

### Collections

| Collection | Content | Embedding Model |
|------------|---------|----------------|
| `campaign_lore` | Campaign-specific narrative events, NPC details, locations | OpenAI `text-embedding-3-small` |
| `dnd_rules` | D&D 5e SRD rules, class features, conditions | OpenAI `text-embedding-3-small` |
| `session_history` | Per-session conversation summaries | OpenAI `text-embedding-3-small` |

### Retrieval Flow

```
Player says: "Do I remember anything about the cursed amulet?"
    │
    ▼
Backend builds query: "cursed amulet" + campaign_id filter
    │
    ▼
Qdrant semantic search (campaign_lore collection)
    │
    ▼
Top 5 relevant chunks returned with metadata
    │
    ▼
Injected into Claw context as "Relevant Campaign Lore:"
    │
    ▼
Claw generates DM response referencing the lore
```

## API Integration

```typescript
// claw-client.ts
import { AbacusAI } from 'abacusai';

const client = new AbacusAI({ apiKey: process.env.ABACUS_API_KEY });

async function getDMResponse(
  sessionId: string,
  playerMessage: string,
  context: SessionContext
): Promise<DMResponse> {
  const response = await client.getClawResponse({
    deploymentId: process.env.CLAW_DEPLOYMENT_ID,
    messages: [
      { role: 'system', content: buildSystemPrompt(context) },
      ...context.recentMessages,
      { role: 'user', content: `[${context.characterName}]: ${playerMessage}` }
    ],
    tools: DM_TOOLS,
    ragContext: await getRelevantLore(sessionId, playerMessage),
  });

  return processClawResponse(response);
}
```

## Cost Optimization

- **Context window management**: Summarize old messages, keep recent 20 turns
- **RAG over full history**: Use Qdrant instead of stuffing full campaign history
- **Tiered models**: Use faster/cheaper models for simple actions, premium for complex narrative
- **Caching**: Cache Open5e API results (spells, monsters are static)
