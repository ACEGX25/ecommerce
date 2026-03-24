import { db } from "../../config/db";
import { CreateWomenDto, UpdateWomenDto } from "../types/women.types";

const CATEGORY_PREFIX = "Women%";

export const getAllWomenService = async () => {
  const result = await db.query(
    `SELECT * FROM products WHERE category ILIKE $1 ORDER BY created_at DESC`,
    [CATEGORY_PREFIX]
  );
  return result.rows;
};

export const getWomenByCategoryService = async (subcategory: string) => {
  const result = await db.query(
    `SELECT * FROM products WHERE category ILIKE $1 ORDER BY created_at DESC`,
    [`Women > ${subcategory}%`]
  );
  return result.rows;
};

export const getWomenByIdService = async (id: number) => {
  const result = await db.query(
    `SELECT * FROM products WHERE id = $1 AND category ILIKE $2`,
    [id, CATEGORY_PREFIX]
  );
  return result.rows[0] || null;
};

export const createWomenService = async (data: CreateWomenDto, createdBy: number) => {
  const { name, description, price, stock, size, color, image_url } = data;
  const result = await db.query(
    `INSERT INTO products (name, description, price, stock, category, size, color, image_url, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [name, description, price, stock ?? 0, "Women", size, color, image_url, createdBy]
  );
  return result.rows[0];
};

export const updateWomenService = async (id: number, data: UpdateWomenDto) => {
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

export const deleteWomenService = async (id: number) => {
  await db.query(
    `DELETE FROM products WHERE id = $1 AND category ILIKE $2`,
    [id, CATEGORY_PREFIX]
  );
};

export const getWomenCategoriesService = async () => {
  const result = await db.query(
    `SELECT DISTINCT category FROM products 
     WHERE category ILIKE $1 
     ORDER BY category`,
    [CATEGORY_PREFIX]
  );
  return result.rows.map((r: { category: string }) => r.category);
};