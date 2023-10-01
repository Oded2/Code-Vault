import { NASA, SUPABASE, TINYURL, GNEWS } from "$env/static/private";
export function load() {
  return {
    sbApi: SUPABASE,
    nasaApi: NASA,
    tinyurlApi: TINYURL,
    gNewsApi: GNEWS,
  };
}
