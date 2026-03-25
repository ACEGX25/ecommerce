import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../../modules/auth/jwt";
import { AuthenticatedRequest } from "../types/auth.types";
import { sendError } from "../../utils/response";
import { env } from "node:process";

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  console.log("JWT_SECRET loaded:", !!env.JWT_SECRET);  // 👈 add this
  
  const authHeader = req.headers.authorization;
  console.log("Auth header:", authHeader);               // 👈 and this
  
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
  } catch (err) {
    console.log("Token verify error:", err);             // 👈 and this
    return sendError(res, "Invalid or expired access token", 401);
  }
}