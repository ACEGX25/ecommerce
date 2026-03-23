// src/utils/response.ts
import { Response } from "express";

export function sendSuccess(
  res: Response,
  data: Record<string, unknown>,
  status = 200
) {
  return res.status(status).json({ success: true, ...data });
}

export function sendError(
  res: Response,
  message: string,
  status = 400,
  errors?: Record<string, unknown>
) {
  return res.status(status).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
}