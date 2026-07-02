import axios from "axios";
import { api } from "./client";
import type {
  AdminApiError,
  CmsProduct,
  CmsService,
  ContactMessage,
  HomepageSection,
  ProductImage,
  PaginatedResourceCollection,
  ResourceCollection,
  ResourceItem,
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

export async function getAdminContactMessages(
  page = 1,
): Promise<PaginatedResourceCollection<ContactMessage>> {
  const response = await api.get<PaginatedResourceCollection<ContactMessage>>(
    "/admin/contact-messages",
    { params: { page } },
  );

  return response.data;
}

export async function getAdminContactMessage(
  messageId: number,
): Promise<ContactMessage> {
  const response = await api.get<ResourceItem<ContactMessage>>(
    `/admin/contact-messages/${messageId}`,
  );

  return response.data.data;
}

export async function deleteContactMessage(messageId: number): Promise<void> {
  await api.delete(`/admin/contact-messages/${messageId}`);
}

export async function clearContactMessages(): Promise<void> {
  await api.delete("/admin/contact-messages");
}

export async function getAdminContentCounts() {
  const [sections, services, products, images, messages] = await Promise.all([
    getAdminHomepageSections(),
    getAdminServices(),
    getAdminProducts(),
    getAdminProductImages(),
    getAdminContactMessages(),
  ]);

  return {
    homepage: sections.length,
    services: services.length,
    products: products.length,
    images: images.length,
    messages: messages.meta.total,
  };
}

export async function updateHomepageSection(
  sectionId: number,
  formData: FormData,
): Promise<HomepageSection> {
  formData.set("_method", "PATCH");
  const response = await api.post<ResourceItem<HomepageSection>>(
    `/admin/homepage-sections/${sectionId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data.data;
}

export async function createService(formData: FormData): Promise<CmsService> {
  const response = await api.post<ResourceItem<CmsService>>(
    "/admin/services",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data.data;
}

export async function updateService(
  serviceId: number,
  formData: FormData,
): Promise<CmsService> {
  formData.set("_method", "PATCH");
  const response = await api.post<ResourceItem<CmsService>>(
    `/admin/services/${serviceId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data.data;
}

export async function deleteService(serviceId: number): Promise<void> {
  await api.delete(`/admin/services/${serviceId}`);
}

export async function createProduct(formData: FormData): Promise<CmsProduct> {
  const response = await api.post<ResourceItem<CmsProduct>>(
    "/admin/products",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data.data;
}

export async function updateProduct(
  productId: number,
  formData: FormData,
): Promise<CmsProduct> {
  formData.set("_method", "PATCH");
  const response = await api.post<ResourceItem<CmsProduct>>(
    `/admin/products/${productId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data.data;
}

export async function deleteProduct(productId: number): Promise<void> {
  await api.delete(`/admin/products/${productId}`);
}

export async function selectOurWorkGallery(
  productId: number,
): Promise<CmsProduct> {
  const response = await api.patch<ResourceItem<CmsProduct>>(
    `/admin/products/${productId}/work-gallery`,
  );

  return response.data.data;
}

export async function uploadProductImage(
  productId: number,
  formData: FormData,
): Promise<ProductImage> {
  const response = await api.post<ResourceItem<ProductImage>>(
    `/admin/products/${productId}/images`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data.data;
}

export async function updateProductImage(
  imageId: number,
  altText: string,
): Promise<ProductImage> {
  const response = await api.patch<ResourceItem<ProductImage>>(
    `/admin/product-images/${imageId}`,
    { alt_text: altText || null },
  );

  return response.data.data;
}

export async function reorderProductImages(
  productId: number,
  imageIds: number[],
): Promise<ProductImage[]> {
  const response = await api.patch<ResourceCollection<ProductImage>>(
    `/admin/products/${productId}/images/reorder`,
    { image_ids: imageIds },
  );

  return response.data.data;
}

export async function deleteProductImage(imageId: number): Promise<void> {
  await api.delete(`/admin/product-images/${imageId}`);
}

export function getAdminApiError(error: unknown): AdminApiError {
  if (!axios.isAxiosError(error)) {
    return {
      message: "Something went wrong. Please try again.",
      errors: {},
    };
  }

  const data = error.response?.data as
    | { message?: string; errors?: Record<string, string[]> }
    | undefined;

  return {
    message: data?.message ?? "The request could not be completed.",
    errors: data?.errors ?? {},
  };
}
