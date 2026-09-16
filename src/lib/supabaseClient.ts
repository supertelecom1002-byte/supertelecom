import { createClient } from "@supabase/supabase-js";

export const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://supertelecom-placeholder.supabase.co";
export const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
