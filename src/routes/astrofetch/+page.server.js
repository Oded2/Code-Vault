import { NASA } from "$env/static/private";
console.log("Hello world");
export function load() {
  return { api: NASA };
}
