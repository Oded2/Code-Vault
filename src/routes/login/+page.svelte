<script>
  import Header from "../../components/Header.svelte";
  import Modal from "../../components/Modal.svelte";
  import hrefs from "../../data/hrefs.json";
  import { createSbClient, showToast } from "../../hooks.client.js";
  import { goto } from "$app/navigation";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  import { toasts } from "svelte-toasts";
  export let data;
  const api = data.sbApi;
  const sb = createSbClient(api);
  let showModal = false;
  let toast;
  let email = "",
    password = "",
    resetemail = "";
  let isSubmit = false,
    isReset = false;
  async function handleSubmit() {
    isSubmit = true;
    const { error } = await sb.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      isSubmit = false;
      toast = showToast("error", "Login Failed", error.message);
      return;
    }
    goto(hrefs.home);
  }
  async function resetPassword() {
    isReset = true;
    const { error } = await sb.auth.resetPasswordForEmail(resetemail, {
      redirectTo: hrefs.resetpassword.webLink,
    });
    isReset = false;
    if (error) {
      toast = showToast("error", "Error", error.message);
      return;
    }
    toast = showToast(
      "info",
      "Check Email",
      `A password reset link has been sent to ${resetemail}`
    );
  }
  function toggleModal() {
    showModal = !showModal;
  }
  $: disabled = isSubmit || email.length == 0 || password.length == 0;
</script>

<Modal {showModal} on:click={toggleModal}>
  <div class="p-sm-5 fs-2">
    <label for="resetemail" class="font-google-quicksand fw-600"
      >Enter your email</label
    >
    <input
      type="email"
      class="form-control"
      id="resetemail"
      bind:value={resetemail}
    />
    <button
      class="btn btn-primary font-google-quicksand fw-bold fs-4 my-2 w-100"
      disabled={isReset || resetemail.length == 0}
      on:click={resetPassword}>Send link</button
    >
    <div class="form-text fs-6">
      Email might take up to a couple minutes to send.
    </div>
  </div>
</Modal>
<main class="full-background">
  <Header title={hrefs.login.title} sbApi={api} noAccount={true} />
  <div class="container mb-5">
    <div class="py-5 text-center">
      <h1 class="font-google-quicksand fw-bold display-3">
        {hrefs.login.title}
      </h1>
    </div>
    <div class="card shadow">
      <div class="card-header">
        <span class="font-google-quicksand fw-light"
          >Don't have an account? <a href={hrefs.signup.link} class="text-reset"
            >Sign Up</a
          ></span
        >
      </div>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="card-body fs-4">
          <div class="mb-3">
            <label class="form-label" for="userEmail">Email</label>
            <input
              class="form-control"
              type="email"
              id="userEmail"
              required
              bind:value={email}
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              class="form-control"
              type="password"
              id="password"
              minlength="8"
              required
              bind:value={password}
            />
          </div>

          <button
            class="btn btn-outline-danger"
            on:click={toggleModal}
            type="reset">Forgot Password?</button
          >
        </div>
        <div class="card-footer">
          <button
            class="btn btn-primary w-100 fs-4 font-google-quicksand fw-bold"
            type="submit"
            {disabled}>Login</button
          >
        </div>
      </form>
    </div>
  </div>
</main>

<ToastSetup {toast} />
