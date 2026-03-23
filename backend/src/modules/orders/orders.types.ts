// src/modules/orders/orders.types.ts

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface ShippingAddress {
  full_name:     string;
  phone:         string;
  address_line1: string;
  address_line2?: string;
  city:          string;
  state:         string;
  postal_code:   string;
  country:       string;
}

// ─── Request body types ───────────────────────────────────────

export interface CreateOrderBody {
  shipping_address:  ShippingAddress;
  billing_address?:  ShippingAddress;
  payment_method:    string;
  coupon_code?:      string;
  notes?:            string;
}

export interface UpdateOrderStatusBody {
  status: OrderStatus;
}

export interface CancelOrderBody {
  reason?: string;
}

// ─── DB row shapes (what comes back from pg) ──────────────────

export interface OrderRow {
  id:              string;
  order_number:    string;
  user_id:         string;
  status:          OrderStatus;
  subtotal:        string;       // pg returns NUMERIC as string
  discount_amount: string;
  tax_amount:      string;
  shipping_amount: string;
  total_amount:    string;
  currency:        string;
  coupon_id:       string | null;
  coupon_code:     string | null;
  shipping_address: ShippingAddress;
  billing_address:  ShippingAddress | null;
  notes:           string | null;
  cancelled_reason: string | null;
  created_at:      Date;
  updated_at:      Date;
}

export interface OrderItemRow {
  id:           string;
  order_id:     string;
  product_id:   string | null;
  variant_id:   string | null;
  product_name: string;
  variant_name: string | null;
  sku:          string | null;
  quantity:     number;
  unit_price:   string;
  total_price:  string;
  tax_rate:     string;
  image_url:    string | null;
  created_at:   Date;
}

export interface CartItemRow {
  cart_id:        string;
  product_id:     string;
  variant_id:     string | null;
  quantity:       number;
  unit_price:     string;
  product_name:   string;
  stock_quantity: number;
  variant_stock:  number | null;
  tax_rate:       string;
  variant_name:   string | null;
  image_url:      string | null;
  sku:            string | null;
  is_active:      boolean;
}