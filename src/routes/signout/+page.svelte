<script>
  import { createSbClient } from "../../hooks.client.js";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import hrefs from "../../data/hrefs.json";
  export let data;
  const api = data.sbApi;
  const sb = createSbClient(api);
  onMount(async () => {
    await sb.auth.signOut();
    goto(hrefs.home);
  });
</script>
