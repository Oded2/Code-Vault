<script>
  import Header from "../../components/Header.svelte";
  import nasaLogo from "../../images/svg/NASA.svg";
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
          src={nasaLogo}
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
            oninput="changeEnd()"
            min="1995-06-16"
            type="date"
            id="startDate"
            class="form-control"
          />
        </div>
        <div class="col-md-7 col-lg-6 mt-md-0 mt-5">
          <h2>Pick your end date</h2>
          <input
            oninput="changeStart()"
            min="1995-06-16"
            type="date"
            id="endDate"
            class="form-control"
          />
          <div class="row mt-2">
            <div class="col-auto mb-2">
              <button class="btn btn-secondary" onclick="changeEndDate(0)">
                Set to Start Date
              </button>
            </div>
            <div class="col-auto mb-2">
              <button class="btn btn-secondary" onclick="changeEndDate(7)">
                7 Days
              </button>
            </div>
            <div class="col-auto mb-2">
              <button class="btn btn-secondary" onclick="changeEndDate(30)">
                30 Days
              </button>
            </div>
            <div class="col-auto mb-2">
              <button class="btn btn-secondary" onclick="changeEndDate(100)">
                100 Days
              </button>
            </div>
            <div class="col-auto mb-2">
              <button class="btn btn-secondary" onclick="changeEndDate(365)">
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
            type="text"
            id="apiKey"
            class="form-control"
            placeholder="API key"
            value="DEMO_KEY"
          />
          <span class="fs-6 fw-light"
            >Don't have an API key? Either leave it as "DEMO_KEY" or visit
            <a href="https://api.nasa.gov" class="link-light">api.nava.gov</a>
            to obtain one.</span
          >
        </div>
        <div class="col-md-1 mt-4 mt-md-0">
          <h2 class="d-none d-md-block">&nbsp;</h2>
          <button class="btn btn-secondary w-100" onclick="pasteToApi()">
            <span>
              <i class="fa-regular fa-clipboard" /><span class="d-md-none">
                &nbsp;Paste from clipboard</span
              ></span
            >
          </button>
        </div>
        <div class="col-md-6 mt-1 mt-md-0">
          <h2 class="d-none d-md-block">&nbsp;</h2>
          <button onclick="submit()" class="btn btn-primary w-100">
            Fetch
          </button>
        </div>
      </div>
    </div>
  </section>
  <section>
    <div class="container-fluid">
      <h1 class="text-center vh-rsm-10">
        <em id="imageTitle">Nasa Logo</em>
      </h1>

      <div class="vh-sm-75 vh-50">
        <div class="h-100" id="imageContainer">
          <img
            src={nasaLogo}
            alt="NASA logo"
            class="img-fluid object-fit-contain h-100 w-100"
            id="mainImage"
          />
        </div>
        <div class="container h-100" id="iFrameContainer" hidden>
          <iframe
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            src=""
            frameborder="0"
            id="youtube"
            class="h-100 w-100"
          />
        </div>
        <div hidden id="noImage" class="container h-100">
          <div class="d-flex align-items-center h-100">
            <div class="row">
              <div class="col-12">
                <div class="border border-danger rounded px-3 w-100">
                  <h1 class="text-center">
                    Sorry! The astronomy picture of the day for the current date
                    is unavailable.
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
      </div>
      <div class="container">
        <div class="row my-4" id="buttonDiv" hidden>
          <div class="col-12 mb-2">
            <div class="row vh-rsm-10">
              <div class="col-auto">
                <h6>Date: <span id="dateTaken" /></h6>
              </div>
              <div class="col-auto" id="copyrightCol">
                <h6>Copyright: <span id="copyright" /></h6>
              </div>
            </div>
          </div>
          <div class="col-6">
            <button class="btn btn-primary w-100 fs-5" onclick="prevImg()">
              Back
            </button>
          </div>
          <div class="col-6">
            <button class="btn btn-primary w-100 fs-5" onclick="nextImg()">
              Next
            </button>
          </div>
        </div>
        <div class="row my-4">
          <div class="col-md-12" id="explanationDiv" hidden>
            <h3 class="font-google-quicksand">Explanation</h3>
            <p id="explanation" class="font-google-quicksand fs-5" />
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
</style>
