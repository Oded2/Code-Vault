<script>
  import Header from "../../components/Header.svelte";
  import {
    addParamsString,
    fetchData,
    createSbClient,
    showToast,
    formatDateStr,
    maxLen,
    dateToStr,
  } from "../../hooks.client.js";
  import hrefs from "../../data/hrefs.json";
  import nasaLogo from "../../images/svg/NASA.svg";
  import rocketImg from "../../images/svg/rocket.svg";
  import Vault from "../../components/Vault.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import ToastSetup from "../../components/setup/ToastSetup.svelte";
  export let data;
  const nasaApiKey = data.nasaApi;
  const sbApi = data.sbApi;
  const sb = createSbClient(sbApi);
  const today = dateToStr();
  let userId;
  let inProgress = false;
  let toast;
  onMount(async () => {
    const { data } = await sb.auth.getSession();
    if (!data.session) {
      return;
    }
    userId = data.session.user.id;
  });
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
  const apiUrl = "https://api.nasa.gov/planetary/apod";
  $: visible = isData && userId && isImage;
  function showVideo(originalLink) {
    if (!isVideo) {
      return;
    }
    const youtubeParams = { autoplay: 1, mute: 1 };
    const vimeoParams = { autoplay: 1, muted: 1, pip: 1 };

    let newSrc = originalLink;
    if (newSrc.includes("youtube.com")) {
      newSrc = addParamsString(newSrc, youtubeParams).replace(
        /youtube.com/g,
        "youtube-nocookie.com"
      );
    } else if (newSrc.includes("vimeo.com")) {
      newSrc = addParamsString(newSrc, vimeoParams);
    }
    return newSrc;
  }

  async function insertImages(isDemo) {
    isLoading = true;
    const url = addParamsString(apiUrl, {
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
    currentImg = 0;
    await insertImages(isDemo);
  };

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
  function validateDates(start, end, mindate = "1995-06-16") {
    let valid = true;
    let message;
    if (start < mindate) {
      message = "Starting date cannot be before " + formatDateStr(mindate);
      valid = false;
    }
    if (start > endDate) {
      message = "Starting date cannot be after the end date";
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
  const changeEndDate = (days) => {
    endDate = getDateAhead(startDate, days);
    if (!validateDates(startDate, endDate).valid) {
      endDate = today;
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
  function getRandomDate(startDate, endDate) {
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();
    const randomTimestamp =
      startTimestamp + Math.random() * (endTimestamp - startTimestamp + 1); // +1 to include the end date
    const randomDate = new Date(randomTimestamp);
    const year = randomDate.getFullYear();
    const month = String(randomDate.getMonth() + 1).padStart(2, "0");
    const day = String(randomDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function randomize() {
    startDate = getRandomDate("1995-06-16", today);
    changeEndDate(30);
    submit(false);
  }
  async function saveToVault() {
    inProgress = true;
    let currentData = await readFromVault();
    currentData.push(current);
    const { error } = await sb
      .from("Vaults")
      .update({ astrofetch: currentData })
      .eq("user_id", userId);
    inProgress = false;
    if (error) {
      console.error(error.message);
      toast = showToast("error", "Error", error.message);
      return;
    }
    toast = showToast(
      "success",
      "Added to Vault",
      `Image "${maxLen(
        currentTitle,
        20
      )}" has been added to your personal vault.`
    );
  }
  async function readFromVault() {
    const { data } = await sb
      .from("Vaults")
      .select("astrofetch")
      .eq("user_id", userId);
    const result = data[0].astrofetch;
    if (result) {
      return result;
    }
    return [];
  }
</script>

<main class="text-bg-dark full-background">
  <Header title={hrefs.astrofetch.home.title} {sbApi} />
  <section class="p-lg-5 text-center text-lg-start">
    <div class="container">
      <div class="d-sm-flex align-items-center justify-content-between">
        <div>
          <h1 class="font-google-comfortaa fw-bold">
            Astro <span class="text-primary">Fetch</span>
          </h1>
          <div class="container-fluid border-info custom-text">
            <p class="fs-5 text-start font-google-quicksand fw-500">
              AstroFetch is a powerful tool that utilizes the Nasa api (<a
                href={hrefs.external.nasaApi}
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
            min="1995-06-16"
            type="date"
            class="form-control"
          />
          <div class="row mt-2">
            <div class="col-auto mb-2">
              <button
                class="btn btn-secondary"
                on:click={() => {
                  startDate = today;
                  endDate = today;
                }}
              >
                Set to Today
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-7 col-lg-6 mt-md-0 mt-5">
          <h2>Pick your end date</h2>
          <input
            bind:value={endDate}
            max={today}
            type="date"
            class="form-control"
          />
          <div class="row mt-2">
            <div class="col-auto mb-2">
              <button
                class="btn btn-secondary"
                on:click={() => {
                  changeEndDate(0);
                }}
              >
                Set to Start Date
              </button>
            </div>
            <div class="col-auto mb-2">
              <button
                class="btn btn-secondary"
                on:click={() => {
                  changeEndDate(7);
                }}
              >
                7 Days
              </button>
            </div>
            <div class="col-auto mb-2">
              <button
                class="btn btn-secondary"
                on:click={() => {
                  changeEndDate(30);
                }}
              >
                30 Days
              </button>
            </div>
            <div class="col-auto mb-2">
              <button
                class="btn btn-secondary"
                on:click={() => {
                  changeEndDate(100);
                }}
              >
                100 Days
              </button>
            </div>
            <div class="col-auto mb-2">
              <button
                class="btn btn-secondary"
                on:click={() => {
                  changeEndDate(365);
                }}
              >
                365 Days
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row my-5">
        <div class="col-md">
          <button
            class="btn btn-info btn-interactive fs-4 p-2 font-google-quicksand fw-600 w-100 h-100"
            on:click={randomize}
            ><i class="fa-solid fa-dice" /> Randomize</button
          >
        </div>
        <div class="col-md-4 col-xxl-6 mt-3 mt-md-0">
          <button
            on:click={() => submit(false)}
            class="btn btn-primary btn-interactive fs-4 p-2 font-google-quicksand fw-600 w-100 h-100"
          >
            <i class="fa-solid fa-rocket" /> Fetch
          </button>
        </div>
        <div class="col-md mt-3 mt-md-0">
          <button
            class="btn btn-light btn-interactive fs-4 p-2 font-google-quicksand fw-600 w-100 h-100"
            on:click={() => submit(true)}
            ><i class="fa-solid fa-plug-circle-xmark" /> Not working?</button
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
                  class="h-100"
                  href={addParamsString(hrefs.astrofetch.viewer.link, {
                    title: currentItem["title"],
                    url: currentItem["url"],
                    explanation: currentItem["explanation"],
                    date: formatDateStr(currentItem["date"]),
                    copyright: currentItem["copyright"],
                    rel: $page.url,
                  })}
                  target="_blank"
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
                  <h6>Date: {formatDateStr(currentDate)}</h6>
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
              <h2 class="font-google-quicksand fw-600">Explanation</h2>
              <p class="font-google-quicksand fs-4 fw-500">
                {currentExplanation}
              </p>
            </div>
          </div>
        </div>
      {:else if isLoading}
        <h1 class="text-center vh-rsm-10">
          <em>Loading</em>
        </h1>
        <div class="vh-sm-75 vh-50 py-5">
          <div class="h-100 d-flex justify-content-center align-items-center">
            <span class="loader" />
          </div>
        </div>
      {:else}
        <h1 class="text-center vh-rsm-10">
          <em>Nasa</em>
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
  <section>
    <div class="container my-5 pt-5">
      <h1 class="font-google-quicksand fw-bold">Guide</h1>
      <div class="fs-1 font-google-quicksand fw-600 mt-4">
        <div class="row border-bottom d-none d-md-flex">
          <div class="col-md">Input</div>
          <div class="col-md">Purpose</div>
        </div>
        <div class="row border-bottom py-3 info-box info-normal">
          <div class="col-md">
            <i class="fa-regular fa-calendar" /> Start Date
          </div>
          <div class="col-md fs-3">
            <p>
              The date the APOD (Astronomy Picture of the Day) images will
              start. Minimum date is June 16th, 1995.
            </p>
          </div>
        </div>
        <div class="row border-bottom py-3 info-box info-normal">
          <div class="col-md"><i class="fa-solid fa-calendar" /> End Date</div>
          <div class="col-md fs-3">
            <p>The date the APOD images will end.</p>
          </div>
        </div>
        <div class="row border-bottom py-3 info-box info-secondary">
          <div class="col-md">
            <i class="fa-solid fa-clock" /> Quick set buttons
          </div>
          <div class="col-md fs-3">
            <p>
              These buttons are used to quickly set the end date relative to the
              start date.
            </p>
          </div>
        </div>
        <div class="row border-bottom py-3 info-box info-primary">
          <div class="col-md"><i class="fa-solid fa-rocket" /> Fetch</div>
          <div class="col-md fs-3">
            <p>
              This action will commence the operation and retrieve an image from
              NASA's API based on the specified start and end dates.
            </p>
          </div>
        </div>
        <div class="row border-bottom py-3 info-box info-info">
          <div class="col-md"><i class="fa-solid fa-dice" /> Randomize</div>
          <div class="col-md fs-3">
            <p>
              This feature will randomly select a start date ranging from June
              16th, 1995, to the current date and then automatically sets the
              end date 30 days after the chosen start date. Subsequently, it
              initiates the fetching process.
            </p>
          </div>
        </div>
        <div class="row border-bottom py-3 info-box info-light">
          <div class="col-md">
            <i class="fa-solid fa-plug-circle-xmark" /> Not working button
          </div>
          <div class="col-md fs-3">
            <p>
              If the API key is invalid or the request limit has been reached,
              clicking this button will initiate the same operation using NASA's
              demo key. However, it's worth noting that this is not the
              recommended option, as the demo key has a daily fetching limit of
              35 times for every IP address.
            </p>
          </div>
        </div>
        <div class="py-3 fs-3">
          <h1 class="font-google-quickand fw-bold text-center">Tips</h1>
          <ul>
            <li>
              Keep the start date and end date range as low as possible, as the
              API cannot handle long time ranges. Recommended maximum is a one
              year difference.
            </li>
            <li>
              Clicking on an image will open a whole web page specific for that
              image.
            </li>
            <li>Have fun!</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</main>

<Vault {visible} {inProgress} on:click={saveToVault} />

<ToastSetup {toast} />

<style>
  .custom-text {
    border-left: 5px solid;
  }
  .btn-interactive {
    border: none;

    border-radius: 20px;
    transition: 0.5s;
  }
  .btn-interactive:hover {
    scale: 103%;
  }
  .btn-interactive:active {
    scale: 105%;
  }
  .info-box {
    transition: 0.5s;
  }
  .info-normal:hover {
    background-color: #141414;
  }
  .info-secondary:hover {
    background-color: #6c757d;
  }
  .info-primary:hover {
    background-color: #0d6efd;
  }
  .info-info:hover {
    color: #000000;
    background-color: #0dcaf0;
  }
  .info-light:hover {
    color: #000000;
    background-color: #f8f9fa;
  }
  .loader {
    height: 100%;
    width: auto;
    aspect-ratio: 1/1;
    border: 10px solid #fff;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
