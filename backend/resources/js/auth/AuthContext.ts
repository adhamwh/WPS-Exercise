import { createContext } from "react";
import type { LoginCredentials, AuthUser } from "../types/auth";

export type AuthContextValue = {
  user: AuthUser | null;
  isInitializing: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
