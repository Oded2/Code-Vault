<script>
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  const directory = hrefs.astrofetch;
  let pages = [];
  for (let i in directory) {
    if (i != "home") {
      pages.push(directory[i]);
    }
  }
</script>

<main class="full-background text-bg-dark">
  <Header {directory} title={directory.home.title} />
  <div class="container">
    <div class="py-5">
      <h1 class="display-1 font-google-comfortaa text-center">
        {directory.home.title}
      </h1>
      <div class="border-start ps-3">
        <h4 class="font-google-quicksand fw-500">
          Astrofetch is a captivating web platform that comprises a range of
          pages expertly utilizing NASA's diverse APIs. These pages work
          harmoniously to deliver an array of distinctive statistics and
          fascinating information about the cosmos. Dive into the universe's
          wonders with Astrofetch.
        </h4>
      </div>
    </div>
    <div class="row">
      {#each pages as page}
        <div class="col-lg-6 pb-5 px-0 px-md-3">
          <div class="card text-light border-light h-100">
            <div class="card-header pt-3">
              <h2 class="font-google-comfortaa fw-bold text-center">
                {page.title}
              </h2>
            </div>
            <div class="card-body border-light py-4">
              <p class="fs-3 font-google-quicksand fw-500">
                {page.description}
              </p>
            </div>
            <div class="card-footer py-3 border-light text-center">
              <a
                href={page.link}
                class="custom btn btn-primary w-75 fs-3 font-google-quicksand fw-bold"
                ><i class="fa-solid fa-rocket" /> Show Me</a
              >
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</main>

<style>
  a.custom {
    border-radius: 25px;
    transition: 0.5s;
  }
  a.custom:hover {
    border-radius: 20px;
    width: 100% !important;
  }
  div.card {
    background-image: linear-gradient(to bottom right, #3a1d56, #11133b);
  }
</style>
