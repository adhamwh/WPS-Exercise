import { api } from "./client";
import type { HomepageResponse } from "../types/homepage";

export async function getHomepage(): Promise<HomepageResponse> {
  const response = await api.get<HomepageResponse>("/homepage");
  return response.data;
}