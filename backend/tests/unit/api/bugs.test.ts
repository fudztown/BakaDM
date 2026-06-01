/**
 * @jest-environment node
 */
import { GET, POST } from "@/app/api/bugs/route";
import { NextRequest } from "next/server";

class MockNextRequest {
  headers = new Headers({ "x-bot-api-key": "test-api-key" });
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

describe("GET /api/bugs", () => {
  it("should return all bugs", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/bugs", {
      headers: { "x-bot-api-key": "test-api-key" },
    }) as any;

    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("bugs");
    expect(body).toHaveProperty("count");
    expect(body).toHaveProperty("filter");
  });

  it("should filter bugs by status", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/bugs?status=open", {
      headers: { "x-bot-api-key": "test-api-key" },
    }) as any;

    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.filter).toBe("open");
  });
});

describe("POST /api/bugs", () => {
  it("should create a new bug", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/bugs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bot-api-key": "test-api-key",
      },
      body: JSON.stringify({
        title: "Test Bug",
        description: "Test description",
        severity: "high",
        source: "test",
      }),
    }) as any;

    const response = await POST(request);

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty("id");
    expect(body.title).toBe("Test Bug");
    expect(body.status).toBe("open");
  });

  it("should reject missing title", async () => {
    const request = new MockNextRequest("http://localhost:3000/api/bugs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bot-api-key": "test-api-key",
      },
      body: JSON.stringify({
        description: "Test description",
      }),
    }) as any;

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
