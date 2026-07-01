import { api } from "./client";
import type { HomepageResponse } from "../types/homepage";

export async function getContactPage(): Promise<HomepageResponse> {
  const response = await api.get<HomepageResponse>("/contact");
  return response.data;
}
