<script>
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  const mailTo = hrefs["email"]["mailto"];
  const mail = hrefs["email"]["address"];
  const maxLengthShort = 50;
  const maxLengthLong = 5000;
</script>

<main>
  <Header activePage="contact" title="Contact" />
  <div class="container">
    <form action="https://submit-form.com/gayNHGeg">
      <div class="card shadow-lg my-5">
        <div class="card-body">
          <div class="border-bottom">
            <h1 class="font-google-quicksand fw-bold text-center">Contact</h1>
            <p class="form-text">
              You can also contact me directly at <a
                class="link-secondary"
                href={mailTo}>{mail}</a
              >.
            </p>
          </div>
          <div class="card-text mt-2">
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Email</h4>
              <input
                placeholder="someone@domain.com"
                maxlength={maxLengthShort}
                type="email"
                name="email"
                class="form-control"
                required
              />
              <p class="form-text">Incase I need to get back to you.</p>
            </div>
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Name</h4>
              <input
                type="text"
                maxlength={maxLengthShort}
                name="name"
                class="form-control"
                required
              />
            </div>
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Topic</h4>
              <input
                type="text"
                maxlength={maxLengthShort}
                name="topic"
                class="form-control"
                required
              />
            </div>
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Message</h4>
              <textarea
                maxlength={maxLengthLong}
                cols="30"
                rows="10"
                name="message"
                class="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-center">
          <button class="btn btn-primary w-75 fs-5 fw-bold" type="submit"
            >Submit</button
          >
        </div>
      </div>
    </form>
  </div>
</main>

<style>
  textarea {
    resize: none;
  }
</style>
