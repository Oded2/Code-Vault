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
  let emailError = { error: false, message: "" };
  let nameError = { error: false, message: "" };
  let topicError = { error: false, message: "" };
  let messageError = { error: false, message: "" };

  function validateValues() {
    let valid = true;
    const emailValid = validateValue(email, maxLengthShort, "Email", "email");
    const nameValid = validateValue(name, maxLengthShort, "Name");
    const topicValid = validateValue(topic, maxLengthShort, "Topic");
    const messageValid = validateValue(message, maxLengthLong, "Message");
    if (!emailValid["valid"]) {
      valid = false;
      emailError["message"] = emailValid["message"];
      emailError["error"] = true;
    }
    if (!nameValid["valid"]) {
      valid = false;
      nameError["message"] = nameValid["message"];
      nameError["error"] = true;
    }
    if (!topicValid["valid"]) {
      valid = false;
      topicError["message"] = topicValid["message"];
      topicError["error"] = true;
    }
    if (!messageValid["valid"]) {
      valid = false;
      messageError["message"] = messageValid["message"];
      messageError["error"] = true;
    }

    return valid;
  }
  function validateValue(value, maxLength, name, type = "text") {
    let valid = true;
    let message = "";
    if (value.length < 1) {
      message = name + " cannot be empty";
      valid = false;
    } else if (value.length > maxLength) {
      message =
        name +
        " has to be shorter than or equal to " +
        maxLength +
        " characters long";
      valid = false;
    }
    if (valid && type == "email") {
      if (!value.includes("@") || !value.includes(".")) {
        message = name + " must be a valid email";
        valid = false;
      }
    }
    return { valid: valid, message: message };
  }

  function clearValues() {
    email = "";
    name = "";
    topic = "";
    message = "";
  }
  function clearErrors() {
    emailError = { error: false, message: "" };
    nameError = { error: false, message: "" };
    topicError = { error: false, message: "" };
    messageError = { error: false, message: "" };
  }

  async function onSubmit() {
    if (!validateValues()) {
      return;
    }
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
      clearErrors();
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
      placement: "bottom-center",
      type: type,
      theme: "dark",
      showProgress: true,
    });
  }
</script>

<Header title={hrefs["contact"]["title"]} />
<main>
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
                class:border-error={emailError["error"]}
                required
              />
              {#if emailError["error"]}
                <span class="text-danger">{emailError["message"]}</span>
              {/if}
              <p class="form-text">Incase I need to get back to you.</p>
            </div>
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Name</h4>
              <input
                type="text"
                maxlength={maxLengthShort}
                bind:value={name}
                class="form-control"
                class:border-error={nameError["error"]}
                required
              />{#if emailError["error"]}
                <span class="text-danger">{nameError["message"]}</span>
              {/if}
            </div>
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Topic</h4>
              <input
                type="text"
                maxlength={maxLengthShort}
                bind:value={topic}
                class="form-control"
                class:border-error={topicError["error"]}
                required
              />{#if topicError["error"]}
                <span class="text-danger">{topicError["message"]}</span>
              {/if}
            </div>
            <div class="mt-2">
              <h4 class="form-label font-google-work-sans">Message</h4>
              <textarea
                maxlength={maxLengthLong}
                cols="30"
                rows="10"
                bind:value={message}
                class="form-control"
                class:border-error={messageError["error"]}
                required
              />{#if messageError["error"]}
                <span class="text-danger">{messageError["message"]}</span>
              {/if}
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
<ToastContainer>
  <FlatToast data={toast} />
</ToastContainer>

<style>
  .border-error {
    border: 2px solid #dc4c64;
  }
  textarea {
    resize: none;
  }
</style>
