<script>
  import { page } from "$app/stores";
  import hrefs from "../../../data/hrefs.json";
  export let data;
  const url = $page.url;
  const pageLink = url["href"];
  const title = url.searchParams.get("title");
  const src = url.searchParams.get("url");
  const explanation = url.searchParams.get("explanation");
  const date = url.searchParams.get("date");
  const copyright = url.searchParams.get("copyright");
  const valid = url && title && src && explanation && date && copyright;
  const apiKey = data["api"];
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
  function addParams(link, params) {
    let value;
    for (let key in params) {
      value = params[key];

      link.searchParams.append(key, value);
    }
    return link.toString();
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
  <main class="full-background bg-black text-white">
    <div class="container-fluid">
      <div class="text-center py-4">
        <h1 class="font-google-comfortaa fw-bold title">{title}</h1>
      </div>
      <div class="d-flex justify-content-center">
        <img {src} alt={title} class="img-fluid object-fit-contain" />
      </div>

      <div class="row p-xl-5 mt-5 mt-xl-0">
        <div class="col-xl-6 col-xxl-7 mb-5 mb-xl-0">
          <div class="card text-bg-dark h-100 px-xl-5 py-3">
            <div class="card-header border-light">
              <h1 class="font-google-comfortaa fw-bold">Explanation</h1>
            </div>
            <div class="card-body">
              <p class="fs-3 font-google-quicksand fw-500">{explanation}</p>
            </div>
          </div>
        </div>
        <div class="col-xl-6 col-xxl-5 mb-5 mb-xl-0">
          <div class="card text-bg-dark h-100 px-xl-5 py-3">
            <div class="card-header border-light">
              <h1 class="font-google-comfortaa fw-bold">More</h1>
            </div>
            <div class="card-body">
              <ul
                class="list-group list-group-flush fs-3 font-google-quicksand fw-500"
              >
                <li class="list-group-item text-bg-dark px-0">
                  APOD from <span class="fw-bold">{date}</span>
                </li>
                {#if copyright != "undefined"}
                  <li class="list-group-item text-bg-dark px-0">
                    Copyright: <span class="fw-bold">{copyright}</span>
                  </li>
                {/if}

                <li class="list-group-item text-bg-dark px-0">
                  <button
                    class="btn btn-primary fs-3 w-100 my-1"
                    disabled={isCopy}
                    on:click={copy}>{copyText}</button
                  >
                  <span class="font-google-quicksand fw-light fs-6"
                    >Powered by TinyUrl</span
                  >
                </li>
                <li class="list-group-item text-bg-dark px-0">
                  <a
                    href={hrefs["astrofetch"]["home"]["link"]}
                    class="btn btn-primary fs-3 w-100 my-1"
                    ><i class="fa-solid fa-user-astronaut" /> Return to AstroFetch</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
{:else}
  <a class="fs-1" href={hrefs["astrofetch"]["home"]["link"]}
    >Click here to return to Astrofetch</a
  >
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
    border-radius: 5px;
    scale: 103%;
  }
  .btn {
    border-radius: 20px;
    transition: 0.5s;
  }
  .btn:hover {
    scale: 102%;
  }
  .btn:active {
    scale: 104%;
  }
</style>
