import { SUPABASE } from "$env/static/private";
import { NASA } from "$env/static/private";
export function load() {
  return { api: SUPABASE, nasaApi: NASA };
}
