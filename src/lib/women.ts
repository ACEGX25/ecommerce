import { api } from "./api";

export interface WomenProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  size?: string;
  color?: string;
  image_url?: string;
}

export const fetchAllWomen = () =>
  api.get<WomenProduct[]>("/api/women");

export const fetchWomenByCategory = (subcategory: string) =>
  api.get<WomenProduct[]>(`/api/women/category/${subcategory}`);

export const fetchWomenCategories = () =>
  api.get<string[]>("/api/women/categories");

export const fetchWomenById = (id: number) =>
  api.get<WomenProduct>(`/api/women/${id}`);