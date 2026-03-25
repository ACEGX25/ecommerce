export interface IWomen {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  size?: string;
  color?: string;
  image_url?: string;
  created_by?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateWomenDto {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  size?: string;
  color?: string;
  image_url?: string;
}

export interface UpdateWomenDto extends Partial<CreateWomenDto> {}

export type WomenSubCategory =
  | "Women > Tops"
  | "Women > Dresses"
  | "Women > Jeans"
  | "Women > Trousers"
  | "Women > Skirts"
  | "Women > Jackets"
  | "Women > Innerwear"
  | "Women > Lounge";