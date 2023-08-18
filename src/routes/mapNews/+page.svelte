<script>
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  const title = hrefs["map-news"]["home"]["title"];

  let map = L.map("map", {
    center: [20.0, 5.0],
    minZoom: 2,
    zoom: 2,
  });
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
    type="text/css"
    href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css"
  />

  <script
    type="text/javascript"
    src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"
  ></script>
  <script
    type="text/javascript"
    src="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.js"
  ></script></svelte:head
>

<style>
  .map-container {
    height: 80%;
  }
</style>
