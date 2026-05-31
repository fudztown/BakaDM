// ============================================================
// BakaDM Dashboard Configuration
// Update these values as your project evolves.
// ============================================================

const CONFIG = {
  // GitHub repository
  repo: {
    owner: "fudztown",
    repo:  "BakaDM",
  },

  // GitHub personal access token (optional but raises rate limits from 60/hr to 5,000/hr).
  // Leave empty to use unauthenticated requests (public repos only).
  // If you add a token, keep this file private or load it from env at build time.
  githubToken: "",

  // Environments — add URLs as they become available.
  environments: [
    {
      name: "🧪 Development",
      desc: "Local / dev bot instance",
      url:  "",               // e.g. "http://localhost:3000"
      healthUrl: "",          // e.g. "http://localhost:3000/health"
    },
    {
      name: "🚀 Staging",
      desc: "Staging bot / preview deployments",
      url:  "",               // e.g. "https://staging.bakadm.vercel.app"
      healthUrl: "",          // e.g. "https://staging.bakadm.vercel.app/api/health"
    },
    {
      name: "🏭 Production",
      desc: "Live Discord bot & Activity",
      url:  "",               // e.g. "https://bakadm.vercel.app"
      healthUrl: "",          // e.g. "https://bakadm.vercel.app/api/health"
    },
  ],

  // Services — add health-check endpoints as they become available.
  services: [
    {
      name: "🤖 Discord Bot",
      desc: "Bot gateway / heartbeat endpoint",
      healthUrl: "",          // e.g. "https://api.bakadm.com/health/bot"
    },
    {
      name: "🌐 Vercel API",
      desc: "Next.js API routes health",
      healthUrl: "",          // e.g. "https://bakadm.vercel.app/api/health"
    },
    {
      name: "🗄️ Supabase",
      desc: "PostgreSQL / Auth status",
      healthUrl: "",          // e.g. "https://your-project.supabase.co/rest/v1/"
    },
    {
      name: "🔍 Qdrant",
      desc: "Vector store health",
      healthUrl: "",          // e.g. "https://qdrant.bakadm.com:6333/healthz"
    },
  ],

  // Polling intervals (ms)
  poll: {
    github: 120_000,   // 2 minutes
    health: 30_000,    // 30 seconds
  },
};
