<script>
  export let isHome = false;
</script>

<nav class="navbar navbar-expand-md bg-dark navbar-dark">
  <div class="container">
    <a href="/" class="navbar-brand"
      >{#if isHome}Oded's Website
      {:else}Code <span class="text-warning">Vault</span>{/if}</a
    >
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navmenu"
    >
      <span class="navbar-toggler-icon" />
    </button>
    <div class="collapse navbar-collapse" id="navmenu">
      <ul class="navbar-nav ms-auto">
        <li>
          <a href="/about" class="nav-link">About</a>
        </li>
        <li>
          <a href="/contact" class="nav-link"
            ><i class="fa-solid fa-envelope" /> Contact</a
          >
        </li>
      </ul>
    </div>
  </div>
</nav>
