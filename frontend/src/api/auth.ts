import axios from "axios";
import { api, refreshSession, setAccessToken } from "./client";
import type {
  AuthApiError,
  AuthSession,
  LoginCredentials,
} from "../types/auth";

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  const response = await api.post<AuthSession>("/auth/login", credentials);
  setAccessToken(response.data.access_token);

  return response.data;
}

export async function restoreSessionRequest(): Promise<AuthSession> {
  return refreshSession();
}

export async function logoutRequest(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } finally {
    setAccessToken(null);
  }
}

export function getAuthApiError(error: unknown): AuthApiError {
  if (!axios.isAxiosError<AuthApiError>(error)) {
    return { message: "Something went wrong. Please try again." };
  }

  return error.response?.data ?? {
    message: "Unable to reach the server. Please try again.",
  };
}
