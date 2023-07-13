<script>
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  const contactEmail = hrefs["email"]["mailto"];
  const maxLengthShort = 50;
  const maxLengthLong = 20000;
  let email, name, topic, message;

  let emailText;
  const makeEmail = () => {
    emailText = `User's email: ${email}\nuser's name: ${name}\n\nUser's message: \n\n${message} `;
  };
  $: console.log(emailText);
</script>

<main>
  <Header activePage="contact" title="Contact" />
  <div class="container">
    <form on:submit={makeEmail}>
      <div class="card shadow-lg my-5">
        <div class="card-body">
          <div class="border-bottom">
            <h1 class="font-google-quicksand fw-bold text-center">Contact</h1>
          </div>
          <div class="card-text mt-4">
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Email</h4>
              <input
                placeholder="someone@domain.com"
                maxlength={maxLengthShort}
                type="email"
                class="form-control"
                bind:value={email}
                required
              />
              <p class="form-text">Incase I need to get back to you.</p>
            </div>
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Name</h4>
              <input
                type="text"
                maxlength={maxLengthShort}
                class="form-control"
                bind:value={name}
                required
              />
            </div>
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Topic</h4>
              <input
                type="text"
                maxlength={maxLengthShort}
                class="form-control"
                bind:value={topic}
                required
              />
            </div>
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Message</h4>
              <textarea
                maxlength={maxLengthLong}
                cols="30"
                rows="10"
                class="form-control"
                bind:value={message}
                required
              />
            </div>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-center">
          <button class="btn btn-primary w-75 fs-5 fw-bold" value="Send"
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
