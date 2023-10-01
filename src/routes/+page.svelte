<script>
  import Header from "../components/Header.svelte";
  import Modal from "../components/Modal.svelte";
  import Switch from "../components/Switch.svelte";
  import HomeCard from "../components/cards/HomeCard.svelte";
  import learningImg from "../images/svg/learning.svg";
  import hrefs from "../data/hrefs.json";
  import { createSbClient } from "../hooks.client.js";
  import { onMount } from "svelte";
  export let data;
  const api = data.sbApi;
  const sb = createSbClient(api);
  let currentSession;
  let showFilters = false;
  let filter = { html: true, python: true, login: false };
  onMount(async () => {
    const { data } = await sb.auth.getSession();
    if (!data.session) {
      return;
    }
    filter.login = true;
  });
  const toggleFilters = () => {
    showFilters = !showFilters;
  };
  const onKeyDown = (e) => {
    if (e.key == "Escape") {
      showFilters = false;
    }
  };
  function resetFilters(state) {
    for (let i in filter) {
      filter[i] = state;
    }
  }
</script>

<Modal showModal={showFilters} on:click={toggleFilters}
  ><div class="p-4">
    <div>
      <h1 class="font-google-quicksand fw-bold text-center">Select Filters</h1>
    </div>
    <div class="mb-4">
      <div class="row">
        <div class="col-6">
          <button
            class="btn btn-outline-dark w-100"
            on:click={() => resetFilters(true)}>Show All</button
          >
        </div>
        <div class="col-6">
          <button
            class="btn btn-outline-danger w-100"
            on:click={() => resetFilters(false)}>Hide All</button
          >
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6 col-md-3"><h3>Webpages</h3></div>
      <div class="col-sm-6 col-md-3">
        <Switch bind:checked={filter.html} />
      </div>
      <div class="col-sm-6 col-md-3"><h3>Python</h3></div>
      <div class="col-sm-6 col-md-3">
        <Switch bind:checked={filter.python} />
      </div>
      <div class="col-sm-6 col-md-3"><h3>Account Required</h3></div>
      <div class="col-sm-6 col-md-3">
        <Switch bind:checked={filter.login} />
      </div>
    </div>
  </div></Modal
>
<Header isHome={true} sbApi={api} />

<main class="bg-light">
  <section class="text-bg-dark p-5 p-lg-1 text-center text-sm-start">
    <div class="container">
      <div class="d-sm-flex align-items-center justify-content-between">
        <div>
          {#if currentSession}
            <h1>Hello {currentSession}</h1>
          {/if}
          <h1>The Code <span class="text-warning">Vault</span></h1>
          <p class="my-4 font-google-quicksand">
            Check out my coding projects as a learning developer.
          </p>
          <a
            href={hrefs["github"]["profile"]}
            target="_blank"
            class="btn btn-primary btn-lg"
            ><i class="fa-solid fa-up-right-from-square" />&nbsp; Check out my
            Github
          </a>
        </div>
        <img
          class="img-fluid w-50 d-none d-sm-block"
          src={learningImg}
          alt="Person filing files"
        />
      </div>
    </div>
  </section>
  <!-- Boxes -->
  <div class="container">
    <div class="my-2">
      <button
        class="btn btn-outline-dark"
        style="z-index: 999"
        on:click={toggleFilters}
        ><i class="fa-solid fa-bars" />&nbsp; Filters</button
      >
    </div>
    <div class="row">
      <HomeCard
        show={filter.html && filter.login}
        title={hrefs.vault.home.title}
        description="Access your personal vault! Customized to your preference, and good for saving stuff for later."
        icon="vault"
        mainLink={hrefs.vault.home.link}
      />
      <HomeCard
        show={filter.html}
        title={hrefs["fun-projects"]["home"]["title"]}
        description="This website offers various features, including a Text Encrypter,
      Text Decrypter, Credit Card Validator, Credit Card Generator,
      and an Image Metadata Viewer. All available in your web browser."
        icon="laptop"
        mainLink={hrefs["fun-projects"]["home"]["link"]}
      />

      <HomeCard
        show={filter.html || filter.python}
        title={hrefs["astrofetch"]["home"]["title"]}
        description="AstroFetch is a versatile tool that retrieves the astronomy
        picture of the day within a specified date range. It comes in
        two versions: a Python version for image downloads and a
        user-friendly web version. By leveraging NASA's API, AstroFetch
        provides access to captivating and up-to-date astronomical
        imagery."
        icon="user-astronaut"
        mainLink={hrefs["astrofetch"]["home"]["link"]}
        sourceLink={hrefs["github"]["astrofetch"]["source"]}
        ><a
          href={hrefs["github"]["astrofetch"]["download"]}
          class="btn btn-outline-primary fs-5 w-100"
          ><i class="fa-brands fa-python" />&nbsp; Download Python Version</a
        ></HomeCard
      >
      <HomeCard
        show={filter.html}
        title={hrefs["israeli-driver-test"]["home"]["title"]}
        description="Pass the Israeli driver test in any language of your choice. Practice exams customized to your language preference. Overcome language barriers and drive with confidence. Start preparing now for a successful driving experience!"
        icon="taxi"
        mainLink={hrefs["israeli-driver-test"]["home"]["link"]}
      />
      <HomeCard
        show={filter.html}
        title={hrefs.newsApi.home.title}
        description={hrefs.newsApi.home.description}
        icon="newspaper"
        mainLink={hrefs.newsApi.home.link}
      />
      <HomeCard
        show={filter.html}
        title={hrefs["fun-games"]["home"]["title"]}
        description="Discover a collection of fun browser games! No downloads required. Enjoy HTML, CSS, and JavaScript creations, all playable directly in your browser."
        icon="gamepad"
        mainLink={hrefs["fun-games"]["home"]["link"]}
      />

      <HomeCard
        show={filter.python}
        title="Python Encrypter"
        description="The Python code enables text file encryption with password
        protection. It utilizes a command line interface and requires
        Python 3.10 or higher. This versatile tool caters to developers
        familiar with Python, offering a convenient and secure way to
        encrypt sensitive information."
        icon="key"
        mainLink={hrefs["github"]["python-encryption"]["download"]}
        sourceLink={hrefs["github"]["python-encryption"]["source"]}
        type="download"
      />
      <HomeCard
        show={filter.python}
        title="Python Hangman"
        description="The Hangman code for Python is a versatile program that enables
        you to play the popular word-guessing game. It incorporates
        customizable settings that can be adjusted using a JSON file.
        With this code, you can create your own version of Hangman,
        tailoring it to suit your preferences and requirements. This
        Python code offers a convenient way to implement a fun and
        interactive gaming experience."
        icon="keyboard"
        mainLink={hrefs["github"]["python-hangman"]["download"]}
        sourceLink={hrefs["github"]["python-hangman"]["source"]}
        type="download"
      />
    </div>
  </div>
</main>

<svelte:window on:keydown={onKeyDown} />
