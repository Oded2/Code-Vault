import { NASA, SUPABASE, TINYURL, NEWSAPI } from "$env/static/private";
export function load() {
  return {
    sbApi: SUPABASE,
    nasaApi: NASA,
    tinyurlApi: TINYURL,
    newsApi: NEWSAPI,
  };
}
