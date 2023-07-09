<script>
  import hrefs from "../data/hrefs.json";
  export let isHome = false;
  export let directory = null;
  export let activePage = null;
  export let title = "Code Vault";
  const funProjects = hrefs["fun-projects"];
  const funGames = hrefs["fun-games"];
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<nav class="navbar navbar-expand-xl bg-dark navbar-dark">
  <div class="container">
    <a href={hrefs["code vault"]} class="navbar-brand"
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
      {#if directory == "fun-projects"}
        <ul class="navbar-nav ms-xl-5">
          <li>
            <a
              href={funProjects["home"]}
              class="nav-link"
              class:active={activePage == "home"}>Fun Projects</a
            >
          </li>
          <li>
            <a
              href={funProjects["encrypt"]}
              class="nav-link"
              class:active={activePage == "encrypt"}>Encrypt</a
            >
          </li>
          <li>
            <a
              href={funProjects["decrypt"]}
              class="nav-link"
              class:active={activePage == "decrypt"}>Decrypt</a
            >
          </li>
          <li>
            <a
              href={funProjects["ccvalidator"]}
              class="nav-link"
              class:active={activePage == "ccvalidator"}
              >Credit Card Validator</a
            >
          </li>
          <li>
            <a
              href={funProjects["ccgenerator"]}
              class="nav-link"
              class:active={activePage == "ccgenerator"}
              >Credit Card Generator</a
            >
          </li>
          <li>
            <a
              href={funProjects["photodata"]}
              class="nav-link"
              class:active={activePage == "photodata"}>Metadata Viewer</a
            >
          </li>
        </ul>
      {:else if directory == "fun-games"}
        <ul class="navbar-nav ms-xl-5">
          <li>
            <a
              href={funGames["home"]}
              class="nav-link"
              class:active={activePage == "home"}>Fun Games</a
            >
          </li>
          <li>
            <a
              href={funGames["wordguess"]}
              class="nav-link"
              class:active={activePage == "wordguess"}>Word Guess</a
            >
          </li>
          <li>
            <a
              href={funGames["numberguess"]}
              class="nav-link"
              class:active={activePage == "numberguess"}>Number Guess</a
            >
          </li>
        </ul>
      {/if}
      <ul class="navbar-nav ms-auto">
        <li>
          <a href={hrefs["about"]} class="nav-link">About</a>
        </li>
        <li>
          <a href={hrefs["contact"]} class="nav-link"
            ><i class="fa-solid fa-envelope" /> Contact</a
          >
        </li>
      </ul>
    </div>
  </div>
</nav>
