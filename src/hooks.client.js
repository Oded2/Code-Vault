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
