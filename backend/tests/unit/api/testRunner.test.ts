/**
 * @jest-environment node
 */
import {
  startTestRun,
  addTestSuite,
  addTestResult,
  completeTestRun,
  createBug,
  updateBugStatus,
  getLatestTestRun,
  getAllTestRuns,
  getTestStats,
  getAllBugs,
  getBugsByStatus,
} from "@/lib/testRunner";

describe("Test Runner", () => {
  beforeEach(() => {
    // Reset state before each test
    jest.clearAllMocks();
  });

  describe("startTestRun", () => {
    it("should create a new test run with initial state", () => {
      const run = startTestRun();

      expect(run.runId).toBeDefined();
      expect(run.startedAt).toBeDefined();
      expect(run.suites).toEqual([]);
      expect(run.totalTests).toBe(0);
      expect(run.passed).toBe(0);
      expect(run.failed).toBe(0);
      expect(run.skipped).toBe(0);
      expect(run.bugs).toEqual([]);
      expect(run.overallStatus).toBe("running");
    });
  });

  describe("addTestSuite", () => {
    it("should add a test suite to the current run", () => {
      startTestRun();
      const suite = addTestSuite({
        name: "API Tests",
        description: "Test API endpoints",
        status: "pending",
      });

      expect(suite.id).toBeDefined();
      expect(suite.name).toBe("API Tests");
      expect(suite.tests).toEqual([]);
      expect(suite.totalDuration).toBe(0);
    });
  });

  describe("addTestResult", () => {
    it("should add a passing test result", () => {
      startTestRun();
      const suite = addTestSuite({
        name: "API Tests",
        description: "Test API endpoints",
        status: "running",
      });

      const result = addTestResult(suite.id, {
        name: "GET /api/health",
        suite: "API Tests",
        status: "passed",
        duration: 50,
      });

      expect(result.id).toBeDefined();
      expect(result.status).toBe("passed");
      expect(result.timestamp).toBeDefined();

      const latestRun = getLatestTestRun();
      expect(latestRun?.passed).toBe(1);
      expect(latestRun?.totalTests).toBe(1);
    });

    it("should add a failing test result and create a bug", () => {
      startTestRun();
      const suite = addTestSuite({
        name: "API Tests",
        description: "Test API endpoints",
        status: "running",
      });

      addTestResult(suite.id, {
        name: "GET /api/health",
        suite: "API Tests",
        status: "failed",
        duration: 100,
        error: "Connection refused",
      });

      const latestRun = getLatestTestRun();
      expect(latestRun?.failed).toBe(1);
      expect(latestRun?.bugs.length).toBe(1);
      expect(latestRun?.bugs[0].title).toBe("Test Failure: GET /api/health");
    });
  });

  describe("completeTestRun", () => {
    it("should mark run as passed when all tests pass", () => {
      startTestRun();
      const suite = addTestSuite({
        name: "API Tests",
        description: "Test API endpoints",
        status: "running",
      });

      addTestResult(suite.id, {
        name: "Test 1",
        suite: "API Tests",
        status: "passed",
        duration: 50,
      });

      const completed = completeTestRun();
      expect(completed?.overallStatus).toBe("passed");
      expect(completed?.completedAt).toBeDefined();
    });

    it("should mark run as failed when any test fails", () => {
      startTestRun();
      const suite = addTestSuite({
        name: "API Tests",
        description: "Test API endpoints",
        status: "running",
      });

      addTestResult(suite.id, {
        name: "Test 1",
        suite: "API Tests",
        status: "passed",
        duration: 50,
      });

      addTestResult(suite.id, {
        name: "Test 2",
        suite: "API Tests",
        status: "failed",
        duration: 100,
        error: "Error",
      });

      const completed = completeTestRun();
      expect(completed?.overallStatus).toBe("failed");
    });
  });

  describe("Bug Management", () => {
    it("should create a bug report", () => {
      const bug = createBug({
        title: "API Error",
        description: "Health endpoint returns 500",
        severity: "critical",
        source: "manual",
      });

      expect(bug.id).toBeDefined();
      expect(bug.status).toBe("open");
      expect(bug.createdAt).toBeDefined();
    });

    it("should update bug status", () => {
      const bug = createBug({
        title: "API Error",
        description: "Health endpoint returns 500",
        severity: "critical",
        source: "manual",
      });

      const updated = updateBugStatus(bug.id, "resolved");
      expect(updated?.status).toBe("resolved");
      expect(updated?.resolvedAt).toBeDefined();
    });

    it("should return null for non-existent bug", () => {
      const updated = updateBugStatus("non-existent", "resolved");
      expect(updated).toBeNull();
    });
  });

  describe("getTestStats", () => {
    it("should calculate statistics correctly", () => {
      startTestRun();
      const suite = addTestSuite({
        name: "API Tests",
        description: "Test API endpoints",
        status: "running",
      });

      addTestResult(suite.id, {
        name: "Test 1",
        suite: "API Tests",
        status: "passed",
        duration: 50,
      });

      addTestResult(suite.id, {
        name: "Test 2",
        suite: "API Tests",
        status: "failed",
        duration: 100,
        error: "Error",
      });

      completeTestRun();

      const stats = getTestStats();
      expect(stats.totalRuns).toBe(1);
      expect(stats.totalTests).toBe(2);
      expect(stats.totalPassed).toBe(1);
      expect(stats.totalFailed).toBe(1);
      expect(stats.totalBugs).toBe(1);
      expect(stats.openBugs).toBe(1);
      expect(stats.passRate).toBe(50);
    });
  });

  describe("getBugsByStatus", () => {
    it("should filter bugs by status", () => {
      createBug({
        title: "Bug 1",
        description: "Description 1",
        severity: "high",
        source: "test",
      });

      const bug2 = createBug({
        title: "Bug 2",
        description: "Description 2",
        severity: "medium",
        source: "test",
      });

      updateBugStatus(bug2.id, "resolved");

      const openBugs = getBugsByStatus("open");
      const resolvedBugs = getBugsByStatus("resolved");

      expect(openBugs.length).toBe(1);
      expect(resolvedBugs.length).toBe(1);
    });
  });
});
