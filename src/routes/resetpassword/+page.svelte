<script>
  import { goto } from "$app/navigation";
  import { createSbClient, showToast } from "../../hooks.client.js";
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";

  export let data;
  const api = data.sbApi;
  const sb = createSbClient(api);
  let toast;
  let password = "",
    confirmPass = "";

  let isSubmit = false;
  async function updatePass() {
    isSubmit = true;
    const { error } = await sb.auth.updateUser({ password: password });
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
  $: disabled =
    isSubmit ||
    password.length < 8 ||
    confirmPass.length < 8 ||
    password != confirmPass;
</script>

<main>
  <Header sbApi={api} title={hrefs.resetpassword.title} isProtected={true} />
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
            <div class="form-text fs-6">Minimum 8 characters.</div>
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
            {disabled}>Reset Password</button
          >
        </div>
      </div>
    </form>
  </div>
</main>

<ToastSetup {toast} />
