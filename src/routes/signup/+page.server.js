import { SUPABASE } from "$env/static/private";

export function load() {
  return { apiKey: SUPABASE };
}