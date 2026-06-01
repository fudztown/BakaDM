"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TestStatus = "passed" | "failed" | "skipped" | "running" | "pending";
type BugSeverity = "critical" | "high" | "medium" | "low";
type BugStatus = "open" | "in_progress" | "resolved" | "closed";

interface TestResult {
  id: string;
  name: string;
  status: TestStatus;
  duration: number;
  error?: string;
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  status: TestStatus;
  tests: TestResult[];
  totalDuration: number;
}

interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: BugSeverity;
  status: BugStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
}

interface TestRunSummary {
  runId: string;
  startedAt: string;
  completedAt?: string;
  suites: TestSuite[];
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  bugs: BugReport[];
  overallStatus: TestStatus;
}

interface TestStats {
  totalRuns: number;
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  totalBugs: number;
  openBugs: number;
  resolvedBugs: number;
  passRate: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function statusColor(status: TestStatus): string {
  switch (status) {
    case "passed":
      return "bg-emerald-500 text-emerald-400 ring-emerald-500/20";
    case "failed":
      return "bg-rose-500 text-rose-400 ring-rose-500/20";
    case "skipped":
      return "bg-zinc-500 text-zinc-400 ring-zinc-500/20";
    case "running":
      return "bg-blue-500 text-blue-400 ring-blue-500/20";
    default:
      return "bg-zinc-500 text-zinc-400 ring-zinc-500/20";
  }
}

function statusDot(status: TestStatus): string {
  switch (status) {
    case "passed":
      return "bg-emerald-400";
    case "failed":
      return "bg-rose-400";
    case "skipped":
      return "bg-zinc-400";
    case "running":
      return "bg-blue-400 animate-pulse";
    default:
      return "bg-zinc-400";
  }
}

function statusLabel(status: TestStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function severityColor(severity: BugSeverity): string {
  switch (severity) {
    case "critical":
      return "bg-rose-500/20 text-rose-400 ring-rose-500/20";
    case "high":
      return "bg-orange-500/20 text-orange-400 ring-orange-500/20";
    case "medium":
      return "bg-amber-500/20 text-amber-400 ring-amber-500/20";
    case "low":
      return "bg-zinc-500/20 text-zinc-400 ring-zinc-500/20";
  }
}

function bugStatusColor(status: BugStatus): string {
  switch (status) {
    case "open":
      return "bg-rose-500/20 text-rose-400";
    case "in_progress":
      return "bg-blue-500/20 text-blue-400";
    case "resolved":
      return "bg-emerald-500/20 text-emerald-400";
    case "closed":
      return "bg-zinc-500/20 text-zinc-400";
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: TestStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColor(status)}`}
    >
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${statusDot(status)}`} />
      {statusLabel(status)}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: BugSeverity }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${severityColor(severity)}`}
    >
      {severity}
    </span>
  );
}

function BugStatusBadge({ status }: { status: BugStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${bugStatusColor(status)}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function TestResultRow({ result }: { result: TestResult }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
      <div className="flex items-center gap-3">
        <span className={`h-2 w-2 rounded-full ${statusDot(result.status)}`} />
        <span className="text-sm text-zinc-300">{result.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500 font-mono">{formatDuration(result.duration)}</span>
        <StatusBadge status={result.status} />
      </div>
    </div>
  );
}

function TestSuiteCard({ suite }: { suite: TestSuite }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <StatusBadge status={suite.status} />
          <div className="text-left">
            <h3 className="font-semibold text-white text-sm">{suite.name}</h3>
            <p className="text-xs text-zinc-500">{suite.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">
            {suite.tests.filter((t) => t.status === "passed").length}/{suite.tests.length} passed
          </span>
          <span className="text-xs text-zinc-500 font-mono">{formatDuration(suite.totalDuration)}</span>
          <svg
            className={`w-4 h-4 text-zinc-500 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-1">
          {suite.tests.map((test) => (
            <TestResultRow key={test.id} result={test} />
          ))}
        </div>
      )}
    </div>
  );
}

function BugCard({ bug }: { bug: BugReport }) {
  return (
    <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-4 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <SeverityBadge severity={bug.severity} />
            <BugStatusBadge status={bug.status} />
          </div>
          <h3 className="font-semibold text-white text-sm truncate">{bug.title}</h3>
          <p className="text-xs text-zinc-500 mt-1">{bug.source}</p>
        </div>
      </div>
      <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{bug.description}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-zinc-600">{formatDate(bug.createdAt)}</span>
        <span className="text-xs text-zinc-600">Updated: {formatDate(bug.updatedAt)}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard                                                     */
/* ------------------------------------------------------------------ */

export default function TestDashboard() {
  const [latestRun, setLatestRun] = useState<TestRunSummary | null>(null);
  const [stats, setStats] = useState<TestStats | null>(null);
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"tests" | "bugs">("tests");

  async function fetchData() {
    try {
      const res = await fetch("/api/tests/run", {
        headers: {
          "x-bot-api-key": process.env.NEXT_PUBLIC_BOT_API_KEY || "",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setLatestRun(data.latestRun);
        setStats(data.stats);
        setBugs(data.bugs || []);
        setLastUpdated(new Date().toISOString());
      }
    } catch (err) {
      console.error("Failed to fetch test data:", err);
    }
  }

  async function runTests() {
    setIsRunning(true);
    try {
      const res = await fetch("/api/tests/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-bot-api-key": process.env.NEXT_PUBLIC_BOT_API_KEY || "",
        },
        body: JSON.stringify({ suites: ["all"] }),
      });
      if (res.ok) {
        const data = await res.json();
        setLatestRun(data.run);
        setBugs(data.run.bugs || []);
        setLastUpdated(new Date().toISOString());
      }
    } catch (err) {
      console.error("Failed to run tests:", err);
    }
    setIsRunning(false);
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
          <div className="text-2xl font-bold text-white">{stats?.passRate ?? 0}%</div>
          <div className="text-xs text-zinc-500">Pass Rate</div>
        </div>
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
          <div className="text-2xl font-bold text-emerald-400">{stats?.totalPassed ?? 0}</div>
          <div className="text-xs text-zinc-500">Tests Passed</div>
        </div>
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
          <div className="text-2xl font-bold text-rose-400">{stats?.openBugs ?? 0}</div>
          <div className="text-xs text-zinc-500">Open Bugs</div>
        </div>
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
          <div className="text-2xl font-bold text-white">{stats?.totalRuns ?? 0}</div>
          <div className="text-xs text-zinc-500">Test Runs</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-zinc-900 border border-zinc-800 p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("tests")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "tests"
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Test Results
          </button>
          <button
            onClick={() => setActiveTab("bugs")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "bugs"
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Bugs ({bugs.filter((b) => b.status === "open").length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-zinc-500">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchData}
            disabled={isRunning}
            className="inline-flex items-center rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={runTests}
            disabled={isRunning}
            className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
          >
            {isRunning ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Running...
              </>
            ) : (
              "Run Tests"
            )}
          </button>
        </div>
      </div>

      {/* Latest Run Info */}
      {latestRun && (
        <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusBadge status={latestRun.overallStatus} />
              <span className="text-sm text-zinc-400">
                Run #{latestRun.runId.slice(-6)}
              </span>
            </div>
            <span className="text-xs text-zinc-500">
              {latestRun.completedAt
                ? `Completed: ${formatDate(latestRun.completedAt)}`
                : `Started: ${formatDate(latestRun.startedAt)}`}
            </span>
          </div>
          <div className="flex items-center gap-6 mt-3 text-sm">
            <span className="text-emerald-400">{latestRun.passed} passed</span>
            <span className="text-rose-400">{latestRun.failed} failed</span>
            <span className="text-zinc-500">{latestRun.skipped} skipped</span>
            <span className="text-zinc-500">{latestRun.totalTests} total</span>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === "tests" ? (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">Test Suites</h2>
          {latestRun?.suites.length ? (
            <div className="space-y-3">
              {latestRun.suites.map((suite) => (
                <TestSuiteCard key={suite.id} suite={suite} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500">
              <p>No test runs yet. Click "Run Tests" to start.</p>
            </div>
          )}
        </section>
      ) : (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">Bug Reports</h2>
          {bugs.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bugs.map((bug) => (
                <BugCard key={bug.id} bug={bug} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500">
              <p>No bugs reported. All clear! 🎉</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
