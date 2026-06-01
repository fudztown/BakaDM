import { NextRequest } from "next/server";
import { success, error } from "@/lib/response";
import { ApiError } from "@/lib/errors";
import { validateBotAuth } from "@/lib/auth";
import {
  getAllBugs,
  getBugsByStatus,
  createBug,
  updateBugStatus,
  type BugReport,
} from "@/lib/testRunner";

/**
 * GET /api/bugs
 * List all bugs or filter by status
 */
export async function GET(request: NextRequest) {
  try {
    validateBotAuth(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as BugReport["status"] | null;

    const bugs = status ? getBugsByStatus(status) : getAllBugs();

    return success({
      bugs,
      count: bugs.length,
      filter: status || "all",
    });
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}

/**
 * POST /api/bugs
 * Create a new bug report
 */
export async function POST(request: NextRequest) {
  try {
    validateBotAuth(request);

    const body = await request.json();
    const { title, description, severity = "medium", source } = body;

    if (!title || !description) {
      return error(new ApiError("BAD_REQUEST", 400, "title and description are required"));
    }

    const bug = createBug({
      title,
      description,
      severity,
      source: source || "manual",
    });

    return success(bug, 201);
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}
