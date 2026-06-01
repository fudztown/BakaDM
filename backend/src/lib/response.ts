import { NextResponse } from "next/server";
import { ApiError } from "./errors";

export function success<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(err: ApiError | Error) {
  if (err instanceof ApiError) {
    return NextResponse.json(
      { error: { code: err.code, message: err.message, status: err.status } },
      { status: err.status }
    );
  }
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: err.message, status: 500 } },
    { status: 500 }
    );
}
