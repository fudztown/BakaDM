# BakaDM Release Workflow

## Branch Strategy

| Branch | Purpose | Vercel Target | Deploy |
|--------|---------|--------------|--------|
| `main` | Development | Preview (dev) | Auto |
| `uat` | UAT Testing | Preview (UAT) | Auto |
| `production` | Live | Production | **Approval Required** |

## GitHub Environments Setup

Configure these in **GitHub → Settings → Environments**:

### 1. `production` Environment
- **Required reviewers:** Add yourself
- **Deployment branches:** `production`
- This creates the approval gate

### 2. `uat` Environment
- **Required reviewers:** None (optional)
- **Deployment branches:** `uat`

### 3. `development` Environment
- **Required reviewers:** None
- **Deployment branches:** `main`

## Release Flow

```
Feature Branch
      |
      v
  PR to main
      |
      v
  Merge → Dev deploy (auto)
      |
      v
  PR to uat (when ready for testing)
      |
      v
  Merge → UAT deploy (auto)
      |
      v
  PR to production (when approved)
      |
      v
  Merge → Production deploy (awaits approval)
      |
      v
  Approve in GitHub Actions → Live
```

## Workflow Features

- **CI Gate:** All deployments require lint + type-check to pass first
- **Production Approval:** Workflow pauses for manual approval before Vercel production deploy
- **PR Previews:** Every PR gets a unique preview URL commented automatically
- **Environment URLs:** Each deployment links to its environment in GitHub Actions

## Files Changed

| File | Change |
|------|--------|
| `.github/workflows/deploy-vercel.yml` | Multi-environment deploy with approval gates |
| `.github/workflows/ci.yml` | Updated branches: main/uat/production |
| `.github/workflows/README.md` | Documentation for setup |
