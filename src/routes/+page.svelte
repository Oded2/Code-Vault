<script>
  import Header from "../components/Header.svelte";
  import learningImg from "../images/svg/learning.svg";
  import hrefs from "../data/hrefs.json";
</script>

<Header isHome={true} />
<main class="bg-light">
  <section class="bg-dark text-light p-5 p-lg-1 text-center text-sm-start">
    <div class="container">
      <div class="d-sm-flex align-items-center justify-content-between">
        <div>
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
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
          class="img-fluid w-50 d-none d-sm-block"
          src={learningImg}
          alt="Image of person filing files"
        />
      </div>
    </div>
  </section>
  <!-- Boxes -->

  <div class="container py-5">
    <div class="row">
      <div class="col-xl-4 col-md-6 d-flex mt-xl-0 mt-5">
        <div class="card bg-dark text-light shadow-lg">
          <div
            class="card-body text-center d-md-flex flex-md-column px-0 px-md-3"
          >
            <div class="h1 mb-5">
              <i class="fa-solid fa-laptop" />
            </div>
            <h3 class="font-google-roboto-mono">Fun Projects</h3>
            <div class="container-fluid">
              <p class="text-start fs-5 font-google-quicksand">
                The website offers various features, including a Text Encrypter,
                Text Decrypter, Credit Card Validator, Credit Card Generator,
                and an Image Metadata Viewer. It uses HTML, CSS, and Javascript.
              </p>
            </div>
            <div class="container-fluid mt-auto">
              <a
                href={hrefs["fun-projects"]["home"]}
                class="btn btn-primary fs-5 w-100"
                ><i class="fa-regular fa-folder-open" />&nbsp; Show Me</a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-md-6 d-flex mt-xl-0 mt-5">
        <div class="card bg-dark text-light shadow-lg">
          <div
            class="card-body text-center d-md-flex flex-md-column px-0 px-md-3"
          >
            <div class="h1 mb-5">
              <i class="fa-solid fa-gamepad" />
            </div>
            <h3 class="font-google-roboto-mono">Fun Games</h3>
            <div class="container-fluid">
              <p class="text-start fs-5 font-google-quicksand">
                Discover a collection of fun browser games! No downloads
                required. Enjoy HTML, CSS, and JavaScript creations, all
                playable directly in your browser.
              </p>
            </div>
            <div class="container-fluid mt-auto">
              <a
                href={hrefs["fun-games"]["home"]}
                class="btn btn-primary fs-5 w-100"
                ><i class="fa-regular fa-folder-open" />&nbsp; Show Me</a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-md-6 d-flex mt-xl-0 mt-5">
        <div class="card bg-dark text-light shadow-lg">
          <div
            class="card-body text-center d-md-flex flex-md-column px-0 px-md-3"
          >
            <div class="h1 mb-5">
              <i class="fa-solid fa-user-astronaut" />
            </div>
            <h3 class="font-google-roboto-mono">AstroFetch</h3>
            <div class="container-fluid">
              <p class="text-start fs-5 font-google-quicksand">
                AstroFetch is a versatile tool that retrieves the astronomy
                picture of the day within a specified date range. It comes in
                two versions: a Python version for image downloads and a
                user-friendly web version. By leveraging NASA's API, AstroFetch
                provides access to captivating and up-to-date astronomical
                imagery.
              </p>
            </div>

            <div class="container-fluid mt-auto">
              <a
                href={hrefs["github"]["astrofetch"]["source"]}
                class="btn btn-outline-secondary my-2 text-white fs-5 w-100"
                ><i class="fa-brands fa-github" />&nbsp; Source Code (Python)</a
              >
              <a
                href={hrefs["github"]["astrofetch"]["download"]}
                class="btn btn-outline-primary fs-5 w-100"
                ><i class="fa-brands fa-python" />&nbsp; Download Python Version</a
              >
              <a
                href={hrefs["astrofetch"]["home"]}
                class="btn btn-primary fs-5 w-100 mt-2"
                ><i class="fa-regular fa-folder-open" />&nbsp; Show Me</a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-md-6 d-flex mt-5">
        <div class="card bg-dark text-light shadow-lg">
          <div
            class="card-body text-center d-md-flex flex-md-column px-0 px-md-3"
          >
            <div class="h1 mb-5">
              <i class="fa-solid fa-key" />
            </div>
            <h3 class="font-google-roboto-mono">Python Encrypter</h3>
            <div class="container-fluid">
              <p class="text-start fs-5 font-google-quicksand">
                The Python code enables text file encryption with password
                protection. It utilizes a command line interface and requires
                Python 3.10 or higher. This versatile tool caters to developers
                familiar with Python, offering a convenient and secure way to
                encrypt sensitive information.
              </p>
            </div>

            <div class="container-fluid mt-auto">
              <a
                href={hrefs["github"]["python-encryption"]["source"]}
                class="btn btn-outline-secondary my-2 text-white fs-5 w-100"
                ><i class="fa-brands fa-github" />&nbsp; Source Code</a
              >
              <a
                href={hrefs["github"]["python-encryption"]["download"]}
                class="btn btn-primary fs-5 w-100"
                ><i class="fa-solid fa-download" />&nbsp; Download</a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-md-6 d-flex mt-5">
        <div class="card bg-dark text-light shadow-lg">
          <div
            class="card-body text-center d-md-flex flex-md-column px-0 px-md-3"
          >
            <div class="h1 mb-5">
              <i class="fa-regular fa-keyboard" />
            </div>
            <h3 class="font-google-roboto-mono">Python Hangman</h3>
            <div class="container-fluid">
              <p class="text-start fs-5 font-google-quicksand">
                The Hangman code for Python is a versatile program that enables
                you to play the popular word-guessing game. It incorporates
                customizable settings that can be adjusted using a JSON file.
                With this code, you can create your own version of Hangman,
                tailoring it to suit your preferences and requirements. This
                Python code offers a convenient way to implement a fun and
                interactive gaming experience.
              </p>
            </div>

            <div class="container-fluid mt-auto">
              <a
                href={hrefs["github"]["python-hangman"]["source"]}
                class="btn btn-outline-secondary my-2 text-white fs-5 w-100"
                ><i class="fa-brands fa-github" />&nbsp; Source Code</a
              >
              <a
                href={hrefs["github"]["python-hangman"]["download"]}
                class="btn btn-primary fs-5 w-100"
                ><i class="fa-solid fa-download" />&nbsp; Download</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
