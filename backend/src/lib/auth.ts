import { NextRequest } from "next/server";
import { ApiError, Errors } from "./errors";

/**
 * Validate bot-to-API calls via X-Bot-API-Key header.
 */
export function validateBotAuth(request: NextRequest): void {
  const apiKey = request.headers.get("x-bot-api-key");
  const expectedKey = process.env.BOT_API_KEY;

  if (!expectedKey) {
    throw new ApiError("SERVER_CONFIG", 500, "BOT_API_KEY not configured");
  }

  if (!apiKey || apiKey !== expectedKey) {
    throw Errors.UNAUTHORIZED;
  }
}

/**
 * Validate Discord OAuth2 Bearer token (for user-facing endpoints).
 * Phase 0: stub — always allows. Phase 1+: verify with Discord API.
 */
export async function validateUserAuth(request: NextRequest): Promise<string> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw Errors.UNAUTHORIZED;
  }

  const token = authHeader.slice(7);

  // Phase 0: stub — in production, verify with Discord's token endpoint
  // const discordRes = await fetch("https://discord.com/api/v10/users/@me", {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // if (!discordRes.ok) throw Errors.UNAUTHORIZED;
  // const user = await discordRes.json();
  // return user.id;

  return "stub_user_id";
}
