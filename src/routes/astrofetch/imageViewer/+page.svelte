<script>
  import { page } from "$app/stores";
  import { addParams } from "../../../hooks.client.js";
  export let data;
  const url = $page.url;
  const pageLink = url["href"];
  const title = url.searchParams.get("title");
  const src = url.searchParams.get("url");
  const explanation = url.searchParams.get("explanation");
  const date = url.searchParams.get("date");
  const copyright = url.searchParams.get("copyright");
  const rel = url.searchParams.get("rel");
  const valid = url && title && src && explanation && date && copyright && rel;
  const apiKey = data.api;
  let shortUrl = null;
  let isCopy = false;
  let copyText = "Copy Link";
  async function copy() {
    isCopy = true;

    if (!shortUrl) {
      copyText = "Fetching Link";
      await fetchTinyurl();
    }
    navigator.clipboard.writeText(shortUrl);
    copyText = "Copied to Clipboard";

    setTimeout(() => {
      copyText = "Copy Link";
      isCopy = false;
    }, 3000);
  }

  async function fetchTinyurl() {
    await fetch(
      addParams(new URL("https://api.tinyurl.com/create"), {
        api_token: apiKey,
      }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: pageLink,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        shortUrl = data["data"]["tiny_url"];
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
</script>

{#if valid}
  <main class="full-background bg-black text-white overflow-hidden">
    <div class="container-fluid">
      <div class="text-center py-4">
        <h1 class="font-google-comfortaa fw-bold title">{title}</h1>
        {#if copyright != "undefined"}
          <span class="font-google-comfortaa fs-6">&copy; {copyright}</span>
        {/if}
      </div>
      <div class="d-flex justify-content-center">
        <img {src} alt={title} class="img-fluid object-fit-contain" />
      </div>
    </div>
    <div class="container py-5">
      <div class="card text-bg-dark h-100 px-sm-4 px-lg-5 py-3">
        <div class="card-header border-light">
          <h1 class="font-google-comfortaa fw-bold">Explanation</h1>
        </div>
        <div class="card-body">
          <p class="fs-3 font-google-quicksand fw-500">{explanation}</p>
        </div>
        <div class="card-footer border-white">
          <p class="font-google-quicksand fw-500 fs-4 text-center">
            APOD from <span class="fw-bold">{date}</span>
          </p>
          <div class="row pt-2 font-google-quicksand">
            <div class="col-lg mb-4 my-lg-0">
              <button
                class="btn btn-primary fs-3 w-100"
                disabled={isCopy}
                on:click={copy}>{copyText}</button
              >
            </div>
            <div class="col-lg">
              <a href={rel} class="btn btn-secondary fs-3 w-100"
                ><i class="fa-solid fa-rotate-left" /> Return</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
{:else}
  <a class="fs-1" href={rel}>Click here to return</a>
{/if}

<svelte:head>
  <title>{title} - Astrofetch</title>
</svelte:head>

<style>
  .title {
    font-size: 3em;
  }
  img {
    border-radius: 10px;
    transition: 0.5s;
    max-height: 95vh;
  }
  img:hover {
    border-radius: 8px;
    scale: 103%;
  }
  .btn {
    border-radius: 20px;
    transition: 0.5s;
  }
</style>
