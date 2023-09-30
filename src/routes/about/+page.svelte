<script>
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  import startup from "../../images/svg/startup.svg";
  import launch from "../../images/svg/launch.svg";
  import dataImg from "../../images/svg/data.svg";
  import settings from "../../images/svg/settings.svg";
  import email from "../../images/svg/email.svg";
  export let data;
  const api = data.sbApi;
</script>

<main class="full-background text-bg-dark">
  <Header title={hrefs["about"]["title"]} sbApi={api} />
  <section class="p-1">
    <div class="container">
      <div class="row p-3">
        <div class="col-md">
          <h1 class="text-center">About Code Vault</h1>
          <p class="font-google-quicksand fs-5">
            Code Vault is a free and open source website that showcases coding
            projects with an appealing user interface, allowing you to explore
            my work effortlessly.
          </p>
        </div>
        <div class="col-md d-md-block d-flex justify-content-center">
          <img class="w-50 float-end img-fluid" src={startup} alt="Startup" />
        </div>
      </div>
      <div class="row p-3">
        <div class="col-md">
          <h1 class="text-center">The Mission</h1>
          <p class="font-google-quicksand fs-5">
            The purpose of Code Vault is to create a visually appealing and
            well-structured portfolio for showcasing my coding projects,
            providing an interactive experience that enhances your exploration.
          </p>
        </div>
        <div class="col-md d-md-block d-flex justify-content-center">
          <img class="w-50 float-end img-fluid" src={launch} alt="Launch" />
        </div>
      </div>
      <div class="row p-3">
        <div class="col-md">
          <h1 class="text-center">Development</h1>
          <p class="font-google-quicksand fs-5">
            Code Vault is crafted using Svelte as a frontend framework while
            using languages such as HTML, CSS, and JavaScript, showcasing a
            commitment to building a dynamic and engaging user experience
            without relying on complex backend systems.
          </p>
        </div>
        <div class="col-md d-md-block d-flex justify-content-center">
          <img class="w-50 float-end img-fluid" src={dataImg} alt="Data" />
        </div>
      </div>
      <div class="row p-3">
        <div class="col-md">
          <h1 class="text-center">Resources</h1>
          <p class="font-google-quicksand fs-5">
            In Code Vault, I leverage the power of
            <a href={hrefs["external"]["bootstrap"]} class="text-light"
              >Bootstrap</a
            >,
            <a href={hrefs["external"]["exifJs"]} class="text-light">exif.js</a
            >, and
            <a href={hrefs["external"]["fontAwesome"]} class="text-light"
              >Font Awesome</a
            >, incorporating these robust frameworks and libraries to enhance
            the aesthetics, functionality, and iconography of the website.
          </p>
        </div>
        <div class="col-md d-md-block d-flex justify-content-center">
          <img class="w-50 float-end img-fluid" src={settings} alt="Settings" />
        </div>
      </div>
      <div class="row p-3">
        <div class="col-md">
          <h1 class="text-center">Contact</h1>
          <p class="font-google-quicksand fs-5">
            Feel free to reach out to me at
            <a class="text-light" href={hrefs["email"]["mailto"]}
              >{hrefs["email"]["address"]}</a
            >
            or use my simple
            <a href={hrefs["contact"]["link"]} class="text-light"
              >contact form</a
            >. Alternatively, you can visit my
            <a href={hrefs["github"]["profile"]} class="text-light">GitHub</a>
            page for further engagement and collaboration opportunities.
          </p>
        </div>
        <div class="col-md d-md-block d-flex justify-content-center">
          <img class="w-50 float-end img-fluid" src={email} alt="Email" />
        </div>
      </div>
    </div>
  </section>
</main>
