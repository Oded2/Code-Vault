<script>
  import hrefs from "../data/hrefs.json";
  export let title = "Code Vault";
  export let directory = null;
  export let isHome = false;
  const newTitle = isHome ? "Code Vault" : title + " - Code Vault";
  let breakpoint;
  let pages = [];
  for (let i in directory) {
    pages.push(i);
  }
  if (pages.length < 3) {
    breakpoint = "sm";
  } else if (pages.length >= 3 && pages.length < 5) {
    breakpoint = "md";
  } else {
    breakpoint = "xl";
  }
</script>

<svelte:head>
  <title>{newTitle}</title>
</svelte:head>

<nav class="navbar bg-dark navbar-dark navbar-expand-{breakpoint}">
  <div class="container">
    <a href={hrefs["home"]} class="navbar-brand"
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
      {#if directory}
        <ul class="navbar-nav ms-{breakpoint}-5">
          {#each pages as page}
            <li>
              <a
                href={directory[page]["link"]}
                class="nav-link"
                class:active={directory[page]["title"] == title}
                >{directory[page]["title"]}</a
              >
            </li>
          {/each}
        </ul>
      {/if}
      <ul class="navbar-nav ms-auto">
        <li>
          <a
            href={hrefs["about"]["link"]}
            class="nav-link"
            class:active={title == hrefs["about"]["title"]}>About</a
          >
        </li>
        <li>
          <a
            href={hrefs["contact"]["link"]}
            class="nav-link"
            class:active={title == hrefs["contact"]["title"]}>Contact</a
          >
        </li>
      </ul>
    </div>
  </div>
</nav>
