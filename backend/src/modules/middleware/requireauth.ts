import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../../modules/auth/jwt";
import { AuthenticatedRequest } from "../types/auth.types";
import { sendError } from "../../utils/response";

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return sendError(res, "No access token provided", 401);
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    return sendError(res, "Invalid or expired access token", 401);
  }
}