# GitHub Actions Workflows

## Required Secrets

Configure these in **GitHub → Settings → Secrets and variables → Actions**:

### Vercel Deployment
| Secret | How to get it |
|--------|---------------|
| `VERCEL_TOKEN` | Vercel Dashboard → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | `vercel teams list` or from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `prj_fahq2jYIUpkSwPT8evg4e8Zvb0hq` (or from `.vercel/project.json`) |

> **Project ID:** `prj_fahq2jYIUpkSwPT8evg4e8Zvb0hq`

### VPS Deployment (Bot)
| Secret | Description |
|--------|-------------|
| `VPS_HOST` | IP or domain of your Hostinger VPS |
| `VPS_USER` | SSH username (e.g. `ubuntu`) |
| `VPS_SSH_KEY` | Private SSH key for the VPS |

## Workflows

| File | Triggers | Purpose |
|------|----------|---------|
| `ci.yml` | Push/PR to `main`/`staging` | Lint & type-check backend + bot |
| `deploy-vercel.yml` | Push to `main`/`staging`, PRs | Deploy Next.js to Vercel (prod/staging/preview) |
| `bot-deploy.yml` | Push to `main` (bot changes) | Build & deploy bot Docker image to VPS |

## Environment Variables for Monitoring

Add these to your **Vercel Project Settings → Environment Variables**:

| Variable | Value | Environments |
|----------|-------|--------------|
| `NEXT_PUBLIC_STAGING_URL` | `https://staging.bakadm.vercel.app` | Production, Preview |
| `NEXT_PUBLIC_PROD_URL` | `https://bakadm.vercel.app` | Production, Preview |
| `NEXT_PUBLIC_BOT_HEALTH_URL` | (your bot health endpoint) | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_URL` | (your Supabase project URL) | Production, Preview |
| `NEXT_PUBLIC_QDRANT_HEALTH_URL` | (your Qdrant health endpoint) | Production, Preview |
