<script>
  export let showModal = false;
  export let timeOut = null;

  $: if (showModal && timeOut) {
    setTimeout(() => (showModal = false), timeOut);
  }
</script>

{#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="backdrop d-flex align-items-center justify-content-center"
    on:click|self
  >
    <div class=" container h-50 bg-light rounded card">
      <div class="card-body">
        <slot />
      </div>
      <div class="card-footer text-center">
        <span class="fw-light">Click anywhere outside the modal to close.</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    width: 100vw;
    height: 100vh;
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1;
  }
</style>
