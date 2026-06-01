# GitHub Actions Workflows

## Branch Strategy

| Branch | Purpose | Vercel Environment | Auto-Deploy |
|--------|---------|-------------------|-------------|
| `main` | Active development | Preview (dev) | ✅ Yes |
| `uat` | User Acceptance Testing | Preview (UAT) | ✅ Yes |
| `production` | Live releases | Production | ⚠️ Requires approval |
| PRs | Feature review | Preview | ✅ Yes |

## Release Flow

```
feature branch → PR → main (dev preview)
                      ↓
                PR → uat (UAT testing)
                      ↓
                PR → production (requires approval)
```

## Required Secrets

| Secret | Source | Where |
|--------|--------|-------|
| `VERCEL_TOKEN` | Vercel Dashboard → Settings → Tokens | GitHub Secrets |

> **Note:** `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are hardcoded in the workflow.

## GitHub Environments (for Approval Gates)

You must configure these in **GitHub Settings → Environments**:

### 1. `production` Environment
- **Required reviewers:** Add yourself (and any other admins)
- **Protection rules:** 
  - Wait timer: 0 minutes
  - Deployment branches: `production`

### 2. `uat` Environment
- **Required reviewers:** Optional (can auto-deploy)
- **Deployment branches:** `uat`

### 3. `development` Environment
- **Required reviewers:** None
- **Deployment branches:** `main`

## Workflows

| File | Triggers | Purpose |
|------|----------|---------|
| `ci.yml` | Push/PR to any branch | Lint & type-check |
| `deploy-vercel.yml` | Push to `main`/`uat`/`production`, PRs | Deploy to Vercel |
| `bot-deploy.yml` | Push to `main` (bot changes) | Deploy bot to VPS |

## How Production Approval Works

1. Code is merged into `production` branch
2. GitHub Actions workflow starts
3. **Pauses** at the `production` environment gate
4. You receive a notification (email/GitHub) to approve
5. Click **Approve and deploy** in GitHub Actions
6. Vercel production deploy proceeds

## Environment Variables on Vercel

| Variable | Value | Environments |
|----------|-------|--------------|
| `NEXT_PUBLIC_PROD_URL` | `https://bakadm.vercel.app` | Production, Preview |
| `NEXT_PUBLIC_STAGING_URL` | `https://staging.bakadm.vercel.app` | Production, Preview |
| `NEXT_PUBLIC_BOT_HEALTH_URL` | (your bot endpoint) | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_URL` | (your Supabase URL) | Production, Preview |
| `NEXT_PUBLIC_QDRANT_HEALTH_URL` | (your Qdrant URL) | Production, Preview |
