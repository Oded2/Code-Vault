<script>
  import Header from "../../../components/Header.svelte";
  let userImg;
  let imgSrc;
  // $: img = URL.createObjectURL(userImg);
  const createImage = (e) => {
    let img = e.target.files[0];
    imgSrc = URL.createObjectURL(img);
  };
  $: console.log(imgSrc);
</script>

<Header
  directory="fun-projects"
  activePage="photodata"
  title="Metadata Viewer"
/>
<main>
  <div class="col-lg-8 mx-auto p-4 py-md-5">
    <main>
      <div class="mb-5">
        <h1 class="text-body-emphasis">Metadata Viewer</h1>

        <label for="formFile" class="form-label">Choose an Image</label>
        <input
          id="formFile"
          class="form-control"
          type="file"
          accept="image/*"
          on:input={createImage}
          bind:value={userImg}
        />
      </div>
      <div class="row vh-50">
        <div class="col-md-6 h-100">
          <img src={imgSrc} alt="Uploaded" class="img-fluid h-100" />
        </div>

        <div class="col-md-6 h-100">
          <iframe
            title="Open street map"
            class="h-100 w-100"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-132.67089843750003%2C21.779905342529645%2C-59.28222656250001%2C51.781435604431195&amp;layer=mapnik"
          />
        </div>
      </div>
      <div class="row g-5">
        <div class="col-md-6">
          <h2 class="text-body-emphasis">Image Metadata</h2>

          <ul class="list-unstyled ps-0">
            <li>
              <h4 id="dataMake">&nbsp;</h4>
              <h4 id="dataModel">&nbsp;</h4>
              <h4 id="dataResolution">&nbsp;</h4>
              <h4 id="dataMegapixel">&nbsp;</h4>
              <h4 id="dataFlash">&nbsp;</h4>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</main>
<svelte:head>
  <script src="https://cdn.jsdelivr.net/npm/exif-js"></script>
</svelte:head>
