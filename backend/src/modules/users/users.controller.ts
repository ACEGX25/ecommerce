import { Request, Response } from "express";
import { getAllUsers, updateUser, deleteUser, getUserStats } from "./user.service";
import { sendSuccess, sendError } from "../../utils/response";

// GET /api/admin/users?page=1&limit=20&search=&role=
export async function listUsers(req: Request, res: Response) {
  try {
    const page   = Math.max(1, parseInt(req.query.page  as string || "1"));
    const limit  = Math.min(50, parseInt(req.query.limit as string || "20"));
    const search = (req.query.search as string) || undefined;
    const role   = (req.query.role   as string) || undefined;

    const { users, total } = await getAllUsers({ page, limit, search, role });

    return sendSuccess(res, {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[listUsers]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// GET /api/admin/users/stats
export async function userStats(_req: Request, res: Response) {
  try {
    const stats = await getUserStats();
    return sendSuccess(res, { stats });
  } catch (err) {
    console.error("[userStats]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// PATCH /api/admin/users/:id
export async function patchUser(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { is_active, role } = req.body;

    if (typeof is_active === "undefined" && typeof role === "undefined") {
      return sendError(res, "Nothing to update", 400);
    }

    const updated = await updateUser(id, { is_active, role });
    if (!updated) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, { user: updated });
  } catch (err) {
    console.error("[patchUser]", err);
    return sendError(res, "Internal server error", 500);
  }
}

// DELETE /api/admin/users/:id
export async function softDeleteUser(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const deleted = await deleteUser(id);
    if (!deleted) return sendError(res, "User not found", 404);
    return sendSuccess(res, { message: "User deactivated successfully" });
  } catch (err) {
    console.error("[softDeleteUser]", err);
    return sendError(res, "Internal server error", 500);
  }
}