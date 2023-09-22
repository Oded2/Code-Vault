<script>
  import { onMount } from "svelte";
  import { toasts, ToastContainer, FlatToast } from "svelte-toasts";
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  import { createSbClient, isLoggedIn } from "../../hooks.client.js";
  import { goto } from "$app/navigation";
  export let data;
  const api = data.api;
  const sb = createSbClient(api);
  onMount(async () => {
    if (await isLoggedIn(sb)) {
      goto(hrefs.home);
    }
  });
  let toast;
  let email = "",
    password = "";
  let isSubmit = false;
  async function handleSubmit() {
    isSubmit = true;
    const { error } = await sb.auth.signInWithPassword({
      email: email,
      password: password,
    });
    isSubmit = false;
    if (error) {
      showToast("error", "Login Failed", error.message);
      return;
    }
    goto(hrefs.home);
  }
  function showToast(
    type = "error",
    title = "Login Failed",
    description = "Failed to Login"
  ) {
    toast = toasts.add({
      title: title,
      description: description,
      duration: 5000,
      placement: "bottom-center",
      type: type,
      theme: "dark",
      showProgress: true,
    });
  }
</script>

<main class="full-background">
  <Header title={hrefs.login.title} />

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
              bind:value={password}
            />
            <div class="form-text fs-6">Must be at least 8 chracters long.</div>
          </div>
        </div>
        <div class="card-footer">
          <button
            class="btn btn-primary w-100 fs-4 font-google-quicksand fw-bold"
            type="submit"
            disabled={isSubmit}>Login</button
          >
        </div>
      </form>
    </div>
  </div>
</main>

<ToastContainer><FlatToast data={toast} /></ToastContainer>
