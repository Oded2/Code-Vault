<script>
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  import { createSbClient, addParamsString } from "../../hooks.client.js";
  import { goto } from "$app/navigation";
  export let data;
  const api = data.api;
  const sb = createSbClient(api);
  let email = "",
    password = "";
  async function handleSubmit() {
    const { data, error } = await sb.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log("Here");
    const redirect = addParamsString("", {
      token: data.session.provider_token,
    });
    console.log(redirect);
    goto(redirect);
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
            type="submit">Login</button
          >
        </div>
      </form>
    </div>
  </div>
</main>
