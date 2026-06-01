import { NextRequest } from "next/server";
import { success, error } from "@/lib/response";
import { ApiError, Errors } from "@/lib/errors";
import { validateBotAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/campaigns
 * List campaigns (stub for Phase 0).
 */
export async function GET(request: NextRequest) {
  try {
    validateBotAuth(request);

    // Phase 0: return mock campaigns
    return success({
      campaigns: [
        {
          id: "camp_demo_1",
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
        },
      ],
      pagination: { page: 1, limit: 20, total: 1 },
    });
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}

/**
 * POST /api/campaigns
 * Create a new campaign.
 */
export async function POST(request: NextRequest) {
  try {
    validateBotAuth(request);

    const body = await request.json();
    const { name, guild_id, description = "", dm_style = "balanced" } = body;

    if (!name || !guild_id) {
      throw Errors.BAD_REQUEST("name and guild_id are required");
    }

    // Phase 0: generate mock campaign
    const campaign = {
      id: `camp_${Math.random().toString(36).slice(2, 10)}`,
      name,
      description,
      dm_style,
      setting: body.setting || "Forgotten Realms",
      level_range: body.level_range || "1-5",
      status: "active",
      guild_id,
      owner_id: "bot_created",
      player_count: 0,
      session_count: 0,
      last_played: null,
      created_at: new Date().toISOString(),
    };

    return success(campaign, 201);
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}
