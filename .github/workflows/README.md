# GitHub Actions Workflows

## Required Secrets

Configure these in **GitHub → Settings → Secrets and variables → Actions**:

### Vercel Deployment
| Secret | How to get it |
|--------|---------------|
| `VERCEL_TOKEN` | Vercel Dashboard → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | `vercel teams list` or from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `vercel project list` or from `.vercel/project.json` |

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
