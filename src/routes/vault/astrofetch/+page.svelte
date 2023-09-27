<script>
  import { onMount } from "svelte";
  import Header from "../../../components/Header.svelte";
  import hrefs from "../../../data/hrefs.json";
  import { fade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import {
    addParamsString,
    createSbClient,
    fetchData,
    formatDate,
    formatDateStr,
    maxLen,
    showToast,
  } from "../../../hooks.client.js";
  import { page } from "$app/stores";
  import ToastSetup from "../../../components/setup/ToastSetup.svelte";
  import Modal from "../../../components/Modal.svelte";
  export let data;
  const sbApi = data.api;
  const nasaApi = data.nasaApi;
  const sb = createSbClient(sbApi);
  const nasaUrl = "https://api.nasa.gov/planetary/apod";
  let toast;
  let astroArr = [];
  let userId = "";
  let inProgress = false;
  let showModal = false;
  let userDate = new Date().toISOString().split("T")[0];
  $: isValid = astroArr.length > 0;
  onMount(async () => {
    userId = await getUserId();
    astroArr = await readFromVault();
  });
  const getUserId = async () => {
    const { data } = await sb.auth.getSession();
    return data.session.user.id;
  };
  async function readFromVault() {
    const { data } = await sb
      .from("Vaults")
      .select("astrofetch")
      .eq("user_id", userId);
    return data[0].astrofetch;
  }
  async function deleteFromVault(item = {}) {
    const index = astroArr.indexOf(item);
    const deleted = astroArr.splice(index, 1);
    inProgress = true;
    const { error } = await sb
      .from("Vaults")
      .update({ astrofetch: astroArr })
      .eq("user_id", userId);
    inProgress = false;
    if (error) {
      toast = showToast("error", "Error", error.message);
      return;
    }
    toast = showToast(
      "success",
      "Deleted from Vault",
      `${maxLen(
        deleted[0].title,
        10
      )} has been deleted from your personal vault.`
    );
    astroArr = astroArr;
  }
  function toggleModal() {
    showModal = !showModal;
  }
  async function fetchImage() {
    const minDate = new Date("1995-06-16"),
      maxDate = new Date(),
      user = new Date(userDate);
    const minValue = minDate.valueOf(),
      maxValue = maxDate.valueOf(),
      userValue = user.valueOf();
    if (userValue < minValue) {
      toast = showToast(
        "error",
        "Error",
        `Date must be after ${formatDate(minDate)}`
      );
      return;
    }
    if (userValue > maxValue) {
      toast = showToast(
        "error",
        "Error",
        `Date must be before ${formatDate(maxDate)}`
      );
      return;
    }
    const url = addParamsString(nasaUrl, { api_key: nasaApi, date: userDate });
    inProgress = true;
    const astroData = await fetchData(url);
    astroArr.push(astroData);
    const { error } = await sb
      .from("Vaults")
      .update({ astrofetch: astroArr })
      .eq("user_id", userId);
    inProgress = false;
    if (error) {
      toast = showToast("error", "Error", error.message);
      return;
    }
    toast = showToast(
      "success",
      "Added to personal vault",
      `${maxLen(astroData.title, 20)} added to personal vault.`
    );
    toggleModal();
    astroArr = astroArr;
  }
</script>

<Modal {showModal} on:click={toggleModal}>
  <div class="p-3 font-google-quicksand">
    <h1 class="fw-bold text-center">Settings</h1>
    <div class="row">
      <div class="col-md-6">
        <h3 class="fw-bold">Add image from specific date</h3>
        <input type="date" class="form-control" bind:value={userDate} />
        <button
          class="btn btn-primary fs-4 fw-bold w-100 my-2"
          disabled={inProgress}
          on:click={fetchImage}><i class="fa-solid fa-rocket" /> Fetch</button
        >
      </div>
      <!-- <div class="col-md-6">
        <button class="btn btn-danger fs-4 fw-bold w-100"
          ><i class="fa-solid fa-trash-can" /> Delete all images
        </button>
      </div> -->
    </div>
  </div>
</Modal>
<main>
  <Header
    title={hrefs.vault.astrofetch.title}
    directory={hrefs.vault}
    {sbApi}
    isProtected={true}
  />

  <div class="container mb-5 mt-3 font-google-quicksand fw-600">
    {#if isValid}
      <div class="mb-3">
        <button class="btn btn-outline-dark" on:click={toggleModal}
          ><i class="fa-solid fa-gear" /> Settings</button
        >
      </div>
      <div class="row">
        {#each astroArr as item (item)}
          <div
            class="col-sm-6 col-lg-4 mb-5 d-flex align-items-stretch"
            animate:flip={{ duration: 200 }}
            transition:fade={{ duration: 200 }}
          >
            <div class="card shadow">
              <img src={item.url} alt={item.title} class="card-img-top" />

              <div class="card-body fs-4">
                <h3 class="fw-600">{item.title}</h3>
                <p class="fw-500">{maxLen(item.explanation, 100)}</p>
              </div>
              <div class="card-footer">
                <a
                  href={addParamsString(hrefs.astrofetch.viewer.link, {
                    title: item.title,
                    url: item.url,
                    explanation: item.explanation,
                    date: formatDateStr(item.date),
                    copyright: item.copyright,
                    rel: $page.url,
                  })}
                  class="btn btn-primary fs-4 fw-bold w-100 mb-2"
                  ><i class="fa-solid fa-arrow-up-right-from-square" /> View</a
                >
                <button
                  class="btn btn-outline-danger fs-4 fw-bold w-100"
                  disabled={inProgress}
                  on:click={() => {
                    deleteFromVault(item);
                  }}><i class="fa-solid fa-trash-can" /> Delete</button
                >
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <h1 class="fw-bold">No data found.</h1>
    {/if}
  </div>
</main>

<ToastSetup {toast} />

<style>
  img {
    aspect-ratio: 1/1;
    object-fit: cover;
    transition: 0.5s;
  }
  img:hover {
    scale: 95%;
  }
</style>
