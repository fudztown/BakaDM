/**
 * @jest-environment node
 */
import { POST } from "@/app/api/dice/roll/route";
import { NextRequest } from "next/server";

// Mock NextRequest
class MockNextRequest {
  headers: Headers;
  url: string;
  method: string;
  body?: string;

  constructor(url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) {
    this.url = url;
    this.method = init?.method || "GET";
    this.headers = new Headers(init?.headers);
    this.body = init?.body;
  }

  async json() {
    return JSON.parse(this.body || "{}");
  }
}

describe("POST /api/dice/roll", () => {
  it("should log a dice roll", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/dice/roll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bot-api-key": "test-api-key",
      },
      body: JSON.stringify({
        expression: "1d20",
        rolls: [15],
        total: 15,
        roller_id: "user_123",
        roller_name: "Test User",
        reason: "Initiative",
      }),
    }) as any;

    const response = await POST(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("roll_id");
    expect(body.expression).toBe("1d20");
    expect(body.rolls).toEqual([15]);
    expect(body.total).toBe(15);
    expect(body.roller).toBe("Test User");
    expect(body.reason).toBe("Initiative");
    expect(body).toHaveProperty("timestamp");
  });

  it("should require expression, rolls, and total", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/dice/roll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bot-api-key": "test-api-key",
      },
      body: JSON.stringify({
        roller_id: "user_123",
      }),
    }) as any;

    const response = await POST(request);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("BAD_REQUEST");
  });

  it("should handle roll without roller_name", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/dice/roll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bot-api-key": "test-api-key",
      },
      body: JSON.stringify({
        expression: "2d6",
        rolls: [3, 4],
        total: 7,
        roller_id: "user_456",
      }),
    }) as any;

    const response = await POST(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.roller).toBe("user_456");
  });
});
