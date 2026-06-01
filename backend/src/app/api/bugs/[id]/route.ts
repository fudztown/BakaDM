import { NextRequest } from "next/server";
import { success, error } from "@/lib/response";
import { ApiError } from "@/lib/errors";
import { validateBotAuth } from "@/lib/auth";
import { updateBugStatus, getAllBugs } from "@/lib/testRunner";

/**
 * PATCH /api/bugs/:id
 * Update bug status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    validateBotAuth(request);

    const { id: bugId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return error(new ApiError("BAD_REQUEST", 400, "status is required"));
    }

    const updatedBug = updateBugStatus(bugId, status);

    if (!updatedBug) {
      return error(new ApiError("NOT_FOUND", 404, "Bug not found"));
    }

    return success(updatedBug);
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}

/**
 * GET /api/bugs/:id
 * Get a specific bug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    validateBotAuth(request);

    const { id: bugId } = await params;
    const bugs = getAllBugs();
    const bug = bugs.find((b) => b.id === bugId);

    if (!bug) {
      return error(new ApiError("NOT_FOUND", 404, "Bug not found"));
    }

    return success(bug);
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}
