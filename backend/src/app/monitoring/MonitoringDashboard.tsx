"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type EnvStatus = "healthy" | "degraded" | "down" | "unknown";

interface Environment {
  name: string;
  emoji: string;
  desc: string;
  url: string;
  branch: string;
}

interface Service {
  name: string;
  emoji: string;
  desc: string;
  healthUrl: string;
}

interface HealthResult {
  status: EnvStatus;
  latency: number;
  lastChecked: string;
  error?: string;
}

/* ------------------------------------------------------------------ */
/*  Config — update these as your project evolves                     */
/* ------------------------------------------------------------------ */

const ENVIRONMENTS: Environment[] = [
  {
    name: "Development",
    emoji: "🧪",
    desc: "Local / dev bot instance",
    url: "http://localhost:3000",
    branch: "feature/*",
  },
  {
    name: "Staging",
    emoji: "🚀",
    desc: "Staging preview deployments",
    url: process.env.NEXT_PUBLIC_STAGING_URL || "https://staging.bakadm.vercel.app",
    branch: "staging",
  },
  {
    name: "Production",
    emoji: "🏭",
    desc: "Live Discord bot & Activity",
    url: process.env.NEXT_PUBLIC_PROD_URL || "https://bakadm.vercel.app",
    branch: "main",
  },
];

const SERVICES: Service[] = [
  {
    name: "Vercel API",
    emoji: "🌐",
    desc: "Next.js API routes",
    healthUrl: "/api/health",
  },
  {
    name: "Discord Bot",
    emoji: "🤖",
    desc: "Bot gateway / heartbeat",
    healthUrl: process.env.NEXT_PUBLIC_BOT_HEALTH_URL || "",
  },
  {
    name: "Supabase",
    emoji: "🗄️",
    desc: "PostgreSQL / Auth / Realtime",
    healthUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`
      : "",
  },
  {
    name: "Qdrant",
    emoji: "🔍",
    desc: "Vector store",
    healthUrl: process.env.NEXT_PUBLIC_QDRANT_HEALTH_URL || "",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function statusColor(status: EnvStatus): string {
  switch (status) {
    case "healthy":
      return "bg-emerald-500 text-emerald-400 ring-emerald-500/20";
    case "degraded":
      return "bg-amber-500 text-amber-400 ring-amber-500/20";
    case "down":
      return "bg-rose-500 text-rose-400 ring-rose-500/20";
    default:
      return "bg-zinc-500 text-zinc-400 ring-zinc-500/20";
  }
}

function statusDot(status: EnvStatus): string {
  switch (status) {
    case "healthy":
      return "bg-emerald-400";
    case "degraded":
      return "bg-amber-400";
    case "down":
      return "bg-rose-400";
    default:
      return "bg-zinc-400";
  }
}

function statusLabel(status: EnvStatus): string {
  switch (status) {
    case "healthy":
      return "Healthy";
    case "degraded":
      return "Degraded";
    case "down":
      return "Down";
    default:
      return "Unknown";
  }
}

async function checkHealth(url: string): Promise<HealthResult> {
  if (!url) {
    return { status: "unknown", latency: 0, lastChecked: new Date().toISOString() };
  }

  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    const latency = Math.round(performance.now() - start);

    if (res.ok) {
      return { status: "healthy", latency, lastChecked: new Date().toISOString() };
    }
    if (res.status >= 500) {
      return { status: "down", latency, lastChecked: new Date().toISOString() };
    }
    return { status: "degraded", latency, lastChecked: new Date().toISOString() };
  } catch (err) {
    return {
      status: "down",
      latency: Math.round(performance.now() - start),
      lastChecked: new Date().toISOString(),
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: EnvStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColor(status)}`}
    >
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${statusDot(status)}`} />
      {statusLabel(status)}
    </span>
  );
}

function EnvironmentCard({
  env,
  health,
}: {
  env: Environment;
  health: HealthResult | null;
}) {
  return (
    <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-5 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{env.emoji}</span>
          <div>
            <h3 className="font-semibold text-white">{env.name}</h3>
            <p className="text-xs text-zinc-500">{env.desc}</p>
          </div>
        </div>
        <StatusBadge status={health?.status ?? "unknown"} />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">URL</span>
          <a
            href={env.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-white truncate max-w-[200px]"
          >
            {env.url}
          </a>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Branch</span>
          <span className="font-mono text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
            {env.branch}
          </span>
        </div>
        {health && health.latency > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Latency</span>
            <span
              className={`font-mono text-xs ${
                health.latency < 300
                  ? "text-emerald-400"
                  : health.latency < 1000
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {health.latency}ms
            </span>
          </div>
        )}
        {health?.error && (
          <div className="mt-2 rounded bg-rose-500/10 p-2 text-xs text-rose-400">
            {health.error}
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceCard({
  svc,
  health,
}: {
  svc: Service;
  health: HealthResult | null;
}) {
  return (
    <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-5 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{svc.emoji}</span>
          <div>
            <h3 className="font-semibold text-white">{svc.name}</h3>
            <p className="text-xs text-zinc-500">{svc.desc}</p>
          </div>
        </div>
        <StatusBadge status={health?.status ?? "unknown"} />
      </div>

      <div className="mt-4 space-y-2">
        {svc.healthUrl ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Endpoint</span>
            <span className="font-mono text-xs text-zinc-400 truncate max-w-[200px]">
              {svc.healthUrl}
            </span>
          </div>
        ) : (
          <div className="rounded bg-zinc-800/50 p-2 text-xs text-zinc-500">
            Endpoint not configured — set env var to enable monitoring
          </div>
        )}
        {health && health.latency > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Latency</span>
            <span
              className={`font-mono text-xs ${
                health.latency < 300
                  ? "text-emerald-400"
                  : health.latency < 1000
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {health.latency}ms
            </span>
          </div>
        )}
        {health?.error && (
          <div className="mt-2 rounded bg-rose-500/10 p-2 text-xs text-rose-400">
            {health.error}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard                                                     */
/* ------------------------------------------------------------------ */

export default function MonitoringDashboard() {
  const [envHealth, setEnvHealth] = useState<Record<string, HealthResult | null>>({});
  const [svcHealth, setSvcHealth] = useState<Record<string, HealthResult | null>>({});
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isChecking, setIsChecking] = useState(false);

  async function runChecks() {
    setIsChecking(true);
    const now = new Date().toISOString();

    // Check environments
    const envResults: Record<string, HealthResult | null> = {};
    for (const env of ENVIRONMENTS) {
      envResults[env.name] = await checkHealth(env.url);
    }
    setEnvHealth(envResults);

    // Check services
    const svcResults: Record<string, HealthResult | null> = {};
    for (const svc of SERVICES) {
      svcResults[svc.name] = await checkHealth(svc.healthUrl);
    }
    setSvcHealth(svcResults);

    setLastUpdated(now);
    setIsChecking(false);
  }

  useEffect(() => {
    // Defer initial check to avoid cascading renders
    const timer = setTimeout(() => runChecks(), 0);
    const interval = setInterval(runChecks, 30000); // Poll every 30s
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const healthyCount =
    Object.values(envHealth).filter((h) => h?.status === "healthy").length +
    Object.values(svcHealth).filter((h) => h?.status === "healthy").length;

  const totalCount = ENVIRONMENTS.length + SERVICES.length;

  return (
    <div className="space-y-8">
      {/* Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-zinc-900 border border-zinc-800 p-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {healthyCount}/{totalCount}
            </div>
            <div className="text-xs text-zinc-500">Healthy</div>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Object.values(envHealth).filter((h) => h?.status === "down").length +
                Object.values(svcHealth).filter((h) => h?.status === "down").length}
            </div>
            <div className="text-xs text-zinc-500">Down</div>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Object.values(envHealth).filter((h) => h?.status === "unknown").length +
                Object.values(svcHealth).filter((h) => h?.status === "unknown").length}
            </div>
            <div className="text-xs text-zinc-500">Unknown</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-zinc-500">
              Last check: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={runChecks}
            disabled={isChecking}
            className="inline-flex items-center rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            {isChecking ? "Checking..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Environments */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Environments
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ENVIRONMENTS.map((env) => (
            <EnvironmentCard
              key={env.name}
              env={env}
              health={envHealth[env.name] ?? null}
            />
          ))}
        </div>
      </section>

      {/* Services */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Services
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((svc) => (
            <ServiceCard
              key={svc.name}
              svc={svc}
              health={svcHealth[svc.name] ?? null}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 pt-6 text-center text-xs text-zinc-600">
        BakaDM Monitoring · Auto-refreshes every 30 seconds ·
        <a
          href="/api/health"
          target="_blank"
          className="ml-1 text-zinc-500 hover:text-zinc-400"
        >
          API Health →
        </a>
      </footer>
    </div>
  );
}
