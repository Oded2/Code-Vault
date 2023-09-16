<script>
  import Header from "../../../components/Header.svelte";
  import hrefs from "../../../data/hrefs.json";
  const directory = hrefs.convenientTools;

  let input = "",
    output = "";

  const markdown = (string) => {};
  const bold = /\*\*(.*)\*\*/gim;
</script>

<main class="full-background text-bg-dark">
  <Header {directory} title={directory.markdown.title} />
  <div class="container">
    <div class="font-google-quicksand text-center py-3">
      <h1 class="fw-bold">{directory.markdown.title}</h1>
    </div>
    <div>
      <div class="card">
        <div class="card-header">
          <h2 class="font-google-quicksand fw-600">Enter your text</h2>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md">
              <textarea
                class="form-control shadow-lg"
                rows="20"
                bind:value={input}
              />
            </div>
            <div class="col-md mt-5 mt-md-0">
              <textarea
                disabled
                class="form-control shadow-lg"
                rows="20"
                bind:value={output}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  textarea {
    resize: none;
  }
</style>
