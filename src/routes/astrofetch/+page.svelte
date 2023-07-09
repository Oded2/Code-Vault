<script>
  import Header from "../../components/Header.svelte";
  import nasaLogo from "../../images/svg/NASA.svg";
  import rocketImg from "../../images/svg/rocket.svg";
  let today = new Date().toISOString().split("T")[0];
  let apiKey = "DEMO_KEY";
  let startDate = today;
  let endDate = today;
  let data = [0];
  let currentImg = 0;
  $: current = data[currentImg];
  $: isImage = current["media_type"] == "image";
  $: noImage = current["media_type"] == "other";
  $: isVideo = current["media_type"] == "video";
  $: isData = data[0] != 0;
  $: currentUrl = current["url"];
  $: currentTitle = current["title"];
  $: currentExplanation = current["explanation"];
  $: currentDate = current["date"];
  $: currentCopyright = current["copyright"];
  $: youtubeUrl = showVideo(currentUrl);

  function showVideo(originalLink) {
    if (!isVideo) {
      return;
    }
    const youtubeParams = { autoplay: 1, mute: 1 };
    const vimeoParams = { autoplay: 1, muted: 1, pip: 1 };

    let newSrc = originalLink;
    if (newSrc.includes("youtube.com")) {
      newSrc = addParams(newSrc, youtubeParams).replace(
        /youtube.com/g,
        "youtube-nocookie.com"
      );
    } else if (newSrc.includes("vimeo.com")) {
      newSrc = addParams(newSrc, vimeoParams);
    }
    return newSrc;
  }
  const apiUrl = new URL("https://api.nasa.gov/planetary/apod");
  async function paste() {
    try {
      const clip = await navigator.clipboard.readText();
      return clip;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
  async function fetchData(url) {
    console.log(url);
    let response;
    try {
      response = await fetch(url);
    } catch {
      alert("Unknown error.");
      return false;
    }
    if (response.status != 200) {
      if (response.status == 403) {
        alert("Invalid API key");
      } else if (response.status == 429) {
        alert("Too many requests, try using a different API key");
      } else {
        alert("Error. Error code: " + response.status);
      }
      return false;
    }
    const currentData = await response.json();
    return currentData;
  }
  async function insertImages() {
    const url = addParams(apiUrl, {
      api_key: apiKey,
      start_date: startDate,
      end_date: endDate,
    });
    data = await fetchData(url);
  }
  const submit = async () => {
    await insertImages();
  };
  function addParams(link, params) {
    link = new URL(link);
    let value;
    for (let key in params) {
      value = params[key];

      link.searchParams.append(key, value);
    }
    return link.toString();
  }
  function removeLineBreak(string) {
    string = string.replace(/\n/g, "");
    string = string.replace(/\r/g, "");
    return string;
  }
  function getDateAhead(dateString, days) {
    let date = new Date(dateString);
    date.setDate(date.getDate() + days);
    let year = String(date.getFullYear()).padStart(4, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
  }
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const dateOptions = { month: "long", day: "numeric", year: "numeric" };
    const formatDate = date.toLocaleDateString("en-US", dateOptions);
    return formatDate;
  }
  function validateDates(start, end) {
    let valid = true;
    let message;
    if (start < "1996-6-16") {
      message = "Starting date cannot be before " + formatDate("1996-06-16");
      valid = false;
    }
    if (start > endDate) {
      if (start > today) {
        message = "Starting date cannot be after today";
      } else if (start > endDate) {
        message = "Starting date cannot be after the end date";
      }
      valid = false;
    }
    if (end < startDate) {
      message = "End date cannot be before the starting date";
      valid = false;
    }
    if (end > today) {
      message = "End date cannot be after today";
      valid = false;
    }

    return { valid: valid, message: message };
  }
  const pasteToApi = async () => {
    apiKey = await paste();
  };
  const changeStart = (days) => {
    const final = getDateAhead(startDate, days);
    if (!validateDates(startDate, final)["valid"]) {
      endDate = today;
    } else {
      endDate = final;
    }
  };
  function changeImg(plus) {
    if (plus == 1) {
      if (currentImg + 1 < data.length) {
        currentImg++;
      } else {
        currentImg = 0;
      }
    } else if (plus == 0) {
      if (currentImg - 1 >= 0) {
        currentImg--;
      } else {
        currentImg = data.length - 1;
      }
    }
  }
</script>

<Header />
<main class="bg-dark text-light">
  <section class="p-lg-5 text-center text-lg-start">
    <div class="container">
      <div class="d-sm-flex align-items-center justify-content-between">
        <div>
          <h1>Astro <span class="text-primary">Fetch</span></h1>
          <div class="container-fluid border border-info rounded">
            <p class="fs-5 text-start font-google-quicksand fw-500">
              AstroFetch is a powerful tool that utilizes the nasa api (<a
                href="https://api.nasa.gov"
                class="link-light">api.nasa.gov</a
              >) and fetches the Astronomy Picture Of the Day (APOD) from your
              start date to your end date, allowing you to browse the pictures
              seamlessly.
            </p>
          </div>
          <div class="container-fluid">
            <p class="fs-6 text-start">
              Want to download images instead? Use the
              <a href="https://github.com/Oded2/AstroFetch" class="link-light"
                >python</a
              >
              version!
            </p>
          </div>
        </div>
        <img
          class="img-fluid w-50 d-none d-lg-block"
          src={rocketImg}
          alt="Nasa Logo"
        />
      </div>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="row">
        <div class="col-md-5 col-lg-6">
          <h2>Pick your start date</h2>
          <input
            bind:value={startDate}
            max={endDate}
            min="1995-06-16"
            type="date"
            class="form-control"
          />
        </div>
        <div class="col-md-7 col-lg-6 mt-md-0 mt-5">
          <h2>Pick your end date</h2>
          <input
            bind:value={endDate}
            min={startDate}
            max={today}
            type="date"
            class="form-control"
          />
          <div class="row mt-2">
            <div class="col-auto mb-2">
              <button
                class="btn btn-secondary"
                on:click={() => {
                  changeStart(0);
                }}
              >
                Set to Start Date
              </button>
            </div>
            <div class="col-auto mb-2">
              <button
                class="btn btn-secondary"
                on:click={() => {
                  changeStart(7);
                }}
              >
                7 Days
              </button>
            </div>
            <div class="col-auto mb-2">
              <button
                class="btn btn-secondary"
                on:click={() => {
                  changeStart(30);
                }}
              >
                30 Days
              </button>
            </div>
            <div class="col-auto mb-2">
              <button
                class="btn btn-secondary"
                on:click={() => {
                  changeStart(100);
                }}
              >
                100 Days
              </button>
            </div>
            <div class="col-auto mb-2">
              <button
                class="btn btn-secondary"
                on:click={() => {
                  changeStart(365);
                }}
              >
                365 Days
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row my-5">
        <div class="col-md-5">
          <h2>Nasa API key</h2>
          <input
            bind:value={apiKey}
            type="text"
            class="form-control"
            placeholder="API key"
          />
          <span class="fs-6 fw-light"
            >Don't have an API key? Either leave it as "DEMO_KEY" or visit
            <a href="https://api.nasa.gov" class="link-light">api.nava.gov</a>
            to obtain one.</span
          >
        </div>
        <div class="col-md-1 mt-4 mt-md-0">
          <h2 class="d-none d-md-block">&nbsp;</h2>
          <button class="btn btn-secondary w-100" on:click={pasteToApi}>
            <span>
              <i class="fa-regular fa-clipboard" /><span class="d-md-none">
                &nbsp;Paste from clipboard</span
              ></span
            >
          </button>
        </div>
        <div class="col-md-6 mt-1 mt-md-0">
          <h2 class="d-none d-md-block">&nbsp;</h2>
          <button on:click={submit} class="btn btn-primary w-100">
            Fetch
          </button>
        </div>
      </div>
    </div>
  </section>
  <section>
    <div class="container-fluid">
      {#if isData}
        <h1 class="text-center vh-rsm-10">
          <em>{currentTitle}</em>
        </h1>

        <div class="vh-sm-75 vh-50">
          {#if isImage}
            <div class="h-100">
              {#each data as currentItem, index}
                <img
                  src={currentItem["url"]}
                  alt={currentItem["title"]}
                  hidden={index != currentImg}
                  class="img-fluid object-fit-contain h-100 w-100"
                />
              {/each}
            </div>
          {:else if isVideo}
            <div hidden={!isVideo} class="container h-100">
              <iframe
                src={youtubeUrl}
                class="h-100 w-100"
                title="YouTube video player"
                frameborder="0"
                allowfullscreen
              />
            </div>
          {:else}
            <div hidden={!noImage} class="container h-100">
              <div class="d-flex align-items-center h-100">
                <div class="row">
                  <div class="col-12">
                    <div class="border border-danger rounded px-3 w-100">
                      <h1 class="text-center">
                        Sorry! The astronomy picture of the day for the current
                        date is unavailable.
                      </h1>
                    </div>
                  </div>
                  <div class="col-auto">
                    <span class="fs-6 fw-light"
                      >Feel free to
                      <a href="mailto:odedconnect@gmail.com" class="link-light"
                        >contact me</a
                      >
                      if you encounter this issue.</span
                    >
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>

        <div class="container">
          <div class="row my-4" id="buttonDiv">
            <div class="col-12 mb-2">
              <div class="row vh-rsm-10">
                <div class="col-auto">
                  <h6>Date: {formatDate(currentDate)}</h6>
                </div>
                {#if currentCopyright}
                  <div class="col-auto">
                    <h6>Copyright: {currentCopyright}</h6>
                  </div>
                {/if}
              </div>
            </div>
            <div class="col-6">
              <button
                class="btn btn-primary w-100 fs-5"
                on:click={() => changeImg(0)}
              >
                Back
              </button>
            </div>
            <div class="col-6">
              <button
                class="btn btn-primary w-100 fs-5"
                on:click={() => changeImg(1)}
              >
                Next
              </button>
            </div>
          </div>
          <div class="row my-4">
            <div class="col-md-12">
              <h3 class="font-google-quicksand">Explanation</h3>
              <p class="font-google-quicksand fs-5">{currentExplanation}</p>
            </div>
          </div>
        </div>
      {:else}
        <h1 class="text-center vh-rsm-10">
          <em>Nasa Logo</em>
        </h1>

        <div class="vh-sm-75 vh-50">
          <div class="h-100">
            <img
              src={nasaLogo}
              alt="Nasa Logo"
              class="img-fluid object-fit-contain h-100 w-100"
            />
          </div>
        </div>
      {/if}
    </div>
  </section>
</main>

<style>
</style>
