"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SafeUser } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


type AuthContextType = {
  user: SafeUser | null;
  loading: boolean;
  initialLoad:boolean;
  setUser: (user: SafeUser | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  initialLoad : true,
  setUser: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const router = useRouter();
  const {toast} = useToast()
  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include' // Ensure cookies are sent
      });
      
      if (response.ok) {
        setUser(null);
        router.push('/');
        router.refresh(); // Refresh to update the UI
        toast({
          title: "Success",
          description: "You've been logged out successfully",
        });
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          } // Prevent caching
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setInitialLoad(false)
        setLoading(false);
      }
    }
    const handleAuthChange = () => loadUser();
    window.addEventListener('auth', handleAuthChange);
    loadUser();
    return () => {
      window.removeEventListener('auth', handleAuthChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading : initialLoad || loading,  initialLoad, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}