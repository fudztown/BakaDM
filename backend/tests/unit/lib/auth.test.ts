/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { validateBotAuth, validateUserAuth } from "@/lib/auth";
import { ApiError } from "@/lib/errors";

// Mock NextRequest for testing
class MockNextRequest {
  headers: Headers;
  constructor(headers: Record<string, string> = {}) {
    this.headers = new Headers(headers);
  }
}

describe("validateBotAuth", () => {
  const originalEnv = process.env.BOT_API_KEY;

  beforeEach(() => {
    process.env.BOT_API_KEY = "test-api-key";
  });

  afterEach(() => {
    process.env.BOT_API_KEY = originalEnv;
  });

  it("should pass with valid API key", () => {
    const request = new MockNextRequest({
      "x-bot-api-key": "test-api-key",
    }) as any;

    expect(() => validateBotAuth(request)).not.toThrow();
  });

  it("should throw UNAUTHORIZED with invalid API key", () => {
    const request = new MockNextRequest({
      "x-bot-api-key": "wrong-key",
    }) as any;

    expect(() => validateBotAuth(request)).toThrow(ApiError);
    expect(() => validateBotAuth(request)).toThrow("Invalid or expired token");
  });

  it("should throw UNAUTHORIZED with missing API key", () => {
    const request = new MockNextRequest({}) as any;

    expect(() => validateBotAuth(request)).toThrow(ApiError);
    expect(() => validateBotAuth(request)).toThrow("Invalid or expired token");
  });

  it("should throw SERVER_CONFIG when BOT_API_KEY not set", () => {
    delete process.env.BOT_API_KEY;
    const request = new MockNextRequest({
      "x-bot-api-key": "test-api-key",
    }) as any;

    expect(() => validateBotAuth(request)).toThrow(ApiError);
    expect(() => validateBotAuth(request)).toThrow("BOT_API_KEY not configured");
  });

  it("should be case-sensitive with API key", () => {
    const request = new MockNextRequest({
      "x-bot-api-key": "TEST-API-KEY",
    }) as any;

    expect(() => validateBotAuth(request)).toThrow(ApiError);
  });
});

describe("validateUserAuth", () => {
  it("should return stub user ID with Bearer token (Phase 0)", async () => {
    const request = new MockNextRequest({
      authorization: "Bearer test-token",
    }) as any;

    const userId = await validateUserAuth(request);
    expect(userId).toBe("stub_user_id");
  });

  it("should throw UNAUTHORIZED without authorization header", async () => {
    const request = new MockNextRequest({}) as any;

    await expect(validateUserAuth(request)).rejects.toThrow(ApiError);
    await expect(validateUserAuth(request)).rejects.toThrow("Invalid or expired token");
  });

  it("should throw UNAUTHORIZED with non-Bearer token", async () => {
    const request = new MockNextRequest({
      authorization: "Basic dXNlcjpwYXNz",
    }) as any;

    await expect(validateUserAuth(request)).rejects.toThrow(ApiError);
  });

  it("should return stub user ID with empty Bearer token (Phase 0)", async () => {
    const request = new MockNextRequest({
      authorization: "Bearer ",
    }) as any;

    // Phase 0: returns stub_user_id regardless
    const userId = await validateUserAuth(request);
    expect(userId).toBe("stub_user_id");
  });
});
