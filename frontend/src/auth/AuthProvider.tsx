import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  loginRequest,
  logoutRequest,
  restoreSessionRequest,
} from "../api/auth";
import { setAuthenticationFailureHandler } from "../api/client";
import type { AuthUser, LoginCredentials } from "../types/auth";
import { AuthContext } from "./AuthContext";

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isActive = true;

    setAuthenticationFailureHandler(() => {
      if (isActive) {
        setUser(null);
      }
    });

    restoreSessionRequest()
      .then((session) => {
        if (isActive) {
          setUser(session.user);
        }
      })
      .catch(() => {
        if (isActive) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsInitializing(false);
        }
      });

    return () => {
      isActive = false;
      setAuthenticationFailureHandler(null);
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const session = await loginRequest(credentials);
    setUser(session.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isInitializing, login, logout }),
    [user, isInitializing, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
