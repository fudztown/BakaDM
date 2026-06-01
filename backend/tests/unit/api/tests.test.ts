/**
 * @jest-environment node
 */
import { GET, POST } from "@/app/api/tests/run/route";
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

describe("GET /api/tests/run", () => {
  it("should return latest test run data", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/tests/run", {
      headers: { "x-bot-api-key": "test-api-key" },
    }) as any;

    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("latestRun");
    expect(body).toHaveProperty("stats");
    expect(body).toHaveProperty("bugs");
  });
});

describe("POST /api/tests/run", () => {
  it("should trigger a test run", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/tests/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bot-api-key": "test-api-key",
      },
      body: JSON.stringify({ suites: ["all"] }),
    }) as any;

    const response = await POST(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("run");
    expect(body).toHaveProperty("message");
    expect(body.message).toContain("Test run completed");
  });
});
