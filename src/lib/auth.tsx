import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "user" | "crew";
export type Session = { email: string; name: string; role: Role } | null;

type Ctx = {
  session: Session;
  login: (email: string, password: string, role: Role, name?: string) => void;
  logout: () => void;
};

const AuthCtx = createContext<Ctx | null>(null);
const KEY = "esx.session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {}
  }, []);
  const login: Ctx["login"] = (email, _pw, role, name) => {
    const s: Session = { email, name: name || email.split("@")[0], role };
    localStorage.setItem(KEY, JSON.stringify(s));
    setSession(s);
  };
  const logout = () => {
    localStorage.removeItem(KEY);
    setSession(null);
  };
  return <AuthCtx.Provider value={{ session, login, logout }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}
