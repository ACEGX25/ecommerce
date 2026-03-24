import { z } from "zod";

// ─── Zod Schemas ─────────────────────────────────────────────

export const addToCartSchema = z.object({
  product_id: z.number().int().positive("Invalid product ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

// ─── Inferred Input Types ─────────────────────────────────────

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;

// ─── Entity Types ─────────────────────────────────────────────

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  added_at: Date;
}

export interface CartItemWithProduct extends CartItem {
  product_name: string;
  price: number;
  image_url: string | null;
  stock: number;
}

export interface Cart {
  items: CartItemWithProduct[];
  total_items: number;
  total_amount: number;
}