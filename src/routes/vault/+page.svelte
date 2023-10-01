<script>
  import { onMount } from "svelte";
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  import { createSbClient, showToast } from "../../hooks.client.js";
  import Modal from "../../components/Modal.svelte";
  import VaultCard from "../../components/cards/VaultCard.svelte";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  export let data;
  const api = data.sbApi;
  const vaultRef = hrefs.vault;

  const sb = createSbClient(api);
  let fname = "",
    lname = "",
    userId = "";
  let description = "";
  let newValues = { description: { value: "", isSubmit: false } };
  let showDesc = false;
  let toast;
  onMount(async () => {
    const { data } = await sb.auth.getSession();
    if (!data.session) {
      return;
    }
    userId = data.session.user.id;
    fname = data.session.user.user_metadata.first_name;
    lname = data.session.user.user_metadata.last_name;
    if (!(await isVault())) {
      createUserVault();
    }
    getDescription();
  });
  async function createUserVault() {
    const { error } = await sb.from("Vaults").insert({ user_id: userId });
  }
  async function isVault() {
    const { data, error } = await sb
      .from("Vaults")
      .select("user_id")
      .eq("user_id", userId);
    if (error) {
      console.error(error.message);
    }
    if (data.length > 0) {
      return true;
    }
    return false;
  }
  async function getDescription() {
    const { data } = await sb
      .from("Vaults")
      .select("description")
      .eq("user_id", userId);
    description = data[0].description;
  }
  async function editDescription() {
    newValues.description.isSubmit = true;
    const { error } = await sb
      .from("Vaults")
      .update({ description: newValues.description.value })
      .eq("user_id", userId);
    toggleDesc();
    newValues.description.isSubmit = false;
    if (error) {
      toast = showToast("error", "error", error.message);
      return;
    }
    getDescription();
    newValues.description.isSubmit = false;
    toast = showToast("success", "Success", "Description changed successfully");
  }
  function toggleDesc() {
    showDesc = !showDesc;
  }
</script>

<main class="full-background text-bg-light">
  <Header
    title={vaultRef.home.title}
    showTitle={false}
    directory={vaultRef}
    sbApi={api}
    isProtected={true}
  />
  <div class="text-bg-dark">
    <div
      class="container py-5 font-google-quicksand d-flex justify-content-between"
    >
      <div class="mx-auto text-center">
        <h1 class="fw-bold display-3">
          {fname}'s <span class="text-warning">Vault</span>
        </h1>
        <h4 class="fw-600">
          {description}
          <button class="btn btn-outline-light" on:click={toggleDesc}
            ><i class="fa-solid fa-pen-to-square" /> Edit</button
          >
        </h4>
      </div>
    </div>
  </div>
  <div class="container font-google-quicksand py-5">
    <div>
      <h1 class="fw-bold">Welcome to your personal vault!</h1>
      <h3 class="fw-bold">
        Save your favorite items from the website and save them here.
      </h3>
    </div>
    <div class="row">
      <VaultCard
        title={vaultRef.astrofetch.title}
        description={vaultRef.astrofetch.description}
        href={vaultRef.astrofetch.link}
        iconName={vaultRef.astrofetch.icon.name}
      />
      <VaultCard
        title={vaultRef["israeli-driver-test"].title}
        description={vaultRef["israeli-driver-test"].description}
        href={vaultRef["israeli-driver-test"].link}
        iconName={vaultRef["israeli-driver-test"].icon.name}
      />
      <!-- <VaultCard
        title={vaultRef.newsFinder.title}
        description={vaultRef.newsFinder.description}
        href={vaultRef.newsFinder.link}
        iconName={vaultRef.newsFinder.icon}
      /> -->
    </div>
  </div>
</main>

<Modal showModal={showDesc} on:click={toggleDesc}>
  <div class="px-md-5 font-google-quicksand text-center">
    <div class="m-md-5">
      <h1 class="fw-bold">Enter your new description</h1>
      <h2 class="fw-600">
        Current description: <span class="fw-bold">{description}</span>
      </h2>
    </div>
    <input
      type="text"
      class="form-control fs-4"
      placeholder="Enter your vault's description"
      bind:value={newValues.description.value}
    />
    <button
      class="btn btn-primary fs-4 mt-2 fw-bold w-100"
      disabled={newValues.description.isSubmit}
      on:click={editDescription}>Submit</button
    >
  </div>
</Modal>

<ToastSetup {toast} />
