import { api } from "./client";
import type { HomepageResponse } from "../types/homepage";

export async function getGallery(): Promise<HomepageResponse> {
  const response = await api.get<HomepageResponse>("/gallery");
  return response.data;
}
