"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSession, UserSession } from "@/lib/supabase";

// Define the AuthContext type
type AuthContextType = {
  session: UserSession | null;
  loading: boolean;
};

// Create the AuthContext
const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getSession();
        setSession(session);
      } catch (error) {
        console.error("Error loading session:", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
