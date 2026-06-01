import { ApiError, Errors } from "@/lib/errors";

describe("ApiError", () => {
  it("should create an ApiError with correct properties", () => {
    const error = new ApiError("TEST_ERROR", 400, "Test error message");

    expect(error.code).toBe("TEST_ERROR");
    expect(error.status).toBe(400);
    expect(error.message).toBe("Test error message");
    expect(error.name).toBe("ApiError");
  });

  it("should be an instance of Error", () => {
    const error = new ApiError("TEST", 500, "Test");
    expect(error).toBeInstanceOf(Error);
  });

  it("should preserve stack trace", () => {
    const error = new ApiError("TEST", 500, "Test");
    expect(error.stack).toBeDefined();
  });
});

describe("Errors constants", () => {
  it("should have UNAUTHORIZED error", () => {
    expect(Errors.UNAUTHORIZED.code).toBe("UNAUTHORIZED");
    expect(Errors.UNAUTHORIZED.status).toBe(401);
    expect(Errors.UNAUTHORIZED.message).toBe("Invalid or expired token");
  });

  it("should have FORBIDDEN error", () => {
    expect(Errors.FORBIDDEN.code).toBe("FORBIDDEN");
    expect(Errors.FORBIDDEN.status).toBe(403);
  });

  it("should have NOT_FOUND factory", () => {
    const error = Errors.NOT_FOUND("Campaign");
    expect(error.code).toBe("NOT_FOUND");
    expect(error.status).toBe(404);
    expect(error.message).toBe("Campaign not found");
  });

  it("should have RATE_LIMITED error", () => {
    expect(Errors.RATE_LIMITED.code).toBe("RATE_LIMITED");
    expect(Errors.RATE_LIMITED.status).toBe(429);
  });

  it("should have SESSION_ACTIVE error", () => {
    expect(Errors.SESSION_ACTIVE.code).toBe("SESSION_ACTIVE");
    expect(Errors.SESSION_ACTIVE.status).toBe(409);
    expect(Errors.SESSION_ACTIVE.message).toBe("Campaign already has an active session");
  });

  it("should have BAD_REQUEST factory", () => {
    const error = Errors.BAD_REQUEST("Invalid input");
    expect(error.code).toBe("BAD_REQUEST");
    expect(error.status).toBe(400);
    expect(error.message).toBe("Invalid input");
  });
});
