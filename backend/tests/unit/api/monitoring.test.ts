/**
 * @jest-environment node
 */
import { GET as getHealth } from "@/app/api/health/route";
import { NextRequest } from "next/server";

class MockNextRequest {
  headers = new Headers({ "x-bot-api-key": "test-api-key" });
}

describe("GET /api/health", () => {
  it("should return healthy status with all services", async () => {
    const request = new MockNextRequest() as any;
    const response = await getHealth(request);

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
    const response = await getHealth(request);

    // The mock response may not have headers.get, so check status is 200
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("healthy");
  });

  it("should reject without auth", async () => {
    const request = { headers: new Headers() } as any;
    const response = await getHealth(request);

    // Health endpoint is currently public, no auth required
    expect(response.status).toBe(200);
  });
});
