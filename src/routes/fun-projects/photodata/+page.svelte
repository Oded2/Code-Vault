<script>
  import Header from "../../../components/Header.svelte";
  import transparentImg from "../../../images/misc/transparent.png";
  import hrefs from "../../../data/hrefs.json";
  let userImg;
  let imgSrc = transparentImg;

  let tags = {};

  let newTags = [];

  const acceptableValues = {
    Make: "Make",
    Model: "Model",
    Flash: "Flash",
    Software: "Software",
    FocalLength: "Focal Length",
  };

  $: finalLong = handleCord(tags["GPSLongitude"], tags["GPSLongitudeRef"]);
  $: finalLat = handleCord(tags["GPSLatitude"], tags["GPSLatitudeRef"]);
  $: finalMap = createMapEmbedLink(finalLat, finalLong);
  const createImage = (event) => {
    newTags = [];
    let file = event.target.files[0];
    imgSrc = URL.createObjectURL(file);
    EXIF.getData(file, processEXIF);
  };
  function processEXIF() {
    tags = EXIF.getAllTags(this);
    updateNewTags();
  }
  function updateNewTags() {
    for (let tag in tags) {
      const current = acceptableValues[tag];
      const value = tags[tag];
      if (current) {
        newTags[newTags.length] = `${current}: ${value}`;
      }
    }
  }
  function handleCord(cord, ref) {
    if (!cord) {
      return;
    }
    let degree = cord[0];
    let minute = cord[1];
    let second = cord[2];
    let final = ConvertDMSToDD(degree, minute, second, ref);
    return final;
  }

  function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    let dd = degrees + minutes / 60 + seconds / 3600;

    if (direction == "S" || direction == "W") {
      dd = dd * -1;
    }

    return dd;
  }
  function createMapEmbedLink(latitude, longitude) {
    if (!latitude || !longitude) {
      return "https://www.openstreetmap.org/export/embed.html?bbox=-132.67089843750003%2C21.779905342529645%2C-59.28222656250001%2C51.781435604431195&amp;layer=mapnik";
    }
    const degrees = 30 / 111.32;
    const bbox = [
      longitude - degrees,
      latitude - degrees,
      longitude + degrees,
      latitude + degrees,
    ].join(",");

    const marker = `${latitude},${longitude}`;

    const embedLink = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&amp;layer=mapnik&marker=${marker}`;
    return embedLink;
  }
</script>

<Header
  directory={hrefs["fun-projects"]}
  title={hrefs["fun-projects"]["photodata"]["title"]}
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
        <div class="col-md-6 h-100 d-flex justify-content-center">
          <img src={imgSrc} alt="Uploaded" class="img-fluid h-100" />
        </div>

        <div class="col-md-6 h-100">
          <iframe title="Open street map" class="h-100 w-100" src={finalMap} />
        </div>
      </div>
      <div>
        <h2 class="text-body-emphasis">Image Metadata</h2>

        <ul class="list-unstyled">
          <li>
            {#each newTags as tag, index}
              <div
                class="w-100 py-2"
                class:bg-secondary-subtle={index % 2 == 0}
              >
                <h4>{tag}</h4>
              </div>
            {/each}
          </li>
        </ul>
      </div>
    </main>
  </div>
</main>
<svelte:head>
  <script src="https://cdn.jsdelivr.net/npm/exif-js"></script>
</svelte:head>
