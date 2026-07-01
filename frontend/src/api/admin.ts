import { api } from "./client";
import type {
  CmsProduct,
  CmsService,
  HomepageSection,
  ProductImage,
  ResourceCollection,
} from "../types/cms";

export async function getAdminHomepageSections(): Promise<HomepageSection[]> {
  const response = await api.get<ResourceCollection<HomepageSection>>(
    "/admin/homepage-sections",
  );

  return response.data.data;
}

export async function getAdminServices(): Promise<CmsService[]> {
  const response = await api.get<ResourceCollection<CmsService>>(
    "/admin/services",
  );

  return response.data.data;
}

export async function getAdminProducts(): Promise<CmsProduct[]> {
  const response = await api.get<ResourceCollection<CmsProduct>>(
    "/admin/products",
  );

  return response.data.data;
}

export async function getAdminProductImages(): Promise<ProductImage[]> {
  const response = await api.get<ResourceCollection<ProductImage>>(
    "/admin/product-images",
  );

  return response.data.data;
}

export async function getAdminContentCounts() {
  const [sections, services, products, images] = await Promise.all([
    getAdminHomepageSections(),
    getAdminServices(),
    getAdminProducts(),
    getAdminProductImages(),
  ]);

  return {
    homepage: sections.length,
    services: services.length,
    products: products.length,
    images: images.length,
  };
}
