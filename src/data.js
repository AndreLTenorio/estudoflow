import { supabase } from "./supabaseClient";

/* Lê os dados do usuário logado (linha única por user_id). */
export async function loadUserData(userId) {
  const { data, error } = await supabase
    .from("app_data")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data?.data || null;
}

/* Salva (upsert) os dados do usuário logado. */
export async function saveUserData(userId, payload) {
  const { error } = await supabase.from("app_data").upsert({
    user_id: userId,
    data: payload,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}
