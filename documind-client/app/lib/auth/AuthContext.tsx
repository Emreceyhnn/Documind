"use client";

import { createContext, useCallback, useMemo, useState } from "react";
import {
  login as loginAction,
  register as registerAction,
  logout as logoutAction,
} from "@/app/lib/api/auth";
import type {
  AuthActionResult,
  AuthContextValue,
  AuthStatus,
  RegisterInputApi,
  User,
} from "../type/auth";

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

interface AuthContextProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export default function AuthContextProvider({
  children,
  initialUser = null,
}: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [status, setStatus] = useState<AuthStatus>(
    initialUser ? "authenticated" : "unauthenticated"
  );

  const login = useCallback(
    async (email: string, password: string): Promise<AuthActionResult> => {
      setStatus("loading");
      const result = await loginAction({ email, password });
      if (result.success) {
        setUser(result.user);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
      return result;
    },
    []
  );

  const register = useCallback(
    async (input: RegisterInputApi): Promise<AuthActionResult> => {
      setStatus("loading");
      const result = await registerAction(input);
      if (result.success) {
        setUser(result.user);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
      return result;
    },
    []
  );

  const logout = useCallback(async () => {
    setStatus("loading");
    try {
      await logoutAction();
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
