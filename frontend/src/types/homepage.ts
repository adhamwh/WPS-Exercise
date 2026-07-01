export type HomepageSection = {
  id: number;
  key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_url: string | null;
  image_path: string | null;
  sort_order: number;
  is_active: boolean;
};

export type WoodFeature = {
  label: string;
  positive: boolean;
};

export type WoodType = {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  features: WoodFeature[] | null;
  image_path: string | null;
  sort_order: number;
  is_active: boolean;
};

export type Service = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  icon_path: string | null;
  image_path: string | null;
  sort_order: number;
  is_active: boolean;
};

export type ProductImage = {
  id: number;
  product_id: number;
  image_path: string;
  alt_text: string | null;
  sort_order: number;
};

export type HomepageResponse = {
  sections: Record<string, HomepageSection>;
  wood_types: WoodType[];
  services: Service[];
  gallery: ProductImage[];
};