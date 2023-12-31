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
  const newsApi = data.gNewsApi;
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
  let query = "",
    language = "en",
    country,
    startDate,
    endDate,
    sortBy = "relevance";
  let newsData;
  let inProgress = false;
  const url = "https://gnews.io/api/v4/search";
  async function submit() {
    if (query.length == 0) {
      toast = showToast("error", "Error", "Query must be filled out.");
      return;
    }
    if (!validateDates()) {
      return;
    }
    const newUrl = new URL(url);
    addParams(newUrl, {
      apikey: newsApi,
      q: query,
      sortby: sortBy,
      max: 9,
    });
    startDate
      ? newUrl.searchParams.append("from", dateStrToISO(startDate))
      : false;
    endDate ? newUrl.searchParams.append("to", dateStrToISO(endDate)) : false;
    language ? newUrl.searchParams.append("lang", language) : false;
    country ? newUrl.searchParams.append("country", country) : false;
    inProgress = true;
    newsData = await fetchData(newUrl);
    inProgress = false;
    const total = newsData.totalArticles;
    total == 0
      ? (toast = showToast(
          "error",
          "No articles found",
          "Try changing your parameters."
        ))
      : false;
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
  function dateStrToISO(dateStr) {
    const date = new Date(dateStr);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  }
  function clearDates(type = "start") {
    if (type == "start") {
      startDate = null;
    } else if (type == "end") {
      endDate = null;
    }
  }
  function validateDates() {
    if (!startDate && !endDate) {
      return true;
    }
    const start = new Date(startDate).valueOf();
    const end = new Date(endDate).valueOf();
    if (start > end) {
      toast = showToast(
        "error",
        "Invalid Dates",
        "Start date cannot be after end date."
      );
      return false;
    }
    if (start > today.valueOf()) {
      toast = showToast(
        "error",
        "Invalid Dates",
        "Start date cannot be after today."
      );
      return false;
    }
    if (end > today.valueOf()) {
      toast = showToast(
        "error",
        "Invalid Dates",
        "End date cannot be afer today"
      );
      return false;
    }
    return true;
  }
</script>

<main>
  <Header {sbApi} title={hrefs.gNews.home.title} />
  <div class="container my-5 font-google-quicksand fw-600">
    <div class="mb-5 text-center">
      <h1 class="fw-bold display-4">{hrefs.gNews.home.title}</h1>
      <div class="border-start text-start ps-1 ps-sm-3">
        <p class="fs-4">{hrefs.gNews.home.description}</p>
      </div>
    </div>
    <form on:submit|preventDefault={submit}>
      <div class="fs-2 row">
        <div class="mb-3 col-md-12">
          <label for="query" class="form-label"
            >Query <span title="This field is required" style="color:red"
              >*</span
            ></label
          >
          <input
            type="text"
            id="query"
            class="form-control fs-4"
            placeholder="Usually either one word or a phrase"
            required
            autocomplete="off"
            bind:value={query}
          />
        </div>
        <div class="mb-3 col-md-6">
          <label for="start" class="form-label">From </label>
          <div class="input-group">
            <button
              type="button"
              class="btn btn-secondary input-group-text"
              on:click={() => clearDates()}>Clear</button
            >
            <input
              type="date"
              id="start"
              class="form-control fs-5"
              bind:value={startDate}
              max={dateToStr(today)}
            />
          </div>
        </div>
        <div class="mb-3 col-md-6">
          <label for="end" class="form-label">To</label>
          <div class="input-group">
            <button
              type="button"
              class="btn btn-secondary input-group-text"
              on:click={() => clearDates("end")}>Clear</button
            >
            <input
              type="date"
              id="end"
              class="form-control fs-5"
              bind:value={endDate}
              max={dateToStr(today)}
            />
          </div>
        </div>
        <div class="mb-3 col-md-4">
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
            <option value="nl">Dutch</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="el">Greek</option>
            <option value="he">Hebrew</option>
            <option value="hi">Hindi</option>
            <option value="it">Italian</option>
            <option value="ja">Japanese</option>
            <option value="ml">Malayalam</option>
            <option value="mr">Marathi</option>
            <option value="no">Norweigan</option>
            <option value="pt">Portugese</option>
            <option value="ro">Romanian</option>
            <option value="ru">Russian</option>
            <option value="es">Spanish</option>
            <option value="sv">Swedish</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="uk">Ukranian</option>
          </select>
        </div>
        <div class="mb-3 col-md-4">
          <label for="country" class="form-label">Country</label>
          <select
            class="form-select form-select-lg"
            id="country"
            bind:value={country}
          >
            <option value={null} selected>Any</option>
            <option value="au">Australia</option>
            <option value="br">Brazil</option>
            <option value="ca">Canada</option>
            <option value="cn">China</option>
            <option value="eg">Egypt</option>
            <option value="fr">France</option>
            <option value="de">Germany</option>
            <option value="gr">Greece</option>
            <option value="hk">Hong Kong</option>
            <option value="in">India</option>
            <option value="ie">Ireland</option>
            <option value="il">Israel</option>
            <option value="it">Italy</option>
            <option value="jp">Japan</option>
            <option value="nl">Netherlands</option>
            <option value="no">Norway</option>
            <option value="pk">Pakistan</option>
            <option value="pe">Peru</option>
            <option value="ph">Philippines</option>
            <option value="pt">Portugal</option>
            <option value="ro">Romania</option>
            <option value="ru">Russia</option>
            <option value="sg">Singapore</option>
            <option value="es">Span</option>
            <option value="se">Sweden</option>
            <option value="ch">Switzerland</option>
            <option value="tw">Taiwan</option>
            <option value="ua">Ukraine</option>
            <option value="gb">United Kingdom</option>
            <option value="us">United States</option>
          </select>
        </div>
        <div class="mb-3 col-md-4">
          <label for="sort" class="form-label">Sort By</label>
          <select
            class="form-select form-select-lg"
            id="sort"
            bind:value={sortBy}
          >
            <option value="relevance" selected>Relevance</option>
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
            <ArticleCard {article}>
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
