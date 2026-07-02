import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  loginRequest,
  logoutRequest,
  restoreSessionRequest,
} from "../api/auth";
import { setAccessToken, setAuthenticationFailureHandler } from "../api/client";
import type { AuthUser, LoginCredentials } from "../types/auth";
import { AuthContext } from "./AuthContext";
import {
  activateCurrentAuthTab,
  claimCurrentAuthTab,
  releaseCurrentAuthTab,
  startAuthTabHeartbeat,
  subscribeToAuthTabChanges,
} from "./tabSession";

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isActive = true;
    const stopListening = subscribeToAuthTabChanges(() => {
      setAccessToken(null);
      setUser(null);
    });

    setAuthenticationFailureHandler(() => {
      if (isActive) {
        releaseCurrentAuthTab();
        setUser(null);
      }
    });

    if (!claimCurrentAuthTab()) {
      window.queueMicrotask(() => {
        if (isActive) {
          setIsInitializing(false);
        }
      });

      return () => {
        isActive = false;
        stopListening();
        setAuthenticationFailureHandler(null);
      };
    }

    restoreSessionRequest()
      .then((session) => {
        if (isActive) {
          setUser(session.user);
        }
      })
      .catch(() => {
        if (isActive) {
          releaseCurrentAuthTab();
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
      stopListening();
      setAuthenticationFailureHandler(null);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    return startAuthTabHeartbeat();
  }, [user]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const session = await loginRequest(credentials);
    activateCurrentAuthTab();
    setUser(session.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      releaseCurrentAuthTab();
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
