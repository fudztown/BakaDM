import { NextRequest } from "next/server";
import { success, error } from "@/lib/response";
import { ApiError } from "@/lib/errors";
import { validateBotAuth } from "@/lib/auth";

/**
 * POST /api/sessions/:id/end
 * End a session and retrieve summary.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    validateBotAuth(request);

    const { id: sessionId } = await params;

    return success({
      session_id: sessionId,
      duration_minutes: 42,
      message_count: 12,
      summary:
        "The party ventured into unknown territory, faced challenges, and emerged with tales to tell. *(AI summary pending)*",
      usage_total: {
        input_tokens: 14400,
        output_tokens: 2160,
        voice_minutes: 0,
        tts_characters: 0,
      },
    });
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}
