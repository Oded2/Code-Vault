<script>
  import { formatDateStr } from "../../hooks.client.js";
  export let article = {};
  export let dir;
</script>

<div class="col-md-6 col-xl-4 d-flex align-items-stretch mb-5">
  <div class="card shadow">
    {#if article.urlToImage}
      <div class="card-img-top overflow-hidden">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src={article.urlToImage} alt="No image available" />
      </div>
    {/if}
    <div class="card-header row">
      <div class="col-12">
        <span> {formatDateStr(article.publishedAt)}</span>
      </div>

      <div class="col-6"><span>{article.author}</span></div>
      <div class="col-6"><span>{article.source.name}</span></div>
    </div>
    <div class="card-body" class:font-google-fredoka={dir == "rtl"} {dir}>
      <h3 class="fw-600">{article.title}</h3>
      <p class="fw-500 fs-5">{article.description}</p>
    </div>
    <div class="card-footer">
      <a
        href={article.url}
        target="_blank"
        class="btn btn-primary btn-lg fs-4 w-100 fw-bold mb-3"
        ><i class="fa-solid fa-arrow-up-right-from-square" /> Go to Article</a
      >
      <slot />
    </div>
  </div>
</div>

<style>
  img {
    height: 100%;
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
    transition: 0.5s;
  }
  img:hover {
    scale: 110%;
  }
</style>
