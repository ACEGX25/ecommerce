// src/modules/products/products.controller.ts
import { Request, Response } from "express";
import { db } from "../../config/db";

export async function getAllProducts(req: Request, res: Response) {
  try {
    const result = await db.query(
      `SELECT id, name, description, price, stock, category, size, color, image_url, created_at
       FROM public.products
       ORDER BY id DESC`
    );
    return res.json(result.rows);
  } catch (err: any) {
    console.error("[products] fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
}
 
export async function createProduct(req: Request, res: Response) {
  const { name, description, price, stock, category, size, color, image_url } = req.body;
 
  if (!name || !price || !stock || !category) {
    return res.status(400).json({ error: "name, price, stock, category are required" });
  }
 
  try {
    const result = await db.query(
      `INSERT INTO public.products (name, description, price, stock, category, size, color, image_url, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, description ?? null, price, stock, category, size ?? null, color ?? null, image_url ?? null, 1]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error("[products] create error:", err);
    return res.status(500).json({ error: "Failed to create product" });
  }
}
 


