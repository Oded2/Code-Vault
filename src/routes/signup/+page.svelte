<script>
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  import { createSbClient } from "../../hooks.client.js";
  export let data;
  const apiKey = data.apiKey;
  const sb = createSbClient(apiKey);
  let email = "",
    fName = "",
    lName = "",
    password = "",
    confirmPass = "";
  let isSubmit = false;
  async function handleSubmit() {
    isSubmit = true;
    const { data, error } = await sb.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { first_name: fName, last_name: lName },
      },
    });
    isSubmit = false;
  }
</script>

<main class="full-background">
  <Header title={hrefs.signup.title} />
  <div class="container mb-5">
    <div class="py-5 text-center">
      <h1 class="font-google-quicksand fw-bold display-3">
        {hrefs.signup.title}
      </h1>
    </div>
    <div class="card shadow">
      <div class="card-header">
        <span class="font-google-quicksand fw-light"
          >Sign up for Code Vault</span
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
            <label class="form-label" for="fname">First Name</label>
            <input
              class="form-control"
              type="text"
              id="fname"
              bind:value={fName}
            />
          </div>
          <div class="mb-3">
            <label class="form-label" for="lname">Last Name</label>
            <input
              class="form-control"
              type="text"
              id="lname"
              bind:value={lName}
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
          <div class="mb-3">
            <label for="confirm" class="form-label">Confirm Password</label>
            <input
              class="form-control"
              type="password"
              id="confirm"
              minlength="8"
              bind:value={confirmPass}
            />
            <div class="form-text fs-6">Must be at least 8 chracters long.</div>
          </div>
        </div>
        <div class="card-footer">
          <button
            class="btn btn-primary w-100 fs-4 font-google-quicksand fw-bold"
            type="submit">Sign Up</button
          >
        </div>
      </form>
    </div>
  </div>
</main>
