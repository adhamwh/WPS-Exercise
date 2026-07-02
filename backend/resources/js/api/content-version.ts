import { api } from "./client";

export async function getContentVersion(): Promise<string> {
  const response = await api.get<{ version: string }>("/content-version");
  return response.data.version;
}
