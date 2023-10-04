<script>
  import { onMount } from "svelte";
  import Header from "../../../components/Header.svelte";
  import ArticleCard from "../../../components/cards/ArticleCard.svelte";
  import hrefs from "../../../data/hrefs.json";
  import { createSbClient, maxLen, showToast } from "../../../hooks.client.js";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import ToastSetup from "../../../components/setup/ToastSetup.svelte";
  export let data;
  const sbApi = data.sbApi;
  const sb = createSbClient(sbApi);
  let toast;
  let articles = [];
  let userId;
  let inProgress = false;
  onMount(async () => {
    inProgress = true;
    const { data } = await sb.auth.getSession();
    userId = data.session.user.id;
    articles = await readFromVault();
    inProgress = false;
  });
  async function readFromVault() {
    const { data, error } = await sb
      .from("Vaults")
      .select("news")
      .eq("user_id", userId);
    if (error) {
      toast = showToast("error", "Error", error.message);
      return;
    }
    return data[0].news;
  }
  async function deleteFromVault(article = {}) {
    const index = articles.indexOf(article);
    articles.splice(index, 1);
    inProgress = true;
    const { error } = await sb
      .from("Vaults")
      .update({ news: articles })
      .eq("user_id", userId);
    inProgress = false;
    if (error) {
      toast = showToast("error", "Error", error.message);
      return;
    }
    toast = showToast(
      "success",
      "Success",
      `${maxLen(article.title, 10)} has been deleted from your personal vault.`
    );
  }
  async function deleteAll() {
    if (
      !confirm("Are you sure you want to this? This action cannot be undone.")
    ) {
      return;
    }
    const { error } = await sb
      .from("Vaults")
      .update({ news: [] })
      .eq("user_id", userId);
    if (error) {
      toast = showToast("error", "Error", error.message);
      return;
    }
    articles = [];
    toast = showToast(
      "success",
      "Cleared Articles",
      "All your saved articles have been deleted from your personal vault."
    );
  }
</script>

<main>
  <Header
    {sbApi}
    title={hrefs.vault.newsFinder.title}
    directory={hrefs.vault}
    isProtected={true}
  />

  <div class="container font-google-quicksand fw-600 mb-5 mt-3">
    {#if articles.length > 0}
      <div class="mb-3 d-flex">
        <button class="btn btn-outline-danger me-5" on:click={deleteAll}
          ><i class="fa-solid fa-trash-can" /> Clear Articles</button
        >
      </div>
      <div class="row">
        {#each articles as article (article)}
          <div
            class="col-md-6 col-xl-4 d-flex align-items-stretch mb-5"
            animate:flip={{ duration: 400 }}
            transition:fade={{ duration: 400 }}
          >
            <ArticleCard {article}>
              <button
                class="btn btn-outline-danger btn-lg fs-4 w-100 fw-bold"
                disabled={inProgress}
                on:click={() => deleteFromVault(article)}
                ><i class="fa-solid fa-trash-can" /> Delete from Vault</button
              >
            </ArticleCard>
          </div>
        {/each}
      </div>
    {:else}
      <h1 class="fw-bold">No data found.</h1>
    {/if}
  </div>
</main>

<ToastSetup {toast} />
