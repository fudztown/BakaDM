# Vercel + GitHub Actions Setup Guide

## ✅ What's Already Configured

| Item | Status |
|------|--------|
| Vercel Project ID | `prj_fahq2jYIUpkSwPT8evg4e8Zvb0hq` (hardcoded in workflow) |
| GitHub Actions workflows | Created and pushed |
| Monitoring dashboard | `/monitoring` route in Next.js app |

---

## 🔐 Required GitHub Secret

You only need **ONE** secret now:

### `VERCEL_TOKEN`

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click **Create Token**
3. Name it `GitHub Actions`
4. Scope: Select your BakaDM project
5. Copy the token

Then add it to GitHub:
- Go to `https://github.com/fudztown/BakaDM/settings/secrets/actions`
- Click **New repository secret**
- Name: `VERCEL_TOKEN`
- Value: (paste the token)

---

## 🔧 Optional: Vercel Org ID

If your account is part of a team/org, you may also need `VERCEL_ORG_ID`:

```bash
# Install Vercel CLI locally
npm i -g vercel

# Login
vercel login

# Link to project (run in backend/ directory)
cd backend
vercel link

# Check the generated .vercel/project.json
cat .vercel/project.json
```

If `orgId` is different from your personal account, add it as `VERCEL_ORG_ID` secret.

For personal accounts, the workflow should work without it.

---

## 🚀 How Deployment Works

| Branch | Trigger | Environment |
|--------|---------|-------------|
| `main` | Push | **Production** |
| `staging` | Push | Preview (treated as staging) |
| Any PR | Pull request | Preview deployment |

---

## 🧪 Testing the Pipeline

1. Merge the `feature/discord-bot-foundation` branch into `main` via PR
2. The `ci.yml` workflow will run first (lint + type-check)
3. On merge, `deploy-vercel.yml` will deploy to production
4. Visit your Vercel dashboard to see the deployment

---

## 📝 Environment Variables for Monitoring

Add these in **Vercel Dashboard → Project Settings → Environment Variables**:

| Variable | Example Value | Environments |
|----------|---------------|--------------|
| `NEXT_PUBLIC_STAGING_URL` | `https://staging.bakadm.vercel.app` | Production, Preview |
| `NEXT_PUBLIC_PROD_URL` | `https://bakadm.vercel.app` | Production, Preview |
| `NEXT_PUBLIC_BOT_HEALTH_URL` | (your bot endpoint) | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview |
| `NEXT_PUBLIC_QDRANT_HEALTH_URL` | (your Qdrant endpoint) | Production, Preview |

---

## 🐛 Troubleshooting

### "Project not found" error
- Make sure `VERCEL_ORG_ID` is set if you're in a team
- Verify the project ID is correct in Vercel dashboard

### "Authentication error"
- `VERCEL_TOKEN` is missing or expired
- Regenerate the token and update the secret

### Build fails
- Check the build logs in GitHub Actions
- Ensure `backend/package.json` has all dependencies
