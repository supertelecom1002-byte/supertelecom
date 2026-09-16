import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // Ensure loading starts as true
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAdminStatus = async (email?: string | null): Promise<boolean> => {
    if (!email) return false;
    try {
      const { data, error: queryError } = await supabase
        .from("admin_users")
        .select("id, email, is_active")
        .eq("email", email.trim().toLowerCase())
        .eq("is_active", true)
        .maybeSingle();

      if (queryError) {
        console.warn("admin_users check error:", queryError.message);
        return false;
      }
      return !!data;
    } catch (err) {
      console.warn("admin_users check exception:", err);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Initial session verification - only set loading = false after both session & admin_users queries complete
    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (initialSession?.user?.email) {
          const authorized = await checkAdminStatus(initialSession.user.email);
          if (!mounted) return;

          if (authorized) {
            setSession(initialSession);
            setUser(initialSession.user);
            setIsAdmin(true);
            setError(null);
          } else {
            setError("Access Denied: You are not an authorized administrator");
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setIsAdmin(false);
          }
        } else {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
        }
      } catch (e) {
        console.warn("Auth initialization error:", e);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Subscribe to auth state updates: NO window.location.reload() or window.location.href here!
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;
        if (event === "SIGNED_OUT" || !newSession?.user) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setLoading(true);
        try {
          if (newSession?.user?.email) {
            const authorized = await checkAdminStatus(newSession.user.email);
            if (!mounted) return;

            if (authorized) {
              setSession(newSession);
              setUser(newSession.user);
              setIsAdmin(true);
              setError(null);
            } else {
              setError("Access Denied: You are not an authorized administrator");
              await supabase.auth.signOut();
              setSession(null);
              setUser(null);
              setIsAdmin(false);
            }
          } else {
            setSession(null);
            setUser(null);
            setIsAdmin(false);
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    const redirectUrl = typeof window !== "undefined"
      ? `${window.location.origin}/admin`
      : undefined;

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (signInError) {
      setError(signInError.message);
      throw signInError;
    }
  };

  const signOut = async () => {
    setError(null);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  const clearError = () => setError(null);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        error,
        signInWithGoogle,
        signOut,
        clearError,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
