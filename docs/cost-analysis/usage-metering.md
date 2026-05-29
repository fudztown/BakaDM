# Cost Analysis & Usage Metering

> **Unit Economics, Pricing Model, and Cost Tracking**

## Cost Per Session

Estimated costs for a typical 2-hour D&D session (4 players):

| Component | Unit | Qty/Session | Unit Cost | Session Cost |
|-----------|------|-------------|-----------|-------------|
| **Claw (LLM)** | input tokens | ~200K | $0.003/1K | $0.60 |
| **Claw (LLM)** | output tokens | ~50K | $0.015/1K | $0.75 |
| **STT** | minutes | ~45 min | $0.01/min | $0.45 |
| **TTS** | characters | ~40K | $0.03/1K chars | $1.20 |
| **Embeddings** | tokens | ~20K | $0.00002/1K | $0.00 |
| **Qdrant** | queries | ~100 | ~$0.001/query | $0.10 |
| **Supabase** | included | — | — | $0.00 |
| **Vercel** | included | — | — | $0.00 |
| **Total** | | | | **~$3.10** |

### Cost Breakdown by Component

```
Claw (LLM)  ████████████████████████████████████  44%  ($1.35)
TTS         ████████████████████████              39%  ($1.20)
STT         ██████████████                        15%  ($0.45)
Qdrant      █                                      3%  ($0.10)
```

## Subscription Tiers

Pricing via **Discord Premium Apps** (Discord handles billing):

| Tier | Monthly Price | Sessions/mo | Voice Min/mo | Campaigns | Custom Voices |
|------|-------------|-------------|-------------|-----------|--------------|
| **Free** | $0 | 2 | 30 | 1 | ❌ |
| **Adventurer** | $9.99 | 12 | 300 | 3 | ❌ |
| **Hero** | $19.99 | 30 | 900 | 10 | ✅ (3) |
| **Legend** | $39.99 | Unlimited | 3,000 | Unlimited | ✅ (10) |

### Margin Analysis

| Tier | Revenue | Est. Usage Cost | Gross Margin |
|------|---------|----------------|-------------|
| Free | $0 | ~$6 | -$6 (acquisition) |
| Adventurer | $9.99 | ~$25 | -$15 (subsidized) |
| Hero | $19.99 | ~$60 | -$40 (subsidized) |
| Legend | $39.99 | ~$120+ | -$80+ (subsidized) |

> **⚠️ Note**: At current AI API prices, the product is heavily subsidized. The pricing model assumes:
> 1. AI API costs will decrease 50-80% over 12-18 months
> 2. Claw/model optimization reduces token usage over time
> 3. Volume discounts on ElevenLabs and OpenAI
> 4. Aggressive caching reduces redundant API calls
> 5. Revenue scales, unit costs drop with optimization

### Break-Even Targets (per user/month)

| Cost Component | Current | Target (12mo) | Reduction |
|----------------|---------|---------------|-----------|
| LLM tokens | $1.35/session | $0.40/session | -70% |
| TTS | $1.20/session | $0.30/session | -75% |
| STT | $0.45/session | $0.15/session | -67% |
| **Total/session** | **$3.10** | **$0.90** | **-71%** |

## Usage Metering Architecture

### What We Track

Every API call that costs money is logged to the `usage_events` table:

| Event Type | Unit | Source |
|-----------|------|--------|
| `claw_call` | tokens (input + output) | Backend API → Claw |
| `stt_minute` | minutes | Discord Bot → STT engine |
| `tts_minute` | minutes | Backend → ElevenLabs |
| `tts_characters` | characters | Backend → ElevenLabs |
| `embedding` | tokens | Backend → OpenAI Embeddings |
| `qdrant_query` | queries | Backend → Qdrant |
| `open5e_lookup` | calls | Backend → Open5e API |

### Metering Pipeline

```
API Route handles request
    │
    ├── Before: Check usage limits (middleware)
    │   └── If over limit → 402 USAGE_EXCEEDED
    │
    ├── Execute: Call external service (Claw, ElevenLabs, etc.)
    │
    └── After: Log usage event
        └── INSERT INTO usage_events (user_id, event_type, quantity, cost_usd, ...)
```

### Usage Limit Enforcement

```typescript
async function checkUsageLimits(userId: string): Promise<boolean> {
  const subscription = await getSubscription(userId);
  const usage = await getMonthlyUsage(userId);
  
  // Check session count
  if (usage.sessions >= subscription.limits.sessions_per_month) {
    throw new UsageExceededError('Session limit reached');
  }
  
  // Check voice minutes
  if (usage.voice_minutes >= subscription.limits.voice_minutes_per_month) {
    throw new UsageExceededError('Voice minute limit reached');
  }
  
  return true;
}
```

### Monthly Usage Aggregation

```sql
-- Monthly usage summary per user
SELECT
  user_id,
  DATE_TRUNC('month', created_at) AS month,
  COUNT(DISTINCT session_id) AS sessions,
  SUM(CASE WHEN event_type = 'claw_call' THEN quantity ELSE 0 END) AS total_tokens,
  SUM(CASE WHEN event_type IN ('stt_minute', 'tts_minute') THEN quantity ELSE 0 END) AS voice_minutes,
  SUM(cost_usd) AS total_cost
FROM usage_events
WHERE created_at >= DATE_TRUNC('month', now())
GROUP BY user_id, DATE_TRUNC('month', created_at);
```

## Cost Optimization Strategies

| Strategy | Impact | Phase |
|----------|--------|-------|
| Cache Open5e API responses | Eliminate redundant lookups | 0 |
| Summarize old messages (rolling window) | Reduce context tokens by 60% | 0 |
| Batch Qdrant queries | Reduce query count | 1 |
| Use smaller models for simple responses | Reduce LLM cost by 30% | 1 |
| Negotiate volume pricing (ElevenLabs) | Reduce TTS cost by 40% | 2 |
| Self-hosted STT (Whisper) fallback | Reduce STT cost for non-premium | 2 |
| Fine-tuned smaller DM model | Reduce LLM cost by 50%+ | 3 |

## Discord Premium Apps Revenue Share

Discord takes a **commission** on Premium Apps revenue:

- **Web/Desktop purchases**: 70% to developer (30% Discord fee)
- **iOS/Android**: 52% to developer (Discord + Apple/Google fees)

### Effective Revenue Per Tier

| Tier | Price | Web Revenue | Mobile Revenue |
|------|-------|-------------|----------------|
| Adventurer | $9.99 | $6.99 | $5.19 |
| Hero | $19.99 | $13.99 | $10.39 |
| Legend | $39.99 | $27.99 | $20.79 |

## See Also

- [Subscription Tiers (API Schema)](../api/schemas.md)
- [Infrastructure & Scaling](../infrastructure/deployment.md)
- [Development Roadmap](../development/roadmap.md)
