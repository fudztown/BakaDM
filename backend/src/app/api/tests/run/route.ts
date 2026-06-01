import { NextRequest } from "next/server";
import { success, error } from "@/lib/response";
import { ApiError } from "@/lib/errors";
import { validateBotAuth } from "@/lib/auth";
import {
  startTestRun,
  addTestSuite,
  addTestResult,
  completeTestRun,
  getLatestTestRun,
  getAllTestRuns,
  getTestStats,
  getAllBugs,
  getBugsByStatus,
  createBug,
  updateBugStatus,
  type TestRunSummary,
  type BugReport,
} from "@/lib/testRunner";

/**
 * POST /api/tests/run
 * Trigger a test run and return results
 */
export async function POST(request: NextRequest) {
  try {
    validateBotAuth(request);

    const body = await request.json();
    const { suites = ["all"] } = body;

    // Start test run
    const run = startTestRun();

    // Run API health tests
    const apiSuite = addTestSuite({
      name: "API Health",
      description: "Test all API endpoints",
      status: "running",
    });

    // Test /api/health
    const healthStart = performance.now();
    try {
      const healthRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/health`, {
        headers: { "x-bot-api-key": process.env.BOT_API_KEY || "" },
      });
      
      if (healthRes.ok) {
        addTestResult(apiSuite.id, {
          name: "GET /api/health",
          suite: apiSuite.name,
          status: "passed",
          duration: Math.round(performance.now() - healthStart),
        });
      } else {
        addTestResult(apiSuite.id, {
          name: "GET /api/health",
          suite: apiSuite.name,
          status: "failed",
          duration: Math.round(performance.now() - healthStart),
          error: `HTTP ${healthRes.status}`,
        });
      }
    } catch (err) {
      addTestResult(apiSuite.id, {
        name: "GET /api/health",
        suite: apiSuite.name,
        status: "failed",
        duration: Math.round(performance.now() - healthStart),
        error: err instanceof Error ? err.message : String(err),
      });
    }

    // Test /api/campaigns
    const campaignsStart = performance.now();
    try {
      const campaignsRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/campaigns`, {
        headers: { "x-bot-api-key": process.env.BOT_API_KEY || "" },
      });
      
      if (campaignsRes.ok) {
        addTestResult(apiSuite.id, {
          name: "GET /api/campaigns",
          suite: apiSuite.name,
          status: "passed",
          duration: Math.round(performance.now() - campaignsStart),
        });
      } else {
        addTestResult(apiSuite.id, {
          name: "GET /api/campaigns",
          suite: apiSuite.name,
          status: "failed",
          duration: Math.round(performance.now() - campaignsStart),
          error: `HTTP ${campaignsRes.status}`,
        });
      }
    } catch (err) {
      addTestResult(apiSuite.id, {
        name: "GET /api/campaigns",
        suite: apiSuite.name,
        status: "failed",
        duration: Math.round(performance.now() - campaignsStart),
        error: err instanceof Error ? err.message : String(err),
      });
    }

    // Test POST /api/campaigns
    const createCampaignStart = performance.now();
    try {
      const createRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-bot-api-key": process.env.BOT_API_KEY || "",
        },
        body: JSON.stringify({
          name: "Test Campaign",
          guild_id: "test_guild_123",
          description: "Test campaign for validation",
        }),
      });
      
      if (createRes.ok) {
        addTestResult(apiSuite.id, {
          name: "POST /api/campaigns",
          suite: apiSuite.name,
          status: "passed",
          duration: Math.round(performance.now() - createCampaignStart),
        });
      } else {
        addTestResult(apiSuite.id, {
          name: "POST /api/campaigns",
          suite: apiSuite.name,
          status: "failed",
          duration: Math.round(performance.now() - createCampaignStart),
          error: `HTTP ${createRes.status}`,
        });
      }
    } catch (err) {
      addTestResult(apiSuite.id, {
        name: "POST /api/campaigns",
        suite: apiSuite.name,
        status: "failed",
        duration: Math.round(performance.now() - createCampaignStart),
        error: err instanceof Error ? err.message : String(err),
      });
    }

    // Test dice roll endpoint
    const diceStart = performance.now();
    try {
      const diceRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/dice/roll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-bot-api-key": process.env.BOT_API_KEY || "",
        },
        body: JSON.stringify({
          expression: "1d20",
          rolls: [15],
          total: 15,
          roller_id: "test_user",
          roller_name: "Test User",
        }),
      });
      
      if (diceRes.ok) {
        addTestResult(apiSuite.id, {
          name: "POST /api/dice/roll",
          suite: apiSuite.name,
          status: "passed",
          duration: Math.round(performance.now() - diceStart),
        });
      } else {
        addTestResult(apiSuite.id, {
          name: "POST /api/dice/roll",
          suite: apiSuite.name,
          status: "failed",
          duration: Math.round(performance.now() - diceStart),
          error: `HTTP ${diceRes.status}`,
        });
      }
    } catch (err) {
      addTestResult(apiSuite.id, {
        name: "POST /api/dice/roll",
        suite: apiSuite.name,
        status: "failed",
        duration: Math.round(performance.now() - diceStart),
        error: err instanceof Error ? err.message : String(err),
      });
    }

    // Complete the run
    const completedRun = completeTestRun();

    return success({
      run: completedRun,
      message: `Test run completed: ${completedRun?.passed || 0} passed, ${completedRun?.failed || 0} failed`,
    });
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}

/**
 * GET /api/tests/run
 * Get latest test run results
 */
export async function GET(request: NextRequest) {
  try {
    validateBotAuth(request);

    const latestRun = getLatestTestRun();
    const stats = getTestStats();
    const allBugs = getAllBugs();

    return success({
      latestRun,
      stats,
      bugs: allBugs,
    });
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}
