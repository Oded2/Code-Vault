<script>
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  const title = hrefs["map-news"]["home"]["title"];
</script>

<main class="full-background text-bg-dark h-100">
  <Header {title} />
  <div class="map-container">
    <iframe
      title="World Map"
      src="https://www.openstreetmap.org/export/embed.html?bbox=-151.34765625000003%2C-51.944264879028765%2C142.20703125000003%2C67.13582938531948&amp;layer=mapnik"
      class="w-100 h-100"
    />
  </div>
  <div class="container my-3">
    <h1 class="font-google quicksand fw-bold">
      What is <span class="text-warning">{title}?</span>
    </h1>
  </div>
</main>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""
  />
  <script
    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""
  ></script>
</svelte:head>

<style>
  .map-container {
    height: 80%;
  }
</style>
