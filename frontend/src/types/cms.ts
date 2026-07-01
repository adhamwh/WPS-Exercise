export type HomepageSection = {
  id: number;
  key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_url: string | null;
  image_path: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

export type CmsService = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  icon_path: string | null;
  icon_url: string | null;
  image_path: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

export type ProductFeature = {
  label: string;
  positive: boolean;
};

export type ProductImage = {
  id: number;
  product_id: number;
  image_path: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  product?: {
    id: number;
    name: string;
  };
  updated_at: string;
};

export type CmsProduct = {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  features: ProductFeature[] | null;
  image_path: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  images: ProductImage[];
  updated_at: string;
};

export type ResourceCollection<T> = {
  data: T[];
};

export type ResourceItem<T> = {
  data: T;
};

export type AdminApiError = {
  message: string;
  errors: Record<string, string[]>;
};
