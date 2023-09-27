<script>
  import FloatElement from "./FloatElement.svelte";
  export let visible = false,
    inProgress = false;
</script>

{#if visible}
  <FloatElement
    ><button class="btn btn-light fs-2" on:click disabled={inProgress}
      ><i class="fa-solid fa-vault" /></button
    ></FloatElement
  >
{/if}
