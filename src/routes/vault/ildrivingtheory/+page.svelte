<script>
  import Header from "../../../components/Header.svelte";
  import hrefs from "../../../data/hrefs.json";
  import Results from "../../../components/Results.svelte";
  import { createSbClient, showToast } from "../../../hooks.client.js";
  import { onMount } from "svelte";
  import Fullscreen from "../../../components/Fullscreen.svelte";
  import ToastSetup from "../../../components/setup/ToastSetup.svelte";
  import { fade } from "svelte/transition";
  import { flip } from "svelte/animate";
  export let data;
  const api = data.sbApi;
  const sb = createSbClient(api);
  let toast;
  let dataArr = [];
  let userId;
  let showFullScreen = false,
    isDelete = false;
  let currentQuestions = [];
  $: isValid = dataArr.length > 0 && userId;
  onMount(async () => {
    userId = await getUserId();
    const current = await readFromVault();
    for (let i of current) {
      dataArr.push(JSON.parse(i));
    }
    dataArr = dataArr;
  });
  const toggleFullScreen = () => {
    showFullScreen = !showFullScreen;
  };
  const getUserId = async () => {
    const { data } = await sb.auth.getSession();
    return data.session.user.id;
  };
  async function readFromVault() {
    const { data } = await sb
      .from("Vaults")
      .select("ildriver")
      .eq("user_id", userId);
    const result = data[0].ildriver;
    if (result) {
      return result;
    }
    return [];
  }
  const getScore = (data = [], percent = true) => {
    let score = 0;
    for (let i of data) {
      if (i.isCorrect) {
        score++;
      }
      if (!percent) {
        return score;
      }
      return parseInt((score / data.length) * 100);
    }
  };
  const showResults = (data) => {
    currentQuestions = data;
    toggleFullScreen();
  };
  async function deleteFromVault(item = {}) {
    const index = dataArr.indexOf(item);
    dataArr.splice(index, 1);
    let updated = [];
    for (let i of dataArr) {
      updated.push(JSON.stringify(i));
    }

    isDelete = true;
    const { error } = await sb
      .from("Vaults")
      .update({ ildriver: updated.length != 0 ? updated : null })
      .eq("user_id", userId);
    isDelete = false;
    if (error) {
      toast = showToast("error", "Error", error.message);
      return;
    }
    toast = showToast(
      "success",
      "Deleted from Vault",
      "Your test has been deleted from your personal vault."
    );
    dataArr = dataArr;
  }
  const deleteAll = async () => {
    if (
      !confirm(
        "Are you sure you want to delete all your tests? There's no going back."
      )
    ) {
      return;
    }
    const { error } = await sb
      .from("Vaults")
      .update({ ildriver: null })
      .eq("user_id", userId);
    if (error) {
      toast = showToast("error", "Error", error.message);
      return;
    }
    dataArr = [];
  };
</script>

<main>
  <Header
    title={hrefs.vault["israeli-driver-test"].title}
    directory={hrefs.vault}
    sbApi={api}
    isProtected={true}
  />
  <div class="mt-3 mb-5 font-google-quicksand fw-600 container">
    <div class="mb-3 d-flex">
      <button class="btn btn-outline-danger me-5" on:click={deleteAll}
        ><i class="fa-solid fa-trash-can" /> Clear Tests</button
      >
    </div>
    {#if isValid}
      <div class="row">
        {#each dataArr as test (test)}
          <div
            class="col-sm-6 col-lg-4 mb-5"
            animate:flip={{ duration: 200 }}
            transition:fade={{ duration: 200 }}
          >
            <div class="card fs-3">
              <div class="card-header text-center">
                Test Result: <span
                  class="text-{getScore(test) > 86 ? 'success' : 'danger'}"
                  >{getScore(test) > 86 ? "Pass" : "Fail"}</span
                >
              </div>
              <div class="card-body fw-500">
                <ul>
                  <li>
                    Total Questions: <span class="fw-600">{test.length}</span>
                  </li>
                  <li>
                    Questions Right: <span class="fw-600"
                      >{getScore(test, false)}</span
                    >
                  </li>
                  <li>
                    Result: <span class="fw-600"> {getScore(test)}%</span>
                  </li>
                </ul>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-primary fs-4 fw-bold w-100 mb-2"
                  on:click={showResults(test)}>Show Results</button
                >
                <button
                  class="btn btn-outline-danger fs-4 fw-bold w-100"
                  disabled={isDelete}
                  on:click={() => {
                    deleteFromVault(test);
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
<Fullscreen {showFullScreen} on:click={toggleFullScreen}>
  <Results questions={currentQuestions} />
</Fullscreen>

<ToastSetup {toast} />
