import { Router } from "express";
import { requireAuth } from "../middleware/requireauth";
import { requireAdmin } from "../middleware/requireadmin";
import { listUsers, userStats, patchUser, softDeleteUser } from "./users.controller";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/",       listUsers);
router.get("/stats",  userStats);
router.patch("/:id",  patchUser);
router.delete("/:id", softDeleteUser);

export default router;