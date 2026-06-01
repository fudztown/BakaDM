/**
 * @jest-environment node
 */
import { GET } from "@/app/api/health/route";
import { NextRequest } from "next/server";

// Mock NextRequest
class MockNextRequest {
  headers = new Headers();
}

describe("GET /api/health", () => {
  it("should return healthy status", async () => {
    const request = new MockNextRequest() as any;
    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("healthy");
    expect(body.version).toBe("0.1.0");
    expect(body.services).toBeDefined();
    expect(body.services.supabase).toBe("connected");
    expect(body.services.qdrant).toBe("connected");
    expect(body.services.claw).toBe("available");
    expect(body.services.elevenlabs).toBe("available");
  });

  it("should return JSON content type", async () => {
    const request = new MockNextRequest() as any;
    const response = await GET(request);

    expect(response.headers.get("content-type")).toContain("application/json");
  });
});
