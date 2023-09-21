<script>
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  import md5 from "md5";

  import {
    writeUserData,
    readUserData,
    randomNum,
  } from "../../hooks.client.js";
  export let data;
  const apiKey = data.apiKey;
  let email = "",
    username = "",
    name = "",
    password = "";
  let isSubmit = false;
  async function handleSubmit() {
    isSubmit = true;
    const values = await readUserData(apiKey);
    console.log(values);
    const id = values ? values.length : 1;

    writeUserData(apiKey, id, email, username, name, md5(password));
    isSubmit = false;
  }
</script>

<main class="full-background">
  <Header title={hrefs.signup.title} />
  <div class="container mb-5">
    <div class="py-5 text-center">
      <h1 class="font-google-quicksand fw-bold display-3">Sign Up</h1>
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
              required
              bind:value={email}
            />
          </div>
          <div class="mb-4">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              id="username"
              required
              bind:value={username}
            />
            <div class="form-text fs-6">
              Must be unique, and must use latin alphabet.
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label" for="name">Name</label>
            <input
              class="form-control"
              type="text"
              id="name"
              required
              bind:value={name}
            />
            <div class="form-text fs-6">
              Doesn't have to be unique, can use any alphabet.
            </div>
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
            <div class="form-text fs-6">Must be at least 8 chracters long.</div>
          </div>
        </div>
        <div class="card-footer">
          <button
            class="btn btn-primary w-100 fs-4 font-google-quicksand fw-bold"
            type="submit"
            disabled={isSubmit}>Sign Up</button
          >
        </div>
      </form>
    </div>
  </div>
</main>
