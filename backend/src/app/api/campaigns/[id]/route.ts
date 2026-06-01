import { NextRequest } from "next/server";
import { success, error } from "@/lib/response";
import { ApiError } from "@/lib/errors";
import { validateBotAuth } from "@/lib/auth";

/**
 * GET /api/campaigns/:id
 * Get campaign details.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    validateBotAuth(request);

    const { id: campaignId } = await params;

    return success({
      id: campaignId,
      name: "The Lost Mines of Phandelver",
      description: "A classic introductory adventure...",
      dm_style: "balanced",
      setting: "Forgotten Realms",
      level_range: "1-5",
      status: "active",
      guild_id: "123456789",
      owner_id: "user_001",
      player_count: 4,
      session_count: 2,
      last_played: "2026-05-28T20:00:00Z",
      created_at: "2026-03-15T10:00:00Z",
    });
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}
