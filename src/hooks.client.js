import { compress, decompress } from "brotli-compress";

export function randomNum(min, max) {
  const difference = max - min;
  let rand = Math.floor(Math.random() * difference) + min;
  return rand;
}
export function addParams(link, params) {
  link = new URL(link);
  let value;
  for (let key in params) {
    value = params[key];

    link.searchParams.append(key, value);
  }
  return link.toString();
}
export function addParamsString(string, params) {
  const link = "https://codevault.com";
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

export async function brotliCompress(text) {
  let a = await compress(text);
  return Buffer.from(a);
}
export async function brotliDecompress(block) {
  return await decompress(block);
}
