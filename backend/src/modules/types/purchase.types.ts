export interface IOrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
}

export interface IOrder {
  id?: number;
  user_id: number;
  total_amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shipping_address?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateOrderItemDto {
  product_id: number;
  quantity: number;
  price_at_purchase: number;
}

export interface CreateOrderDto {
  shipping_address?: string;
  items: CreateOrderItemDto[];
}

export interface UpdateOrderStatusDto {
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}