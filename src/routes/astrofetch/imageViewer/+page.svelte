<script>
  import { page } from "$app/stores";
  import hrefs from "../../../data/hrefs.json";
  const url = $page.url;
  const title = url.searchParams.get("title");
  const src = url.searchParams.get("url");
  const explanation = url.searchParams.get("explanation");
  const date = url.searchParams.get("date");
  const copyright = url.searchParams.get("copyright");
  const valid = url && title && src && explanation && date && copyright;
  let isCopy = false;
  $: copyText = isCopy ? "Copied to Clipboard" : "Copy Link";
  function copy() {
    navigator.clipboard.writeText(url["href"]);
    isCopy = true;
    setTimeout(() => {
      isCopy = false;
    }, 3000);
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
  }
  img:hover {
    border-radius: 0px;
    scale: 101%;
  }
  .btn {
    border-radius: 20px;
  }
</style>
