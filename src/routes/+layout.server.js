import { NASA, SUPABASE, TINYURL } from "$env/static/private";
export function load() {
  return { sbApi: SUPABASE, nasaApi: NASA, tinyurlApi: TINYURL };
}
