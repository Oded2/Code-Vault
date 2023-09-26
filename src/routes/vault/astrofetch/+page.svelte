<script>
  import { onMount } from "svelte";
  import Header from "../../../components/Header.svelte";
  import hrefs from "../../../data/hrefs.json";
  import {
    addParamsString,
    createSbClient,
    formatDate,
    maxLen,
    showToast,
  } from "../../../hooks.client.js";
  import { ToastContainer, FlatToast } from "svelte-toasts";
  import { page } from "$app/stores";
  export let data;
  const api = data.api;
  const sb = createSbClient(api);
  let toast;
  let astroArr = [];
  let userId = "";
  let isDelete = false;
  let isValid = false;
  onMount(async () => {
    userId = await getUserId();
    astroArr = await readFromVault(userId);
    if (astroArr) {
      isValid = true;
    }
  });
  const getUserId = async () => {
    const { data } = await sb.auth.getSession();
    return data.session.user.id;
  };
  async function readFromVault(userId) {
    const { data } = await sb
      .from("Vaults")
      .select("astrofetch")
      .eq("user_id", userId);
    return data[0].astrofetch;
  }
  async function deleteFromVault(index = NaN) {
    const deleted = astroArr.splice(index, 1);
    isDelete = true;
    const { error } = await sb
      .from("Vaults")
      .update({ astrofetch: astroArr })
      .eq("user_id", userId);
    isDelete = false;
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
</script>

<main class="full-background">
  <Header
    title={hrefs.vault.astrofetch.title}
    directory={hrefs.vault}
    sbApi={api}
    isProtected={true}
  />

  <div class="container my-5 font-google-quicksand fw-600">
    {#if isValid}
      <div class="row">
        {#each astroArr as item, index}
          <div class="col-sm-6 col-lg-4 mb-5">
            <div class="card h-100 shadow">
              <img src={item.url} alt={item.title} class="card-img-top" />
              <div class="card-header h-100">
                <h3>{item.title}</h3>
              </div>

              <div class="card-body fs-4">
                {maxLen(item.explanation, 100)}
              </div>
              <div class="card-footer">
                <a
                  href={addParamsString(hrefs.astrofetch.viewer.link, {
                    title: item.title,
                    url: item.url,
                    explanation: item.explanation,
                    date: formatDate(item.date),
                    copyright: item.copyright,
                    rel: $page.url,
                  })}
                  class="btn btn-primary fs-4 fw-bold w-100 mb-2"
                  ><i class="fa-solid fa-arrow-up-right-from-square" /> View</a
                >
                <button
                  class="btn btn-outline-danger fs-4 fw-bold w-100"
                  disabled={isDelete}
                  on:click={() => {
                    deleteFromVault(index);
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

<ToastContainer><FlatToast data={toast} /></ToastContainer>

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
