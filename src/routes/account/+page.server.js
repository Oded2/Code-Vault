import { SUPABASE } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

export function load() {
  throw redirect(307, "/");
  return { sbApi: SUPABASE };
}
