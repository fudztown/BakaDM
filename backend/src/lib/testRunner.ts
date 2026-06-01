/**
 * Test Runner Service
 * Runs test suites, collects results, and tracks bugs
 */

export type TestStatus = "passed" | "failed" | "skipped" | "running" | "pending";

export interface TestResult {
  id: string;
  name: string;
  suite: string;
  status: TestStatus;
  duration: number;
  error?: string;
  stack?: string;
  timestamp: string;
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  status: TestStatus;
  tests: TestResult[];
  startedAt?: string;
  completedAt?: string;
  totalDuration: number;
}

export interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "in_progress" | "resolved" | "closed";
  source: string;
  testId?: string;
  suiteId?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface TestRunSummary {
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

// In-memory store for test results and bugs
const testRuns: Map<string, TestRunSummary> = new Map();
const bugs: Map<string, BugReport> = new Map();
let currentRunId: string | null = null;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Start a new test run
 */
export function startTestRun(): TestRunSummary {
  const runId = generateId();
  const run: TestRunSummary = {
    runId,
    startedAt: new Date().toISOString(),
    suites: [],
    totalTests: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    bugs: [],
    overallStatus: "running",
  };
  testRuns.set(runId, run);
  currentRunId = runId;
  return run;
}

/**
 * Add a test suite to the current run
 */
export function addTestSuite(suite: Omit<TestSuite, "id" | "tests" | "totalDuration">): TestSuite {
  const fullSuite: TestSuite = {
    ...suite,
    id: generateId(),
    tests: [],
    totalDuration: 0,
  };
  
  const run = currentRunId ? testRuns.get(currentRunId) : null;
  if (run) {
    run.suites.push(fullSuite);
  }
  
  return fullSuite;
}

/**
 * Add a test result to a suite
 */
export function addTestResult(
  suiteId: string,
  result: Omit<TestResult, "id" | "timestamp">
): TestResult {
  const fullResult: TestResult = {
    ...result,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  
  const run = currentRunId ? testRuns.get(currentRunId) : null;
  if (run) {
    const suite = run.suites.find((s) => s.id === suiteId);
    if (suite) {
      suite.tests.push(fullResult);
      suite.totalDuration += result.duration;
      
      run.totalTests++;
      if (result.status === "passed") run.passed++;
      else if (result.status === "failed") run.failed++;
      else if (result.status === "skipped") run.skipped++;
      
      // Auto-create bug for failed tests
      if (result.status === "failed") {
        const bug = createBug({
          title: `Test Failure: ${result.name}`,
          description: result.error || "Test failed without error message",
          severity: "high",
          source: `${suite.name} > ${result.name}`,
          testId: fullResult.id,
          suiteId: suite.id,
        });
        run.bugs.push(bug);
      }
    }
  }
  
  return fullResult;
}

/**
 * Complete the current test run
 */
export function completeTestRun(): TestRunSummary | null {
  const run = currentRunId ? testRuns.get(currentRunId) : null;
  if (!run) return null;
  
  run.completedAt = new Date().toISOString();
  run.overallStatus = run.failed > 0 ? "failed" : "passed";
  
  // Update suite statuses
  run.suites.forEach((suite) => {
    if (suite.tests.some((t) => t.status === "failed")) {
      suite.status = "failed";
    } else if (suite.tests.every((t) => t.status === "passed")) {
      suite.status = "passed";
    } else {
      suite.status = "skipped";
    }
  });
  
  return run;
}

/**
 * Create a bug report
 */
export function createBug(
  bug: Omit<BugReport, "id" | "status" | "createdAt" | "updatedAt">
): BugReport {
  const fullBug: BugReport = {
    ...bug,
    id: generateId(),
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  bugs.set(fullBug.id, fullBug);
  return fullBug;
}

/**
 * Update bug status
 */
export function updateBugStatus(
  bugId: string,
  status: BugReport["status"]
): BugReport | null {
  const bug = bugs.get(bugId);
  if (!bug) return null;
  
  bug.status = status;
  bug.updatedAt = new Date().toISOString();
  if (status === "resolved" || status === "closed") {
    bug.resolvedAt = new Date().toISOString();
  }
  
  return bug;
}

/**
 * Get the current or latest test run
 */
export function getLatestTestRun(): TestRunSummary | null {
  if (currentRunId) {
    return testRuns.get(currentRunId) || null;
  }
  
  // Return the most recent completed run
  const runs = Array.from(testRuns.values());
  return runs.sort((a, b) => 
    new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  )[0] || null;
}

/**
 * Get all test runs
 */
export function getAllTestRuns(): TestRunSummary[] {
  return Array.from(testRuns.values()).sort((a, b) =>
    new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}

/**
 * Get all bugs
 */
export function getAllBugs(): BugReport[] {
  return Array.from(bugs.values()).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Get bugs by status
 */
export function getBugsByStatus(status: BugReport["status"]): BugReport[] {
  return getAllBugs().filter((b) => b.status === status);
}

/**
 * Get test run statistics
 */
export function getTestStats() {
  const runs = getAllTestRuns();
  const allBugs = getAllBugs();
  
  return {
    totalRuns: runs.length,
    totalTests: runs.reduce((sum, r) => sum + r.totalTests, 0),
    totalPassed: runs.reduce((sum, r) => sum + r.passed, 0),
    totalFailed: runs.reduce((sum, r) => sum + r.failed, 0),
    totalBugs: allBugs.length,
    openBugs: allBugs.filter((b) => b.status === "open").length,
    resolvedBugs: allBugs.filter((b) => b.status === "resolved").length,
    passRate: runs.length > 0
      ? Math.round(
          (runs.reduce((sum, r) => sum + r.passed, 0) /
            runs.reduce((sum, r) => sum + r.totalTests, 0)) *
            100
        )
      : 0,
  };
}
