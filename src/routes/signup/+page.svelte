<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { toasts, ToastContainer, FlatToast } from "svelte-toasts";
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  import { createSbClient, isLoggedIn } from "../../hooks.client.js";

  export let data;
  const apiKey = data.apiKey;
  const sb = createSbClient(apiKey);
  onMount(async () => {
    if (await isLoggedIn(sb)) {
      goto(hrefs.home);
    }
  });
  let toast;
  let email = "",
    fName = "",
    lName = "",
    password = "",
    confirmPass = "";
  let isSubmit = false;
  function validatePass() {
    if (password == confirmPass) {
      return true;
    }
    return false;
  }
  async function handleSubmit() {
    if (!validatePass()) {
      showToast("error", "Signup Failed", "Passwords must be matching.");
      return;
    }
    isSubmit = true;
    const { data, error } = await sb.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { first_name: fName, last_name: lName },
      },
    });
    isSubmit = false;
    if (error) {
      showToast("error", `Error: ${error.status}`, error.message);
    }
  }
  function showToast(
    type = "error",
    title = "Signup failed",
    description = "Failed to signup"
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
  <Header title={hrefs.signup.title} sbApi={apiKey} />
  <div class="container mb-5">
    <div class="py-5 text-center">
      <h1 class="font-google-quicksand fw-bold display-3">
        {hrefs.signup.title}
      </h1>
    </div>
    <div class="card shadow">
      <div class="card-header">
        <span class="font-google-quicksand fw-light"
          >Already have an account? <a
            href={hrefs.login.link}
            class="text-reset">Login</a
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
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label" for="fname">First Name</label>
            <input
              class="form-control"
              type="text"
              id="fname"
              bind:value={fName}
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label" for="lname">Last Name</label>
            <input
              class="form-control"
              type="text"
              id="lname"
              bind:value={lName}
              required
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
              required
            />
            <div class="form-text fs-6">Must be at least 8 chracters long.</div>
          </div>
          <div class="mb-3">
            <label for="confirm" class="form-label"
              >Confirm Password
              {#if password == confirmPass}
                <i class="fa-solid fa-circle-check" style="color: #198754;" />
              {:else}
                <i class="fa-solid fa-circle-xmark" style="color: #dc3545;" />
              {/if}
            </label>

            <input
              class="form-control"
              type="password"
              id="confirm"
              minlength="8"
              bind:value={confirmPass}
            />
            <div class="form-text fs-6">Match your password.</div>
          </div>
        </div>
        <div class="card-footer">
          <button
            class="btn btn-primary w-100 fs-4 font-google-quicksand fw-bold"
            type="submit"
            disabled={isSubmit || password != confirmPass}>Sign Up</button
          >
        </div>
      </form>
    </div>
  </div>
</main>

<ToastContainer>
  <FlatToast data={toast} />
</ToastContainer>
