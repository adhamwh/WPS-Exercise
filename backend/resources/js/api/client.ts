import axios, { AxiosHeaders } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { AuthSession } from "../types/auth";
import { isCurrentAuthTabActive } from "../auth/tabSession";

const apiBaseUrl =
  import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const sessionClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let accessToken: string | null = null;
let refreshPromise: Promise<AuthSession> | null = null;
let authenticationFailureHandler: (() => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function setAuthenticationFailureHandler(
  handler: (() => void) | null,
) {
  authenticationFailureHandler = handler;
}

export function refreshSession(): Promise<AuthSession> {
  if (!isCurrentAuthTabActive()) {
    setAccessToken(null);
    authenticationFailureHandler?.();
    return Promise.reject(new Error("This admin tab is no longer active."));
  }

  if (!refreshPromise) {
    refreshPromise = sessionClient
      .post<AuthSession>("/auth/refresh")
      .then((response) => {
        setAccessToken(response.data.access_token);
        return response.data;
      })
      .catch((error: unknown) => {
        setAccessToken(null);
        authenticationFailureHandler?.();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequestConfig;
    const endpoint = originalRequest.url ?? "";
    const skipsRefresh = [
      "/auth/login",
      "/auth/refresh",
      "/auth/logout",
    ].some((path) => endpoint.endsWith(path));

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      skipsRefresh
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const session = await refreshSession();
      originalRequest.headers = AxiosHeaders.from(originalRequest.headers);
      originalRequest.headers.set(
        "Authorization",
        `Bearer ${session.access_token}`,
      );

      return api(originalRequest);
    } catch {
      return Promise.reject(error);
    }
  },
);
