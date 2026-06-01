import { NextRequest } from "next/server";
import { success, error } from "@/lib/response";
import { ApiError, Errors } from "@/lib/errors";
import { validateBotAuth } from "@/lib/auth";

/**
 * POST /api/dice/roll
 * Log a dice roll (fire-and-forget).
 */
export async function POST(request: NextRequest) {
  try {
    validateBotAuth(request);

    const body = await request.json();
    const { session_id, expression, rolls, total, roller_id, roller_name, reason = "" } = body;

    if (!expression || !rolls || total === undefined) {
      throw Errors.BAD_REQUEST("expression, rolls, and total are required");
    }

    return success({
      roll_id: `roll_${Math.random().toString(36).slice(2, 10)}`,
      expression,
      rolls,
      total,
      modifier: body.modifier || 0,
      reason,
      roller: roller_name || roller_id,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}
