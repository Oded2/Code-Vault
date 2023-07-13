<script>
  import { toasts, ToastContainer, FlatToast } from "svelte-toasts";
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  const mailTo = hrefs["email"]["mailto"];
  const mail = hrefs["email"]["address"];
  const maxLengthShort = 50;
  const maxLengthLong = 5000;

  const formUrl = "https://formspree.io/f/mnqkqrgg";
  let toast;
  let email = "";
  let name = "";
  let topic = "";
  let message = "";
  let isSubmit = false;

  function clearValues() {
    email = "";
    name = "";
    topic = "";
    message = "";
  }

  async function onSubmit() {
    isSubmit = true;
    try {
      await fetch(formUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          topic,
          message,
        }),
      });
      clearValues();
      showToast();
    } catch {
      showToast("error", "Form not submitted", "There was an unexpected error");
    }
    isSubmit = false;
  }

  function showToast(
    type = "success",
    title = "Success",
    description = "Message sent successfully"
  ) {
    toast = toasts.add({
      title: title,
      description: description,
      duration: 5000,
      placement: "bottom-right",
      type: type,
      theme: "dark",
      showProgress: true,
    });
  }
</script>

<main>
  <ToastContainer>
    <FlatToast data={toast} />
  </ToastContainer>

  <Header activePage="contact" title="Contact" />
  <div class="container">
    <form on:submit|preventDefault={onSubmit}>
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
                bind:value={email}
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
                bind:value={name}
                class="form-control"
                required
              />
            </div>
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Topic</h4>
              <input
                type="text"
                maxlength={maxLengthShort}
                bind:value={topic}
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
                bind:value={message}
                class="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-center">
          <button
            class="btn btn-primary w-75 fs-5 fw-bold"
            type="submit"
            disabled={isSubmit}
            ><i class="fa-solid fa-paper-plane" />&nbsp; Send</button
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
