<script>
  import { page } from "$app/stores";
  import { addParams } from "../hooks.client.js";
  import { addParamsString } from "../hooks.client.js";
  import hrefs from "../data/hrefs.json";
  export let title = null;
  export let directory = null;
  export let isHome = false;
  const newTitle = !title ? "Code Vault" : title + " - Code Vault";
  const url = $page.url["href"];
  let breakpoint;
  let pages = [];
  for (let i in directory) {
    pages.push(i);
  }
  if (pages.length < 3) {
    breakpoint = "sm";
  } else if (pages.length == 3) {
    breakpoint = "md";
  } else if (pages.length == 4) {
    breakpoint = "lg";
  } else {
    breakpoint = "xl";
  }
  const shareParams = {
    twitter: {
      text: 'Check out "' + newTitle + "\", from Oded's coding portfolio!",
      url: url,
    },
    facebook: {
      u: url,
    },
  };
  const shareLinks = {
    twitter: addParams(
      "https://twitter.com/intent/tweet",
      shareParams["twitter"]
    ),
    facebook: addParams(
      "https://facebook.com/share.php",
      shareParams["facebook"]
    ),
    mail: addParamsString("mailto:", {
      subject: "Check out " + newTitle,
      body:
        "Code Vault is Oded's coding portfolio, full of unique projects! Check it out at " +
        url,
    }),
  };
  function copyLink() {
    navigator.clipboard.writeText(url);
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
        <li class="d-none d-{breakpoint}-block">
          <div class="btn-group mx-{breakpoint}-2">
            <button
              type="button"
              class="btn btn-primary dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <i class="fa-solid fa-share-from-square" /> Share
            </button>
            <ul class="dropdown-menu text-center">
              <li>
                <a
                  href={shareLinks["twitter"]}
                  class="dropdown-item fs-1"
                  target="_blank"
                  ><i
                    class="fa-brands fa-x-twitter"
                    style="color: #000000;"
                  /></a
                >
              </li>
              <li>
                <a
                  href={shareLinks["facebook"]}
                  class="dropdown-item fs-1"
                  target="_blank"
                  ><i
                    class="fa-brands fa-facebook"
                    style="color: #1877f2;"
                  /></a
                >
              </li>
              <li>
                <a
                  href={shareLinks["mail"]}
                  class="dropdown-item fs-1"
                  target="_blank"><i class="fa-solid fa-envelope" /></a
                >
              </li>
              <li>
                <button
                  on:click={copyLink}
                  class="dropdown-item fs-1"
                  target="_blank"><i class="fa-solid fa-link" /></button
                >
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</nav>
