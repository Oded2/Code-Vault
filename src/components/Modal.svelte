<script>
  export let showModal = false;
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
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1;
  }
</style>
