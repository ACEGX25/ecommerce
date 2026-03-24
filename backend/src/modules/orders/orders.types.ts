import { z } from "zod";

export const createOrderSchema = z.object({
  shipping_address: z.string().min(5, "Shipping address is required"),
  items: z
    .array(
      z.object({
        product_id: z.number().int().positive("Invalid product ID"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "Order must contain at least one item"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: OrderStatus;
  shipping_address: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { product_name: string })[];
}