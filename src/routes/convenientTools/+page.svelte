<script>
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  const directory = hrefs.convenientTools;
</script>

<main class="full-background">
  <Header {directory} title={directory.home.title} />
</main>
