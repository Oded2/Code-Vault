<script>
  import Header from "../../../components/Header.svelte";
  import hrefs from "../../../data/hrefs.json";
  export let data;
  const api = data.api;
</script>

<main class="full-background">
  <Header
    title={hrefs.vault.astrofetch.title}
    directory={hrefs.vault}
    sbApi={api}
    isProtected={true}
  />
</main>
