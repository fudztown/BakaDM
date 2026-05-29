# Development Roadmap

> **Phased Rollout Plan**

## Phase Overview

| Phase | Name | Duration | Goal |
|-------|------|----------|------|
| **0** | MVP | 4-6 weeks | Text-only Discord Bot + Supabase |
| **1** | Voice Alpha | 4-6 weeks | Add voice pipeline (STT/TTS) |
| **2** | Activity Beta | 6-8 weeks | Discord Activity UI + combat |
| **3** | Launch | 4-6 weeks | Monetization + polish + public launch |

---

## Phase 0 — MVP (Text-Only Bot)

**Goal**: Playable D&D sessions via Discord text commands.

### Deliverables

- [ ] Discord Bot (Python/discord.py) with slash commands
  - [ ] `/summon-dm`, `/dismiss-dm` (text-only, no voice yet)
  - [ ] `/campaign create/list/load`
  - [ ] `/roll <dice>`
  - [ ] Free-text message processing (bot mentions)
- [ ] Supabase schema deployed (users, campaigns, characters, sessions, messages)
- [ ] Abacus Claw integration
  - [ ] DM persona system prompt
  - [ ] Basic tools: `dice_roll`, `lookup_spell`, `lookup_monster`
  - [ ] Campaign memory via Qdrant (campaign_lore collection)
- [ ] Backend API (Next.js) — core endpoints
  - [ ] `POST /api/sessions/:id/message`
  - [ ] Campaign/session/character CRUD
- [ ] Usage tracking (basic — log token usage per session)
- [ ] Deploy: Bot on VPS, API on Vercel, DB on Supabase

### Success Criteria

- Complete a 30-minute D&D session via text
- DM correctly references campaign lore from previous sessions
- Dice rolls and rules lookups work via Claw tools
- 3+ testers play without critical bugs

---

## Phase 1 — Voice Alpha

**Goal**: Players can speak to the DM and hear voiced responses.

### Deliverables

- [ ] Voice pipeline integration
  - [ ] Bot joins/leaves voice channels on demand
  - [ ] STT: ElevenLabs Scribe v2 integration
  - [ ] TTS: ElevenLabs streaming playback
  - [ ] VAD (Voice Activity Detection)
  - [ ] Speaker identification (Discord user → character)
- [ ] Interruption handling (stop TTS when player speaks)
- [ ] Fallback: text mode when voice fails
- [ ] Voice usage metering (STT minutes, TTS characters)
- [ ] Character-specific NPC voices (2-3 voice presets)
- [ ] Performance optimization
  - [ ] Target <2s end-to-end latency (speak → hear response)
  - [ ] Context window management (rolling summarization)

### Success Criteria

- Full voice conversation with DM (speak → hear response)
- End-to-end latency <2.5s (first audio chunk)
- Voice pipeline stable for 2+ hour sessions
- 5+ testers validate voice quality

---

## Phase 2 — Activity Beta

**Goal**: Rich game UI embedded in Discord via Activities.

### Deliverables

- [ ] Discord Activity (Embedded App)
  - [ ] Discord SDK integration and OAuth flow
  - [ ] Campaign lobby / dashboard
  - [ ] Port components from `cr-campaign-simulator`:
    - [ ] GameMap (with real-time multi-player sync)
    - [ ] CombatTracker (initiative, HP, conditions)
    - [ ] CharacterSheet (view/edit)
    - [ ] DiceRoller (animated, shared visibility)
    - [ ] NarrativeLog (streaming DM responses)
  - [ ] Real-time sync via Supabase Realtime
- [ ] Combat system
  - [ ] Initiative tracking (auto-roll via Claw)
  - [ ] Turn-based combat flow
  - [ ] Monster stat blocks (Open5e integration)
  - [ ] Area of effect / targeting
- [ ] Map system
  - [ ] Token-based map with grid
  - [ ] Fog of war (DM-controlled visibility)
  - [ ] Map presets for common dungeon layouts
- [ ] Mobile-responsive design (Discord mobile)
- [ ] PiP (picture-in-picture) minimal mode

### Success Criteria

- Full combat encounter with map + initiative tracker
- All players see real-time state updates
- Activity works on Discord desktop and mobile
- Seamless transition between voice and UI interaction

---

## Phase 3 — Launch

**Goal**: Public launch with monetization and production polish.

### Deliverables

- [ ] Discord Premium Apps integration
  - [ ] Subscription tier SKUs (Free, Adventurer, Hero, Legend)
  - [ ] Usage limit enforcement
  - [ ] Upgrade/downgrade flows
- [ ] User onboarding
  - [ ] Interactive tutorial campaign ("The Tutorial Tavern")
  - [ ] Character creation wizard
  - [ ] Quick-start pre-built campaigns
- [ ] Admin & analytics
  - [ ] Usage dashboard for players
  - [ ] Admin dashboard for monitoring
  - [ ] Cost tracking and alerting
- [ ] Production hardening
  - [ ] Bot sharding (AutoShardedClient)
  - [ ] Rate limiting and abuse prevention
  - [ ] Error monitoring (Sentry)
  - [ ] Automated backups (Supabase)
  - [ ] Load testing (simulate 100+ concurrent sessions)
- [ ] Content
  - [ ] 5+ pre-built campaign templates
  - [ ] 20+ NPC voice presets
  - [ ] Campaign import (basic module support)
- [ ] Legal
  - [ ] Terms of service
  - [ ] Privacy policy
  - [ ] D&D 5e SRD compliance review

### Success Criteria

- Discord App Directory listing approved
- Subscription purchase flow works end-to-end
- Handle 100+ concurrent sessions without degradation
- <1% error rate across all API endpoints
- NPS score >40 from beta testers

---

## Future Considerations (Post-Launch)

| Feature | Description | Priority |
|---------|-------------|----------|
| AI-generated maps | Use image models to create battle maps | Medium |
| Campaign sharing | Share/fork public campaigns | Medium |
| DM marketplace | Community-created DM personas and campaigns | Low |
| Twitch integration | Stream D&D sessions with overlay | Low |
| Multi-language | Localize DM responses (French, Spanish, etc.) | Low |
| Fine-tuned DM model | Train specialized D&D model for cost reduction | High |
| Mobile companion app | Standalone app for character management | Low |

---

## Development Guidelines

### Branch Strategy

```
main          ← Production (auto-deploys to Vercel)
├── develop   ← Integration branch
├── feat/*    ← Feature branches
├── fix/*     ← Bug fix branches
└── docs/*    ← Documentation updates
```

### Code Standards

- **TypeScript** strict mode for all Next.js code
- **Python** type hints + mypy for Discord Bot
- **Formatting**: Prettier (TS), Black (Python)
- **Linting**: ESLint (TS), Ruff (Python)
- **Testing**: Vitest (TS), pytest (Python)

### Documentation Updates

This design repository should be updated whenever:

1. A new architectural decision is made
2. API endpoints are added or changed
3. Data models are modified
4. Cost estimates are revised
5. Roadmap milestones are completed

## See Also

- [Architecture Overview](../architecture/overview.md)
- [Cost Analysis](../cost-analysis/usage-metering.md)
- [Infrastructure](../infrastructure/deployment.md)
