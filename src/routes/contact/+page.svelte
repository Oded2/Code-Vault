<script>
  import Header from "../../components/Header.svelte";
  let name, email;
</script>

<main class="dark-background text-bg-dark">
  <Header activePage="contact" title="Contact" />
  <div class="container">
    <div class="d-flex-center">
      <div class="p-5 m-5 text-bg-light w-100">
        <div class="bg-secondary-subtle shadow p-4">
          <form>
            <div class="pb-5 pt-3">
              <h1 class="text-center">Contact</h1>
            </div>
            <div class="fs-5">
              <div class="mb-3">
                <p class="form-label font-google-quicksand fw-500">
                  Email address
                </p>
                <input
                  type="email"
                  class="form-control"
                  bind:value={email}
                  required
                />
                <div class="form-text fs-6">
                  Incase I need to get back to you.
                </div>
              </div>
              <div class="mb-3">
                <p class="form-label font-google-quicksand fw-500">Name</p>
                <input
                  type="text"
                  class="form-control"
                  bind:value={name}
                  required
                />
                <div class="form-text fs-6">
                  Incase I need to get back to you.
                </div>
              </div>
            </div>
            <!-- <div class="row px-4">
            <div class="col-md-12 pb-5 pt-3">
              <h1 class="font-google-quicksand fw-bold text-center">Contact</h1>
            </div>
            <div class="col-md-5">
              <h2 class="font-google-quicksand fw-500">Email</h2>
              <div class="form-text">So I can contact you in the future.</div>
            </div>
            <div class="col-md-7">
              <input type="email" required class="form-control" />
            </div>
            <div class="col-md-3">
              <h2 class="font-google-quicksand fw-500">Name</h2>
            </div>
            <div class="col-md-9">
              <input type="text" required class="form-control" />
            </div>
          </div> -->
          </form>
        </div>
      </div>
    </div>
  </div>
</main>
