import { NextRequest } from "next/server";
import { success, error } from "@/lib/response";
import { ApiError, Errors } from "@/lib/errors";
import { validateBotAuth } from "@/lib/auth";

/**
 * POST /api/campaigns/:id/sessions
 * Start a new game session.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    validateBotAuth(request);

    const { id: campaignId } = await params;
    const body = await request.json();
    const { voice_channel_id, players = [] } = body;

    const session = {
      session_id: `sess_${Math.random().toString(36).slice(2, 10)}`,
      campaign_id: campaignId,
      status: "active",
      voice_channel_id: voice_channel_id || null,
      players,
      started_at: new Date().toISOString(),
    };

    return success(session, 201);
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}

/**
 * GET /api/campaigns/:id/sessions
 * List sessions for a campaign (stub).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    validateBotAuth(request);

    const { id: campaignId } = await params;

    return success({
      sessions: [
        {
          session_id: `sess_${Math.random().toString(36).slice(2, 10)}`,
          campaign_id: campaignId,
          status: "active",
          started_at: new Date().toISOString(),
        },
      ],
    });
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}
