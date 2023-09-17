<script>
  import Header from "../../../components/Header.svelte";
  import FloatElement from "../../../components/FloatElement.svelte";
  import DarkModeSwitch from "../../../components/DarkModeSwitch.svelte";
  import { addParams, fetchData } from "../../../hooks.client.js";
  import hrefs from "../../../data/hrefs.json";
  export let data;
  const apiKey = data.apiKey;
  let params = { sol: 1000, api_key: apiKey };
  let array = [];
  let inProgress = false,
    darkMode = true;
  let currentImage = 0;
  async function fetchImages() {
    const url = new URL(
      "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos"
    );
    const fetchUrl = addParams(url, params);
    inProgress = true;
    const tempData = await fetchData(fetchUrl);
    inProgress = false;
    if (!tempData) {
      //TODO operation when fetching didn't work
      console.error("Can't fetch");
      return;
    }
    array = tempData.photos;
    console.log(array);
  }
</script>

<FloatElement>
  <DarkModeSwitch bind:checked={darkMode} />
</FloatElement>
<main class="full-background" class:text-bg-dark={darkMode}>
  <Header directory={hrefs.astrofetch} title={hrefs.astrofetch.mars.title} />
  <div class="container">
    <div class="py-5">
      <h1 class="font-google-comfortaa fw-bold display-2 text-center">Mars</h1>
    </div>
    <div>
      <form on:submit|preventDefault={fetchImages}>
        <div class="fs-2">
          <div class="mb-3">
            <label class="font-google-quicksand fw-600" for="userSol">Sol</label
            >
            <input
              type="number"
              id="userSol"
              class="form-control"
              bind:value={params.sol}
              required
            />
          </div>
          <div class="mb-3">
            <button
              type="submit"
              class="btn btn-primary fs-4 font-google-quicksand fw-bold w-100"
              disabled={inProgress}
              ><i class="fa-solid fa-rocket" /> Fetch</button
            >
          </div>
        </div>
      </form>
    </div>
    {#if array.length > 0}
      <div class="vh-100 overflow-auto">
        {#each array as image, index}
          <div hidden={index != currentImage}>
            <div class="mars-title overflow-auto">
              <h1>{image["id"]}</h1>
            </div>
            <div class="mars-image">
              <img
                class="img-fluid w-100 h-100 object-fit-contain"
                src={image["img_src"]}
                alt="Mars"
              />
            </div>
          </div>
        {/each}
        <div class="row">
          <div class="col">
            <button
              on:click={() => {
                currentImage--;
              }}
              class="btn btn-primary w-100">Back</button
            >
          </div>
          <div class="col">
            <button
              on:click={() => {
                currentImage++;
              }}
              class="btn btn-primary w-100">Next</button
            >
          </div>
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    transition: 0.5s;
  }
  div.mars-title {
    height: 10%;
  }
  div.mars-image {
    height: 70%;
    overflow: hidden;
  }
</style>
