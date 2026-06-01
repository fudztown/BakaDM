/**
 * @jest-environment node
 */
import { GET as getSession } from "@/app/api/sessions/[id]/route";
import { POST as endSession } from "@/app/api/sessions/[id]/end/route";
import { POST as sendMessage } from "@/app/api/sessions/[id]/message/route";
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

describe("GET /api/sessions/:id", () => {
  it("should return session state", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/sessions/sess_123", {
      headers: { "x-bot-api-key": "test-api-key" },
    }) as any;

    const response = await getSession(request, { params: Promise.resolve({ id: "sess_123" }) });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.id).toBe("sess_123");
    expect(body).toHaveProperty("campaign_id");
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("players");
    expect(body).toHaveProperty("usage");
  });
});

describe("POST /api/sessions/:id/end", () => {
  it("should end a session and return summary", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/sessions/sess_123/end", {
      method: "POST",
      headers: { "x-bot-api-key": "test-api-key" },
    }) as any;

    const response = await endSession(request, { params: Promise.resolve({ id: "sess_123" }) });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.session_id).toBe("sess_123");
    expect(body).toHaveProperty("duration_minutes");
    expect(body).toHaveProperty("message_count");
    expect(body).toHaveProperty("summary");
    expect(body).toHaveProperty("usage_total");
  });
});

describe("POST /api/sessions/:id/message", () => {
  it("should process a player message and return DM response", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/sessions/sess_123/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bot-api-key": "test-api-key",
      },
      body: JSON.stringify({
        player_id: "user_001",
        character_name: "Thorin",
        text: "I search the room",
        source: "text",
      }),
    }) as any;

    const response = await sendMessage(request, { params: Promise.resolve({ id: "sess_123" }) });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("dm_text");
    expect(body).toHaveProperty("voice_id");
    expect(body).toHaveProperty("usage");
    expect(body.dm_text).toContain("Thorin");
  });

  it("should require player_id, character_name, and text", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/sessions/sess_123/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bot-api-key": "test-api-key",
      },
      body: JSON.stringify({
        player_id: "user_001",
      }),
    }) as any;

    const response = await sendMessage(request, { params: Promise.resolve({ id: "sess_123" }) });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("BAD_REQUEST");
  });

  it("should handle greeting keywords", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/sessions/sess_123/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bot-api-key": "test-api-key",
      },
      body: JSON.stringify({
        player_id: "user_001",
        character_name: "Thorin",
        text: "Hello there",
        source: "text",
      }),
    }) as any;

    const response = await sendMessage(request, { params: Promise.resolve({ id: "sess_123" }) });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.dm_text).toContain("Greetings");
  });

  it("should handle attack keywords", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/sessions/sess_123/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bot-api-key": "test-api-key",
      },
      body: JSON.stringify({
        player_id: "user_001",
        character_name: "Thorin",
        text: "I attack the goblin",
        source: "text",
      }),
    }) as any;

    const response = await sendMessage(request, { params: Promise.resolve({ id: "sess_123" }) });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.dm_text).toContain("initiative");
  });
});
