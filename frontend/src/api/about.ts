import { api } from "./client";
import type { HomepageResponse } from "../types/homepage";

export async function getAboutPage(): Promise<HomepageResponse> {
  const response = await api.get<HomepageResponse>("/about");
  return response.data;
}
