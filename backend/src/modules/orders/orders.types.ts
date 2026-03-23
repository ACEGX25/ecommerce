import { z } from "zod";

// src/modules/orders/orders.types.ts

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

const shippingAddressSchema = z.object({
  full_name:     z.string().min(1),
  phone:         z.string().min(1),
  address_line1: z.string().min(1),
  address_line2: z.string().optional(),
  city:          z.string().min(1),
  state:         z.string().min(1),
  postal_code:   z.string().min(1),
  country:       z.string().min(1),
});

// ─── Request body types ───────────────────────────────────────


export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.number(),
      quantity: z.number().min(1),
    })
  ),
  shipping_address: shippingAddressSchema,
  billing_address:  shippingAddressSchema.optional(),
  payment_method:   z.string().min(1),
  coupon_code:      z.string().optional(),
  notes:            z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
});

export interface CancelOrderBody {
  reason?: string;
}

// ─── DB row shapes (what comes back from pg) ──────────────────

// Add these to orders.types.ts

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export interface OrderItem {
  id:                 number;
  order_id:           number;
  product_id:         number;
  quantity:           number;
  price_at_purchase:  number;
  product_name:       string;
}

export interface Order {
  id:               number;
  user_id:          number;
  total_amount:     number;
  status:           OrderStatus;
  shipping_address: ShippingAddress;
  created_at:       Date;
  updated_at:       Date;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface CreateOrderInput {
  shipping_address: ShippingAddress;
  items: {
    product_id: number;
    quantity:   number;
  }[];
}