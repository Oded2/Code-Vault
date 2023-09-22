import { SUPABASE } from "$env/static/private";
export async function load() {
  return { api: SUPABASE };
}
