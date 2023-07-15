<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function clicked() {
    dispatch("checked", checked);
  }
  export let round = true;
  export let checked = true;
</script>

<label class="switch">
  <input type="checkbox" bind:checked on:change={clicked} />
  <span class="slider" class:round />
</label>
