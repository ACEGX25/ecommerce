import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth.types";
import { sendError } from "../../utils/response";

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return sendError(res, "Not authenticated", 401);
  }
  if (req.user.role !== "admin") {
    return sendError(res, "Forbidden: admin access required", 403);
  }
  next();
}