import { success, error } from "@/lib/response";
import { ApiError } from "@/lib/errors";

describe("success", () => {
  it("should return a successful response with default status 200", async () => {
    const data = { message: "Hello" };
    const response = success(data);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(data);
  });

  it("should return a successful response with custom status", async () => {
    const data = { created: true };
    const response = success(data, 201);

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toEqual(data);
  });

  it("should handle null data", async () => {
    const response = success(null);
    const body = await response.json();
    expect(body).toBeNull();
  });

  it("should handle array data", async () => {
    const data = [1, 2, 3];
    const response = success(data);
    const body = await response.json();
    expect(body).toEqual(data);
  });
});

describe("error", () => {
  it("should return an ApiError response", async () => {
    const apiError = new ApiError("TEST_ERROR", 400, "Test error");
    const response = error(apiError);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("TEST_ERROR");
    expect(body.error.message).toBe("Test error");
    expect(body.error.status).toBe(400);
  });

  it("should return a generic Error response as 500", async () => {
    const genericError = new Error("Something went wrong");
    const response = error(genericError);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error.code).toBe("INTERNAL_ERROR");
    expect(body.error.message).toBe("Something went wrong");
    expect(body.error.status).toBe(500);
  });

  it("should handle errors with special characters in message", async () => {
    const apiError = new ApiError("SPECIAL", 400, 'Error with "quotes" and <tags>');
    const response = error(apiError);
    const body = await response.json();
    expect(body.error.message).toBe('Error with "quotes" and <tags>');
  });
});
