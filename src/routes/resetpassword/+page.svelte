<script>
  import { goto } from "$app/navigation";
  import { createSbClient, isLoggedIn, showToast } from "../../hooks.client.js";
  import { FlatToast, ToastContainer } from "svelte-toasts";
  import Header from "../../components/Header.svelte";
  import { onMount } from "svelte";
  import hrefs from "../../data/hrefs.json";

  export let data;
  const api = data.api;
  const sb = createSbClient(api);
  let toast;
  let password = "",
    confirmPass = "";

  let isSubmit = false;
  onMount(async () => {
    if (!(await isLoggedIn(sb))) {
      goto(hrefs.home);
    }
  });
  async function updatePass() {
    isSubmit = true;
    const { data, error } = await sb.auth.updateUser({ password: password });
    if (error) {
      isSubmit = false;
      toast = showToast("error", "Error", error.message);
      return;
    }
    toast = showToast(
      "success",
      "Password changed",
      "Redirecting in 5 seconds"
    );
    setTimeout(() => {
      goto(hrefs.home);
    }, 5000);
  }
</script>

<main>
  <Header sbApi={api} title={hrefs.resetpassword.title} />
  <div class="container py-5 font-google-quicksand fs-4">
    <form on:submit|preventDefault={updatePass}>
      <div class="card">
        <div class="card-header"><span>Reset Password</span></div>
        <div class="card-body fs-3">
          <div class="mb-3">
            <label class="fw-bold" for="password">New Password</label>
            <input
              type="password"
              id="password"
              class="form-control"
              minlength="8"
              required
              bind:value={password}
            />
          </div>
          <div class="mb-3">
            <label class="fw-bold" for="confirmpass"
              >Confirm Password {#if password == confirmPass}
                <i class="fa-solid fa-circle-check" style="color: #198754;" />
              {:else}
                <i class="fa-solid fa-circle-xmark" style="color: #dc3545;" />
              {/if}</label
            >
            <input
              type="password"
              id="confirmpass"
              class="form-control"
              minlength="8"
              required
              bind:value={confirmPass}
            />
          </div>
        </div>
        <div class="card-footer">
          <button
            class="btn btn-primary fs-4 fw-bold w-100"
            type="submit"
            disabled={password != confirmPass || isSubmit}
            >Reset Password</button
          >
        </div>
      </div>
    </form>
  </div>
</main>

<ToastContainer><FlatToast data={toast} /></ToastContainer>
