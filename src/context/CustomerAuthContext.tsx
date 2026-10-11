import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { toast } from "sonner";

export interface CustomerUser {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  isVip: boolean;
}

export interface CustomerAuthContextType {
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

export const LOCAL_STORAGE_USER_KEY = "st_vip_customer_session";

function formatCustomerUser(supabaseUser: User): CustomerUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name:
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      supabaseUser.email?.split("@")[0] ||
      "VIP Member",
    avatarUrl:
      supabaseUser.user_metadata?.avatar_url ||
      supabaseUser.user_metadata?.picture ||
      undefined,
    isVip: true,
  };
}

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | CustomerUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isVip, setIsVip] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isVipModalOpen, setIsVipModalOpen] = useState<boolean>(false);

  // Initialize session & handle OAuth redirects
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      // 1. Immediately hydrate from localStorage to prevent UI flash
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

      // 2. Handle modern PKCE redirect callback if ?code= is present
      if (typeof window !== "undefined" && isSupabaseConfigured) {
        try {
          const params = new URLSearchParams(window.location.search);
          const code = params.get("code");
          if (code) {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error && data?.session?.user) {
              if (mounted) {
                setSession(data.session);
                setUser(data.session.user);
                setIsVip(true);
                try {
                  localStorage.setItem(
                    LOCAL_STORAGE_USER_KEY,
                    JSON.stringify(formatCustomerUser(data.session.user))
                  );
                } catch {
                  // ignore
                }
              }
              // Clean code from URL query without full reload
              const cleanUrl = new URL(window.location.href);
              cleanUrl.searchParams.delete("code");
              window.history.replaceState(
                {},
                document.title,
                cleanUrl.pathname + cleanUrl.search + cleanUrl.hash
              );
            }
          }
        } catch (pkceErr) {
          console.warn("[CustomerAuth] PKCE exchange notice:", pkceErr);
        }
      }

      // 3. Query existing Supabase Auth session
      if (isSupabaseConfigured) {
        try {
          const { data: { session: initialSession }, error: sessionError } =
            await supabase.auth.getSession();
          if (sessionError) {
            console.warn("[CustomerAuth] getSession notice:", sessionError);
          }
          if (mounted && initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            setIsVip(true);
            try {
              localStorage.setItem(
                LOCAL_STORAGE_USER_KEY,
                JSON.stringify(formatCustomerUser(initialSession.user))
              );
            } catch {
              // ignore
            }
            // Clean hash if implicit token was in URL
            if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
              window.history.replaceState(
                {},
                document.title,
                window.location.pathname + window.location.search
              );
            }
          }
        } catch (err) {
          console.warn("[CustomerAuth] Supabase session check error:", err);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    };

    initAuth();

    // 4. Real-time auth listener for OAuth redirects and token refreshes
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          if (!mounted) return;
          setSession(currentSession);
          if (currentSession?.user) {
            setUser(currentSession.user);
            setIsVip(true);
            try {
              localStorage.setItem(
                LOCAL_STORAGE_USER_KEY,
                JSON.stringify(formatCustomerUser(currentSession.user))
              );
            } catch {
              // ignore
            }
            if (event === "SIGNED_IN") {
              toast.success("Welcome back! Google VIP Pass Active.");
            }
          } else if (event === "SIGNED_OUT") {
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
        await new Promise((r) => setTimeout(r, 500));
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

// Unified alias for universal compatibility
export const useAuth = useCustomerAuth;

export default CustomerAuthProvider;
