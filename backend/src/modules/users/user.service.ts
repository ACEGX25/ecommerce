import { db } from "../../config/db";
import { User, UserRole } from "../types/auth.types";

export async function getAllUsers(params: {
  page: number;
  limit: number;
  search?: string;
  role?: string;
}): Promise<{ users: User[]; total: number }> {
  const { page, limit, search, role } = params;
  const offset = (page - 1) * limit;

  const conditions: string[] = ["1=1"];
  const values: unknown[] = [];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`(name ILIKE $${values.length} OR email ILIKE $${values.length})`);
  }

  if (role === "user" || role === "admin") {
    values.push(role);
    conditions.push(`role = $${values.length}`);
  }

  const where = `WHERE ${conditions.join(" AND ")}`;

  const countRes = await db.query(`SELECT COUNT(*) FROM users ${where}`, values);
  const total = parseInt((countRes.rows[0] as unknown as { count: string }).count, 10);

  const dataValues = [...values, limit, offset];
  const usersRes = await db.query(
    `SELECT id, name, email, role, is_active, avatar_url, created_at, updated_at
     FROM users ${where}
     ORDER BY created_at DESC
     LIMIT $${dataValues.length - 1} OFFSET $${dataValues.length}`,
    dataValues
  );

  return { users: usersRes.rows as unknown as User[], total };
}

export async function updateUser(
  userId: string,
  updates: { is_active?: boolean; role?: UserRole }
): Promise<User | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (typeof updates.is_active === "boolean") {
    values.push(updates.is_active);
    fields.push(`is_active = $${values.length}`);
  }

  if (updates.role === "user" || updates.role === "admin") {
    values.push(updates.role);
    fields.push(`role = $${values.length}`);
  }

  if (fields.length === 0) return null;

  values.push(userId);
  const res = await db.query(
    `UPDATE users SET ${fields.join(", ")}
     WHERE id = $${values.length}
     RETURNING id, name, email, role, is_active, avatar_url, created_at, updated_at`,
    values
  );

  return (res.rows[0] as unknown as User) ?? null;
}

export async function deleteUser(userId: string): Promise<boolean> {
  const res = await db.query(
    `UPDATE users SET is_active = FALSE WHERE id = $1 RETURNING id`,
    [userId]
  );
  return res.rowCount !== null && res.rowCount > 0;
}

export async function getUserStats(): Promise<{
  total: number;
  active: number;
  admins: number;
  newThisMonth: number;
}> {
  const res = await db.query(`
    SELECT
      COUNT(*)                                                            AS total,
      COUNT(*) FILTER (WHERE is_active = TRUE)                           AS active,
      COUNT(*) FILTER (WHERE role = 'admin')                             AS admins,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW()))   AS new_this_month
    FROM users
  `);
  const row = res.rows[0] as unknown as Record<string, string>;
  return {
    total:        parseInt(row.total, 10),
    active:       parseInt(row.active, 10),
    admins:       parseInt(row.admins, 10),
    newThisMonth: parseInt(row.new_this_month, 10),
  };
}