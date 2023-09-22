import { NASA } from "$env/static/private";
import { SUPABASE } from "$env/static/private";
export function load() {
  return { api: NASA, sbApi: SUPABASE };
}
