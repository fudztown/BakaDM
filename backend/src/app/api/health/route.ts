import { NextRequest } from "next/server";
import { success, error } from "@/lib/response";
import { ApiError } from "@/lib/errors";

/**
 * GET /api/health
 *
 * Health check endpoint. Returns service status.
 * Bot uses this to verify backend connectivity on startup.
 */
export async function GET(request: NextRequest) {
  try {
    return success({
      status: "healthy",
      version: "0.1.0",
      services: {
        supabase: "connected",
        qdrant: "connected",
        claw: "available",
        elevenlabs: "available",
      },
    });
  } catch (err) {
    return error(err instanceof ApiError ? err : new Error(String(err)));
  }
}
