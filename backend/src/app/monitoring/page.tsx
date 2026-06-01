import { Metadata } from "next";
import { Suspense } from "react";
import MonitoringDashboard from "./MonitoringDashboard";
import TestDashboard from "./TestDashboard";

export const metadata: Metadata = {
  title: "BakaDM — Monitoring",
  description: "Real-time environment, service health, and test monitoring",
};

export const revalidate = 0;

export default function MonitoringPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              🎲 BakaDM Monitoring
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Real-time health status, test results, and bug tracking
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
            <a
              href="https://github.com/fudztown/BakaDM"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              GitHub →
            </a>
          </div>
        </header>

        {/* Health Monitoring Section */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-white flex items-center gap-2">
            <span>🩺</span> Health Status
          </h2>
          <Suspense
            fallback={
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-6 animate-pulse"
                  >
                    <div className="h-4 w-24 rounded bg-zinc-800" />
                    <div className="mt-4 h-8 w-16 rounded bg-zinc-800" />
                  </div>
                ))}
              </div>
            }
          >
            <MonitoringDashboard />
          </Suspense>
        </section>

        {/* Test & Bug Tracking Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-white flex items-center gap-2">
            <span>🧪</span> Testing & QA
          </h2>
          <Suspense
            fallback={
              <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-6 animate-pulse">
                <div className="h-4 w-48 rounded bg-zinc-800 mb-4" />
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 rounded bg-zinc-800" />
                  ))}
                </div>
              </div>
            }
          >
            <TestDashboard />
          </Suspense>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-800 mt-12 pt-6 text-center text-xs text-zinc-600">
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
    </main>
  );
}
