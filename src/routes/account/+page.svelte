<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { FlatToast, ToastContainer } from "svelte-toasts";
  import Header from "../../components/Header.svelte";
  import FloatElement from "../../components/FloatElement.svelte";
  import DarkModeSwitch from "../../components/DarkModeSwitch.svelte";
  import Modal from "../../components/Modal.svelte";
  import { createSbClient, showToast } from "../../hooks.client.js";
  import hrefs from "../../data/hrefs.json";
  export let data;
  const api = data.sbApi;
  const sb = createSbClient(api);
  let toast;
  let dark = false,
    showEmail = false,
    showName = false;

  //   toggleModal();
  let userData;
  let values = { email: "", fname: "", lname: "" };
  let newValues = { email: "", fname: "", lname: "" };
  let toChange = { email: false, name: false, password: false };
  onMount(async () => {
    const { data, error } = await sb.auth.getSession();
    if (!data.session) {
      goto(hrefs.home);
      return;
    }
    userData = data.session.user;
    values.email = userData.email;
    values.fname = userData.user_metadata.first_name;
    values.lname = userData.user_metadata.last_name;
    newValues.fname = values.fname;
    newValues.lname = values.lname;
  });
  function toggleEmail() {
    showEmail = !showEmail;
  }
  function toggleName() {
    showName = !showName;
  }
  async function updateEmail() {
    toChange.email = true;
    const { data, error } = await sb.auth.updateUser({
      email: newValues.email,
    });
    toChange.email = false;
    toggleEmail();
    if (error) {
      toast = showToast("error", "Couldn't change email", error.message);
      return;
    }

    toast = showToast(
      "info",
      "Check Email",
      `Validate your new email by checking the inbox on ${newValues.email}`
    );
  }
  async function updateName() {
    toChange.name = true;
    const { data, error } = await sb.auth.updateUser({
      data: {
        first_name: newValues.fname,
        last_name: newValues.lname,
      },
    });
    toChange.name = false;
    toggleName();
    if (error) {
      toast = showToast("error", "Couldn't change name", error.message);
      return;
    }

    toast = showToast(
      "success",
      "Your name has been changed",
      `You will now be known as ${newValues.fname} ${newValues.lname}`
    );
  }
</script>

<Modal showModal={showEmail} on:click={toggleEmail}>
  <div class="p-sm-5 mx-sm-5 text-center">
    <h1 class="font-google-quicksand fw-bold">Edit email</h1>
    <h4 class="font-google-quicksand fw-600">Old email: {values.email}</h4>
    <input
      type="email"
      class="form-control fs-4"
      placeholder="Type your new email here"
      bind:value={newValues.email}
      disabled={toChange.email}
    />
    <button
      class="btn btn-primary fs-4 font-google-quicksand fw-bold w-100 my-2"
      on:click={updateEmail}
      disabled={toChange.email}>Confirm</button
    >
  </div>
</Modal>

<Modal showModal={showName} on:click={toggleName}>
  <div class="p-sm-5 mx-sm-5 text-center">
    <h1 class="font-google-quicksand fw-bold">Edit name</h1>
    <h4 class="font-google-quicksand fw-600">
      Old name: {values.fname}
      {values.lname}
    </h4>
    <div class="row">
      <div class="col-md">
        <input
          type="text"
          class="form-control fs-4"
          placeholder="Type your new first name here"
          bind:value={newValues.fname}
          disabled={toChange.name}
        />
      </div>
      <div class="col-md">
        <input
          type="text"
          class="form-control fs-4"
          placeholder="Type your new last name here"
          bind:value={newValues.lname}
          disabled={toChange.name}
        />
      </div>
    </div>
    <button
      class="btn btn-primary fs-4 font-google-quicksand fw-bold w-100 my-2"
      on:click={updateName}
      disabled={toChange.name}>Confirm</button
    >
  </div>
</Modal>
<FloatElement><DarkModeSwitch bind:checked={dark} /></FloatElement>
<main class="full-background" class:text-bg-dark={dark}>
  <Header title={hrefs.account.title} sbApi={api} />
  {#if userData}
    <div class="container py-5">
      <div class="font-google-quicksand">
        <h1 class="display-4 fw-600">Hello {values.fname}!</h1>
      </div>
      <div class="card shadow my-5" class:text-bg-secondary={dark}>
        <div class="card-header">
          <span class="font-google-quicksand">Account Settings</span>
        </div>
        <div class="card-body fs-2 font-google-quicksand">
          <div class="row mb-3 text-center">
            <div class="col-lg-3 fw-bold">Email</div>
            <div class="col-lg-6 fw-500">{values.email}</div>

            <div class="col-lg-3">
              <button
                class="btn btn-primary font-google-quicksand fw-bold fs-4 w-100"
                on:click={toggleEmail}
                ><i class="fa-solid fa-pen-to-square" /> Edit</button
              >
            </div>
          </div>
          <div class="row mb-3 pt-3 text-center border-top">
            <div class="col-lg-3 fw-bold">Name</div>
            <div class="col-lg-6 fw-500">{values.fname} {values.lname}</div>

            <div class="col-lg-3">
              <button
                class="btn btn-primary font-google-quicksand fw-bold fs-4 w-100"
                on:click={toggleName}
                ><i class="fa-solid fa-pen-to-square" /> Edit</button
              >
            </div>
          </div>
          <div class="pt-3 text-center border-top">
            <a
              href={hrefs.resetpassword.link}
              class="btn btn-outline-danger font-google-quicksand fw-bold fs-4 w-100"
              >Reset Password</a
            >
          </div>
        </div>
      </div>
    </div>
  {/if}
</main>

<ToastContainer><FlatToast data={toast} /></ToastContainer>

<style>
  main {
    transition: 0.15s;
  }
</style>
