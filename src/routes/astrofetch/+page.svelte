<script>
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  import nasaLogo from "../../images/svg/NASA.svg";
  import rocketImg from "../../images/svg/rocket.svg";
  import loadingGif from "../../images/loading.gif";
  export let data;
  const nasaApiKey = data["api"];
  const astrofetchRef = hrefs["astrofetch"];
  let today = new Date().toISOString().split("T")[0];
  let startDate = today;
  let endDate = today;
  let astroData = [0];
  let currentImg = 0;
  const invalidDates = ["2014-08-11"];
  $: current = astroData[currentImg];
  $: isInvalid = invalidDates.includes(currentDate);
  $: isImage = current["media_type"] == "image" && !isInvalid;
  $: noImage = current["media_type"] == "other" || isInvalid;
  $: isVideo = current["media_type"] == "video" && !isInvalid;
  $: isData = astroData[0] != 0;
  $: currentUrl = current["url"];
  $: currentTitle = current["title"];
  $: currentExplanation = removeLineBreak(current["explanation"]);
  $: currentDate = current["date"];
  $: currentCopyright = removeLineBreak(current["copyright"]);
  $: youtubeUrl = showVideo(currentUrl);
  $: isLoading = false;
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
      {
        alert("Error. Error code: " + response.status);
      }
      return false;
    }
    const currentData = await response.json();
    return currentData;
  }
  async function insertImages(isDemo) {
    isLoading = true;
    const url = addParams(apiUrl, {
      api_key: isDemo ? "DEMO_KEY" : nasaApiKey,
      start_date: startDate,
      end_date: endDate,
    });
    astroData = await fetchData(url);
    isLoading = false;
  }
  const submit = async (isDemo = false) => {
    const validation = validateDates(startDate, endDate);
    if (!validation["valid"]) {
      alert(validation["message"]);
      return;
    }
    await insertImages(isDemo);
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
  function addParamsString(string, params) {
    const link = "https://codevault.com";
    const linkWithParams = addParams(link, params);
    return linkWithParams.replace("https://codevault.com", string);
  }
  function removeLineBreak(string) {
    if (!string) {
      return;
    }
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
  function validateDates(start, end, mindate = "1996-6-16") {
    let valid = true;
    let message;
    if (start < mindate) {
      message = "Starting date cannot be before " + formatDate(mindate);
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
      if (currentImg + 1 < astroData.length) {
        currentImg++;
      } else {
        currentImg = 0;
      }
    } else if (plus == 0) {
      if (currentImg - 1 >= 0) {
        currentImg--;
      } else {
        currentImg = astroData.length - 1;
      }
    }
  }
</script>

<main class="text-bg-dark full-background">
  <Header title={hrefs["astrofetch"]["home"]["title"]} />
  <section class="p-lg-5 text-center text-lg-start">
    <div class="container">
      <div class="d-sm-flex align-items-center justify-content-between">
        <div>
          <h1>Astro <span class="text-primary">Fetch</span></h1>
          <div class="container-fluid border-info custom-text">
            <p class="fs-5 text-start font-google-quicksand fw-500">
              AstroFetch is a powerful tool that utilizes the Nasa api (<a
                href={astrofetchRef["nasaApi"]}
                class="link-light">api.nasa.gov</a
              >) and fetches the Astronomy Picture Of the Day (APOD) from your
              start date to your end date, allowing you to browse the pictures
              seamlessly.
            </p>
          </div>
          <div class="container-fluid">
            <p class="fs-6 text-start">
              Want to download images instead? Use the
              <a
                href={hrefs["github"]["astrofetch"]["download"]}
                class="link-light">python</a
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
        <div class="col-12 mt-1 mt-md-0">
          <button
            on:click={() => submit(false)}
            class="btn btn-primary w-100 fs-5 position-relative"
          >
            Fetch
          </button>
        </div>
        <div class="col">
          <button
            class="help-button mt-3 px-5 py-2 font-google-quicksand fw-bold w-rmd-100"
            on:click={() => submit(true)}>Not working? Click here!</button
          >
        </div>
      </div>
    </div>
  </section>
  <section>
    <div class="container-fluid">
      {#if isData && !isLoading}
        <div class="overflow-auto vh-rsm-10">
          <h1 class="text-center">
            <em>{currentTitle}</em>
          </h1>
        </div>
        <div class="vh-sm-75 vh-50">
          {#if isImage}
            <div class="h-100 d-flex justify-content-center">
              {#each astroData as currentItem, index}
                <a
                  href={addParamsString("/astrofetch/imageViewer", {
                    title: currentItem["title"],
                    url: currentItem["url"],
                    explanation: currentItem["explanation"],
                    date: formatDate(currentItem["date"]),
                    copyright: currentItem["copyright"],
                  })}
                >
                  <img
                    src={currentItem["url"]}
                    alt={currentItem["title"]}
                    hidden={index != currentImg}
                    class="img-fluid object-fit-contain h-100"
                  /></a
                >
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
                      <a href={hrefs["contact"]["link"]} class="link-light"
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
          <div class="row my-4">
            <div class="col-12 mb-2">
              <div class="row vh-rsm-10 overflow-auto">
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
      {:else if isLoading}
        <h1 class="text-center vh-rsm-10">
          <em>Loading</em>
        </h1>

        <div class="vh-sm-75 vh-50">
          <div class="h-100">
            <img
              src={loadingGif}
              alt="Loading"
              class="img-fluid object-fit-contain h-100 w-100"
            />
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
  .custom-text {
    border-left: 5px solid;
  }
  .help-button {
    border-radius: 40px;
    border: none;
    transition: 0.5s;
    background-color: white;
  }
  .help-button:hover {
    scale: 105%;
    background-color: #d3d3d3;
  }
  .help-button:active {
    scale: 110%;
    background-color: #b1afaf;
  }
</style>
