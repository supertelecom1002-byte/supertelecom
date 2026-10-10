import { createClient } from "@supabase/supabase-js";

export const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://supertelecom-placeholder.supabase.co";
export const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

export const isSupabaseConfigured =
  Boolean(import.meta.env.VITE_SUPABASE_URL) &&
  !import.meta.env.VITE_SUPABASE_URL.includes("placeholder") &&
  Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY) &&
  !import.meta.env.VITE_SUPABASE_ANON_KEY.includes("placeholder");

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: isSupabaseConfigured,
    autoRefreshToken: isSupabaseConfigured,
    detectSessionInUrl: isSupabaseConfigured,
  },
});
