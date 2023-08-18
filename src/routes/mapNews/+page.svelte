<script>
  import Header from "../../components/Header.svelte";
</script>

<main class="full-background text-bg-dark h-100">
  <Header />
  <div class="map-container">
    <iframe
      title="World Map"
      src="https://www.openstreetmap.org/export/embed.html?bbox=-151.34765625000003%2C-51.944264879028765%2C142.20703125000003%2C67.13582938531948&amp;layer=mapnik"
      class="w-100 h-100"
    />
  </div>
  <div class="container my-3">
    <h1 class="font-google quicksand fw-bold">What is map news?</h1>
  </div>
</main>

<style>
  .map-container {
    height: 80%;
  }
</style>
