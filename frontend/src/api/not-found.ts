import { api } from "./client";
import type { HomepageResponse } from "../types/homepage";

export async function getNotFoundPage(): Promise<HomepageResponse> {
  const response = await api.get<HomepageResponse>("/not-found");
  return response.data;
}
