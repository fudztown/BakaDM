/**
 * @jest-environment node
 */
import { GET, POST } from "@/app/api/campaigns/route";
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

describe("GET /api/campaigns", () => {
  it("should return list of campaigns", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/campaigns", {
      headers: { "x-bot-api-key": "test-api-key" },
    }) as any;

    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("campaigns");
    expect(Array.isArray(body.campaigns)).toBe(true);
    expect(body).toHaveProperty("pagination");
  });

  it("should require bot auth", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/campaigns", {
      headers: {},
    }) as any;

    const response = await GET(request);

    expect(response.status).toBe(401);
  });
});

describe("POST /api/campaigns", () => {
  it("should create a new campaign", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bot-api-key": "test-api-key",
      },
      body: JSON.stringify({
        name: "Test Campaign",
        guild_id: "test_guild_123",
        description: "A test campaign",
        dm_style: "balanced",
      }),
    }) as any;

    const response = await POST(request);

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty("id");
    expect(body.name).toBe("Test Campaign");
    expect(body.guild_id).toBe("test_guild_123");
    expect(body.status).toBe("active");
  });

  it("should require name and guild_id", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bot-api-key": "test-api-key",
      },
      body: JSON.stringify({
        description: "Missing required fields",
      }),
    }) as any;

    const response = await POST(request);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("BAD_REQUEST");
  });
});
