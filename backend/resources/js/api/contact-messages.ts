import { api } from "./client";

export type ContactMessagePayload = {
  name: string;
  telephone: string;
  question: string;
  website: string;
};

export async function sendContactMessage(
  payload: ContactMessagePayload,
): Promise<string> {
  const response = await api.post<{ message: string }>(
    "/contact-messages",
    payload,
  );

  return response.data.message;
}
