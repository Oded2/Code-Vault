<script>
  import { onMount } from "svelte";
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  import {
    addParams,
    createSbClient,
    dateToStr,
    fetchData,
    maxLen,
    showToast,
  } from "../../hooks.client.js";
  import ArticleCard from "../../components/cards/ArticleCard.svelte";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  export let data;
  const sbApi = data.sbApi;
  const newsApi = data.newsApi;
  const sb = createSbClient(sbApi);
  let userId;
  let toast;
  onMount(async () => {
    const { data } = await sb.auth.getSession();
    if (data.session) {
      userId = data.session.user.id;
    }
  });
  const today = new Date();
  const min = new Date(today.valueOf() - 2592000000);
  let query = "",
    language = "en",
    startDate = dateToStr(min),
    endDate = dateToStr(today),
    sortBy = "relevancy";
  let newsData;
  let inProgress = false;
  const url = "https://newsapi.org/v2/everything";
  $: isRtl = language == "he" || language == "ar";
  async function submit() {
    const newUrl = new URL(url);
    addParams(newUrl, {
      apiKey: newsApi,
      q: query,
      from: startDate,
      to: endDate,
      sortBy: sortBy,
    });
    language ? newUrl.searchParams.append("language", language) : false;
    inProgress = true;
    newsData = await fetchData(newUrl.href);
    inProgress = false;
  }
  async function saveToVault(object = {}) {
    inProgress = true;
    const currentData = await readFromVault();
    inProgress = false;
    currentData.push(object);
    const { error } = await sb
      .from("Vaults")
      .update({ news: currentData })
      .eq("user_id", userId);
    if (error) {
      toast = showToast("error", "Error", error.message);
      return;
    }
    toast = showToast(
      "success",
      "Success",
      `${maxLen(object.title, 20)} has been added to your personal vault.`
    );
  }
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
</script>

<main>
  <Header {sbApi} title={hrefs.newsApi.home.title} />
  <div class="container my-5 font-google-quicksand fw-600">
    <div class="mb-5 text-center">
      <h1 class="fw-bold display-4">{hrefs.newsApi.home.title}</h1>
      <div class="border-start text-start ps-5">
        <p class="fs-4">{hrefs.newsApi.home.description}</p>
      </div>
    </div>
    <form on:submit|preventDefault={submit}>
      <div class="fs-2 row">
        <div class="mb-3 col-md-12">
          <label for="query" class="form-label">Query</label>
          <input
            type="text"
            id="query"
            class="form-control fs-4"
            placeholder="Usually either one word or a phrase"
            required
            bind:value={query}
          />
        </div>

        <div class="mb-3 col-md-6">
          <label for="start" class="form-label">From</label>
          <input
            type="date"
            id="start"
            class="form-control fs-5"
            bind:value={startDate}
            min={dateToStr(min)}
            max={dateToStr(today)}
          />
        </div>
        <div class="mb-3 col-md-6">
          <label for="end" class="form-label">To</label>
          <input
            type="date"
            id="end"
            class="form-control fs-5"
            bind:value={endDate}
            min={dateToStr(min)}
            max={dateToStr(today)}
          />
        </div>
        <div class="mb-3 col-md-6">
          <label for="language" class="form-label">Language</label>
          <select
            class="form-select form-select-lg"
            id="language"
            bind:value={language}
          >
            <option value={null}>Any</option>
            <option value="en" selected>English</option>
            <option value="ar">Arabic</option>
            <option value="zh">Chinese</option>
            <option value="nl">Dutch</option> <option value="fr">French</option>
            <option value="de">German</option>
            <option value="he">Hebrew</option>
            <option value="it">Italian</option>
            <option value="no">Norweigan</option>
            <option value="pt">Portugese</option>
            <option value="ru">Russian</option>
            <option value="es">Spanish</option>
            <option value="sv">Swedish</option>
          </select>
        </div>
        <div class="mb-3 col-md-6">
          <label for="language" class="form-label">Sort By</label>
          <select
            class="form-select form-select-lg"
            id="language"
            bind:value={sortBy}
          >
            <option value="relevancy" selected>Relevancy</option>
            <option value="popularity">Popularity</option>
            <option value="publishedAt"
              >Date (Most recent to most latest)</option
            >
          </select>
        </div>
      </div>
      <div class="mb-3 w-100">
        <button
          class="btn btn-primary btn-lg w-100 fw-bold fs-4"
          disabled={inProgress}
          type="submit">Submit</button
        >
      </div>
    </form>
    {#if newsData}
      <div class="row">
        {#each newsData.articles as article}
          <div class="col-md-6 col-xl-4 d-flex align-items-stretch mb-5">
            <ArticleCard {article} dir={isRtl ? "rtl" : "ltr"}>
              <button
                class="btn btn-secondary btn-lg fs-4 w-100 fw-bold"
                disabled={!userId || inProgress}
                on:click={() => saveToVault(article)}
                ><i class="fa-solid fa-vault" /> Save to Personal Vault</button
              ></ArticleCard
            >
          </div>
        {/each}
      </div>
    {/if}
  </div>
</main>

<ToastSetup {toast} />
