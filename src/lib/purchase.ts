import { api } from "./api";

export interface PlaceOrderItem {
  product_id: number;
  quantity: number;
  price_at_purchase: number;
}

export interface PlaceOrderDto {
  shipping_address?: string;
  items: PlaceOrderItem[];
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address?: string;
  created_at: string;
  items: {
    id: number;
    product_id: number;
    quantity: number;
    price_at_purchase: number;
  }[];
}

export const placeOrder = (data: PlaceOrderDto) =>
  api.post<Order>("/api/purchase", data);

export const getMyOrders = () =>
  api.get<Order[]>("/api/purchase/my");

export const getOrderById = (id: number) =>
  api.get<Order>(`/api/purchase/${id}`);