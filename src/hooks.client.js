import { createClient } from "@supabase/supabase-js";
const sbUrl = "https://eflhfylvtszcepnfrccy.supabase.co";
export function randomNum(min, max) {
  const difference = max - min;
  let rand = parseInt(Math.random() * difference + min);
  return rand;
}
export function addParams(link, params) {
  let value;
  for (let key in params) {
    value = params[key];

    link.searchParams.append(key, value);
  }
  return link.toString();
}
export function addParamsString(string, params) {
  const link = new URL("https://codevault.com");
  const linkWithParams = addParams(link, params);
  return linkWithParams.replace("https://codevault.com", string);
}

export async function fetchData(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    console.error(error);
    return false;
  }
  if (response.status != 200) {
    console.error(response.status);
    return false;
  }
  return response.json();
}

export function simplifyString(str) {
  for (let i = 0; i < str.length; i++) {
    str = str.replace(/\s/g, "").toLowerCase();
  }
  return str;
}
export function createSbClient(api) {
  return createClient(sbUrl, api);
}
