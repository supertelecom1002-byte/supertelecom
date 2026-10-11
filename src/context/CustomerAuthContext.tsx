import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface CustomerUser {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  isVip: boolean;
}

interface CustomerAuthContextType {
  user: User | CustomerUser | null;
  session: Session | null;
  isVip: boolean;
  loading: boolean;
  isVipModalOpen: boolean;
  openVipModal: () => void;
  closeVipModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "st_vip_customer_session";

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | CustomerUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isVip, setIsVip] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isVipModalOpen, setIsVipModalOpen] = useState<boolean>(false);

  // Initialize session
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      // 1. Check local storage for existing session/fallback
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (mounted && parsed) {
              setUser(parsed);
              setIsVip(true);
            }
          }
        } catch {
          // ignore
        }
      }

      // 2. Query Supabase Auth session if configured
      if (isSupabaseConfigured) {
        try {
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          if (mounted && initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            setIsVip(true);
            try {
              localStorage.setItem(
                LOCAL_STORAGE_USER_KEY,
                JSON.stringify({
                  id: initialSession.user.id,
                  email: initialSession.user.email,
                  name: initialSession.user.user_metadata?.full_name || initialSession.user.email?.split("@")[0] || "VIP Member",
                  avatarUrl: initialSession.user.user_metadata?.avatar_url,
                  isVip: true,
                })
              );
            } catch {
              // ignore
            }
          }
        } catch (err) {
          console.warn("[CustomerAuth] Supabase session check notice:", err);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    };

    initAuth();

    // 3. Listen to Supabase Auth state changes (e.g. after Google OAuth redirect)
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, currentSession) => {
          if (!mounted) return;
          setSession(currentSession);
          if (currentSession?.user) {
            setUser(currentSession.user);
            setIsVip(true);
            try {
              localStorage.setItem(
                LOCAL_STORAGE_USER_KEY,
                JSON.stringify({
                  id: currentSession.user.id,
                  email: currentSession.user.email,
                  name: currentSession.user.user_metadata?.full_name || currentSession.user.email?.split("@")[0] || "VIP Member",
                  avatarUrl: currentSession.user.user_metadata?.avatar_url,
                  isVip: true,
                })
              );
            } catch {
              // ignore
            }
          } else {
            // Signed out
            setUser(null);
            setIsVip(false);
            try {
              localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
            } catch {
              // ignore
            }
          }
          setLoading(false);
        }
      );

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  // 1-Click Google Sign-In
  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(20);
        } catch {
          // ignore
        }
      }

      if (isSupabaseConfigured) {
        const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo,
            queryParams: { access_type: "offline", prompt: "consent" },
          },
        });
        if (error) throw error;
      } else {
        // Safe simulated fallback for local environments
        await new Promise((r) => setTimeout(r, 600));
        const demoUser: CustomerUser = {
          id: "vip-google-demo",
          email: "vip.customer@gmail.com",
          name: "VIP Member (Google Verified)",
          avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s96-c",
          isVip: true,
        };
        setUser(demoUser);
        setIsVip(true);
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
        }
        toast.success("Welcome! Google VIP Account Connected.");
        setIsVipModalOpen(false);
      }
    } catch (err: any) {
      console.warn("[CustomerAuth] Google sign in error:", err);
      toast.error(err?.message || "Google Authentication was interrupted.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
      setUser(null);
      setSession(null);
      setIsVip(false);
      toast.info("Signed out from Super Telecom VIP account.");
      setIsVipModalOpen(false);
    } catch (err: any) {
      console.warn("[CustomerAuth] Sign out error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const openVipModal = useCallback(() => setIsVipModalOpen(true), []);
  const closeVipModal = useCallback(() => setIsVipModalOpen(false), []);

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        session,
        isVip,
        loading,
        isVipModalOpen,
        openVipModal,
        closeVipModal,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export function useCustomerAuth(): CustomerAuthContextType {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
}

export default CustomerAuthProvider;
