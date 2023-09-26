<script>
  import { ToastContainer, FlatToast } from "svelte-toasts";
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  import { createSbClient, showToast } from "../../hooks.client.js";

  export let data;
  const apiKey = data.apiKey;
  const sb = createSbClient(apiKey);
  let toast;
  let email = "",
    fName = "",
    lName = "",
    password = "",
    confirmPass = "";
  let isSubmit = false,
    isComplete = false;
  function validatePass() {
    return password == confirmPass;
  }
  async function handleSubmit() {
    if (!validatePass()) {
      toast = showToast(
        "error",
        "Signup Failed",
        "Passwords must be matching."
      );
      return;
    }
    isSubmit = true;
    const { error } = await sb.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { first_name: fName, last_name: lName },
      },
    });

    if (error) {
      isSubmit = false;
      toast = showToast("error", `Error: ${error.status}`, error.message);
      return;
    }
    isComplete = true;
  }
  $: disabled =
    isSubmit ||
    password.length < 8 ||
    confirmPass.length < 8 ||
    password != confirmPass ||
    email.length == 0;
</script>

<main class="full-background" class:text-bg-dark={isComplete}>
  <Header title={hrefs.signup.title} sbApi={apiKey} noAccount={true} />
  {#if !isComplete}
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
              <div class="form-text fs-6">
                Must be at least 8 characters long.
              </div>
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
              {disabled}>Sign Up</button
            >
          </div>
        </form>
      </div>
    </div>
  {:else}
    <div class="container py-5 overflow-auto">
      <div class="text-center font-google-quicksand">
        <div>
          <h1 class="display-2 fw-600">Thank you!</h1>
          <h1 class=" fw-bold">
            A verification email was sent to
            <span class="text-warning">{email}</span>. Click the link and you
            will be signed in automatically.
          </h1>
        </div>
      </div>
    </div>
  {/if}
</main>

<ToastContainer>
  <FlatToast data={toast} />
</ToastContainer>
