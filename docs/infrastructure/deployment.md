# Infrastructure & Deployment

> **Hosting, Scaling, and DevOps**

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Vercel                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Next.js App (Discord Activity + Backend API)    │    │
│  │  - Serverless Functions (API Routes)             │    │
│  │  - Edge Runtime (static/SSR pages)               │    │
│  │  - WebSocket via Supabase Realtime               │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  Hostinger VPS                           │
│  ┌──────────────────┐  ┌──────────────────────────┐    │
│  │  Discord Bot      │  │  n8n Workflows            │    │
│  │  (Python)         │  │  - D&D Critical Role Sim  │    │
│  │  - discord.py     │  │  - Cursor-Rome Bridge     │    │
│  │  - STT/TTS        │  │  - Transcript Processor   │    │
│  └──────────────────┘  └──────────────────────────┘    │
│                                                          │
│  ┌──────────────────┐                                   │
│  │  Qdrant           │                                   │
│  │  Vector DB        │                                   │
│  └──────────────────┘                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  Managed Services                        │
│                                                          │
│  Supabase  │  Abacus AI (Claw)  │  ElevenLabs  │  OpenAI│
│  Postgres  │  Agent Brain       │  TTS / STT   │  Embed │
│  Auth      │  RAG               │  Voices      │        │
│  Realtime  │  Tools             │              │        │
└─────────────────────────────────────────────────────────┘
```

## Service Hosting

| Service | Host | Runtime | Scaling |
|---------|------|---------|---------|
| Discord Activity (UI) | Vercel | Edge/Serverless | Auto-scale |
| Backend API | Vercel | Serverless Functions | Auto-scale |
| Discord Bot | Hostinger VPS | Python process | Manual → Sharding |
| n8n Workflows | Hostinger VPS | Node.js (n8n) | Manual |
| Qdrant | Hostinger VPS | Docker container | Manual → Qdrant Cloud |
| PostgreSQL | Supabase | Managed | Auto-scale (Supabase tiers) |
| Claw Agent | Abacus AI | Managed | Auto-scale |

## Environment Configuration

### Vercel (Next.js)

```env
# Discord
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
NEXT_PUBLIC_DISCORD_CLIENT_ID=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Abacus AI
ABACUS_API_KEY=
CLAW_DEPLOYMENT_ID=

# Bot Communication
BOT_API_KEY=              # Shared secret for bot → API auth
BOT_WEBHOOK_SECRET=       # HMAC signing for webhook payloads
```

### Hostinger VPS (Discord Bot)

```env
# Discord
DISCORD_BOT_TOKEN=
DISCORD_APP_ID=

# Backend API
BACKEND_API_URL=https://api.dnd-ai-dm.vercel.app
BACKEND_API_KEY=

# Voice Pipeline
ELEVENLABS_API_KEY=
CARTESIA_API_KEY=

# Qdrant (local)
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# OpenAI (embeddings)
OPENAI_API_KEY=
```

## Deployment Pipeline

### Phase 0 (MVP)

```
GitHub Push → Vercel Auto-Deploy (Next.js)
GitHub Push → SSH to VPS → Docker Compose restart (Bot + Qdrant)
```

### Phase 2+ (Production)

```
GitHub Push → CI/CD (GitHub Actions)
    ├── Lint + Type Check + Unit Tests
    ├── Vercel Deploy (Preview → Production)
    ├── Bot Docker Image → Container Registry
    └── Deploy Bot to VPS (or Kubernetes)
```

## Docker Configuration

### Discord Bot

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system deps for audio processing
RUN apt-get update && apt-get install -y \
    libffi-dev \
    libopus0 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "-m", "bot.main"]
```

### Docker Compose (VPS)

```yaml
version: "3.8"

services:
  bot:
    build: ./bot
    restart: unless-stopped
    env_file: .env
    depends_on:
      - qdrant
    volumes:
      - ./bot-data:/app/data

  qdrant:
    image: qdrant/qdrant:latest
    restart: unless-stopped
    ports:
      - "6333:6333"
    volumes:
      - qdrant-data:/qdrant/storage

  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    ports:
      - "5678:5678"
    volumes:
      - n8n-data:/home/node/.n8n
    env_file: .env.n8n

volumes:
  qdrant-data:
  n8n-data:
```

## Monitoring & Observability

| Tool | Purpose | Phase |
|------|---------|-------|
| Vercel Analytics | API latency, error rates | 0 |
| Supabase Dashboard | DB metrics, query performance | 0 |
| Sentry | Error tracking (Bot + API) | 1 |
| Grafana + Prometheus | Custom metrics (voice latency, Claw costs) | 2 |
| Discord Bot status page | Public uptime monitoring | 2 |

## Scaling Plan

| Phase | Users | Bot Instances | DB | Qdrant |
|-------|-------|--------------|-----|--------|
| 0 (MVP) | <50 | 1 (VPS) | Supabase Free | VPS Docker |
| 1 (Alpha) | <500 | 1 (VPS) | Supabase Pro | VPS Docker |
| 2 (Beta) | <5,000 | 2-5 (Sharded) | Supabase Pro | Qdrant Cloud |
| 3 (Launch) | 10,000+ | Auto-sharded (K8s) | Supabase Team | Qdrant Cloud |

## See Also

- [Architecture Overview](../architecture/overview.md)
- [Cost Analysis](../cost-analysis/usage-metering.md)
- [Development Roadmap](../development/roadmap.md)
