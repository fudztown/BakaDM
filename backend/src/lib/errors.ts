export class ApiError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const Errors = {
  UNAUTHORIZED: new ApiError("UNAUTHORIZED", 401, "Invalid or expired token"),
  FORBIDDEN: new ApiError("FORBIDDEN", 403, "User lacks permission"),
  NOT_FOUND: (resource: string) =>
    new ApiError("NOT_FOUND", 404, `${resource} not found`),
  RATE_LIMITED: new ApiError("RATE_LIMITED", 429, "Too many requests"),
  SESSION_ACTIVE: new ApiError(
    "SESSION_ACTIVE",
    409,
    "Campaign already has an active session"
  ),
  BAD_REQUEST: (msg: string) => new ApiError("BAD_REQUEST", 400, msg),
} as const;
