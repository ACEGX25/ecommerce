import { db } from "../../config/db";
import { CreateMenDto, UpdateMenDto } from "../types/men.types";

const CATEGORY_PREFIX = "Men%";

export const getAllMenService = async () => {
  const result = await db.query(
    `SELECT * FROM products WHERE category ILIKE $1 ORDER BY created_at DESC`,
    [CATEGORY_PREFIX]
  );
  return result.rows;
};

export const getMenByCategoryService = async (subcategory: string) => {
  const result = await db.query(
    `SELECT * FROM products WHERE category ILIKE $1 ORDER BY created_at DESC`,
    [`Men > ${subcategory}%`]
  );
  return result.rows;
};

export const getMenByIdService = async (id: number) => {
  const result = await db.query(
    `SELECT * FROM products WHERE id = $1 AND category ILIKE $2`,
    [id, CATEGORY_PREFIX]
  );
  return result.rows[0] || null;
};

export const createMenService = async (data: CreateMenDto, createdBy: number) => {
  const { name, description, price, stock, size, color, image_url } = data;
  const result = await db.query(
    `INSERT INTO products (name, description, price, stock, category, size, color, image_url, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [name, description, price, stock ?? 0, "Men", size, color, image_url, createdBy]
  );
  return result.rows[0];
};

export const updateMenService = async (id: number, data: UpdateMenDto) => {
  const { name, description, price, stock, size, color, image_url } = data;
  const result = await db.query(
    `UPDATE products
     SET name        = COALESCE($1, name),
         description = COALESCE($2, description),
         price       = COALESCE($3, price),
         stock       = COALESCE($4, stock),
         size        = COALESCE($5, size),
         color       = COALESCE($6, color),
         image_url   = COALESCE($7, image_url)
     WHERE id = $8 AND category ILIKE $9
     RETURNING *`,
    [name, description, price, stock, size, color, image_url, id, CATEGORY_PREFIX]
  );
  return result.rows[0] || null;
};

export const deleteMenService = async (id: number) => {
  await db.query(
    `DELETE FROM products WHERE id = $1 AND category ILIKE $2`,
    [id, CATEGORY_PREFIX]
  );
};

export const getMenCategoriesService = async () => {
  const result = await db.query(
    `SELECT DISTINCT category FROM products
     WHERE category ILIKE $1
     ORDER BY category`,
    [CATEGORY_PREFIX]
  );
  return result.rows.map((r: { category: string }) => r.category);
};