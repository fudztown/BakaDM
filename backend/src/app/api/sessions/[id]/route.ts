import { NextRequest } from "next/server";
import { success, error } from "@/lib/response";
import { ApiError } from "@/lib/errors";
import { validateBotAuth } from "@/lib/auth";

/**
 * GET /api/sessions/:id
 * Get session state.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    validateBotAuth(request);

    const { id: sessionId } = await params;

    return success({
      id: sessionId,
      campaign_id: "camp_demo_1",
      status: "active",
      voice_channel_id: null,
      players: [
        { discord_user_id: "user_001", character_id: "char_001", character_name: "Thorin", joined_at: "2026-05-29T20:00:00Z" },
      ],
      started_at: "2026-05-29T20:00:00Z",
      ended_at: null,
      duration_minutes: 45,
      message_count: 12,
      summary: null,
      combat_state: null,
      usage: {
        input_tokens: 14400,
        output_tokens: 2160,
        voice_minutes_stt: 0,
        voice_minutes_tts: 0,
        tts_characters: 0,
        api_calls: 14,
      },
    });
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}
