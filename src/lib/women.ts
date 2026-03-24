import api from "./api";

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

export const fetchAllWomen = async (): Promise<WomenProduct[]> => {
  const res = await api.get("/women");
  return res.data;
};

export const fetchWomenByCategory = async (subcategory: string): Promise<WomenProduct[]> => {
  const res = await api.get(`/women/category/${subcategory}`);
  return res.data;
};

export const fetchWomenCategories = async (): Promise<string[]> => {
  const res = await api.get("/women/categories");
  return res.data;
};

export const fetchWomenById = async (id: number): Promise<WomenProduct> => {
  const res = await api.get(`/women/${id}`);
  return res.data;
};