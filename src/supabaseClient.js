import { createClient } from "@supabase/supabase-js";

const SB_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://nbxizbbhvcukmhsbprvc.supabase.co";
const SB_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieGl6YmJodmN1a21oc2JwcnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTI4NjIsImV4cCI6MjA5MTg2ODg2Mn0._YzJLYUpBghwMeLGoLU62Sor9vSJAtOrljfe4YzAjNs";

export const supabase = createClient(SB_URL, SB_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
