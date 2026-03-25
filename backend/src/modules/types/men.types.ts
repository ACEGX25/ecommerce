export interface CreateMenDto {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  size?: string;
  color?: string;
  image_url?: string;
}

export interface UpdateMenDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  size?: string;
  color?: string;
  image_url?: string;
}