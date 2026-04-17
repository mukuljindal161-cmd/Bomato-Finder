import type { Response } from "express";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function sendError(res: Response, statusCode: number, message: string, code?: string) {
  return res.status(statusCode).json({ error: { message, code: code ?? "ERROR" } });
}

export function notFound(res: Response, entity = "Resource") {
  return sendError(res, 404, `${entity} not found`, "NOT_FOUND");
}

export function unauthorized(res: Response, message = "Unauthorized") {
  return sendError(res, 401, message, "UNAUTHORIZED");
}

export function forbidden(res: Response, message = "Forbidden") {
  return sendError(res, 403, message, "FORBIDDEN");
}

export function badRequest(res: Response, message: string) {
  return sendError(res, 400, message, "BAD_REQUEST");
}

export function conflict(res: Response, message: string) {
  return sendError(res, 409, message, "CONFLICT");
}

export function serverError(res: Response, message = "Internal server error") {
  return sendError(res, 500, message, "INTERNAL_ERROR");
}
