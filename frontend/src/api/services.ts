import { api } from "./client";
import type { HomepageResponse } from "../types/homepage";

export async function getServicesPage(): Promise<HomepageResponse> {
  const response = await api.get<HomepageResponse>("/services");
  return response.data;
}
