import { NextRequest } from "next/server";
import { success, error } from "@/lib/response";
import { ApiError, Errors } from "@/lib/errors";
import { validateBotAuth } from "@/lib/auth";

/**
 * POST /api/sessions/:id/message
 * Send a player message and get a DM response.
 * This is the CORE gameplay endpoint.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    validateBotAuth(request);

    const { id: sessionId } = await params;
    const body = await request.json();
    const { player_id, character_name, text, source = "text" } = body;

    if (!player_id || !character_name || !text) {
      throw Errors.BAD_REQUEST("player_id, character_name, and text are required");
    }

    // Phase 0: keyword-based mock DM responses
    // Phase 1+: forward to Abacus Claw
    const lower = text.toLowerCase();
    let dmText: string;

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("greet")) {
      dmText = `Greetings, ${character_name}. The road ahead is long and fraught with peril. What would you like to do?`;
    } else if (lower.includes("attack") || lower.includes("fight") || lower.includes("hit")) {
      dmText = `${character_name} readies their weapon. Roll for initiative! *(Use \`/roll 1d20\`)*`;
    } else if (lower.includes("search") || lower.includes("look") || lower.includes("investigate")) {
      dmText = `${character_name} scans the area carefully. You notice something glinting in the shadows...`;
    } else if (lower.includes("cast") || lower.includes("spell") || lower.includes("magic")) {
      dmText = `Arcane energy crackles around ${character_name}. What spell do you wish to cast?`;
    } else {
      dmText = `*${character_name} speaks...*\n\n🧙‍♂️ **The DM ponders your words...**\n\n_You said: "${text}"_\n\n*(Backend integration active — this is a Phase 0 mock response.)*`;
    }

    return success({
      dm_text: dmText,
      voice_id: "dm_narrator",
      tool_results: [],
      ui_updates: [
        { type: "narrative", text: `${character_name} acts in the scene...` },
      ],
      usage: {
        input_tokens: 850 + text.length * 2,
        output_tokens: dmText.length,
        model: "claw-dm-stub",
      },
    });
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}
