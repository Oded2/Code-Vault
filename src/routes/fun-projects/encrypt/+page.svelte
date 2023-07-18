<script>
  import Header from "../../../components/Header.svelte";
  import hrefs from "../../../data/hrefs.json";
  let password = "";
  $: hash = hashPass(password);
  let orignalMessage = "";
  $: encryptedMessage = encryptAny(orignalMessage, hash);
  const abc = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
    i: 8,
    j: 9,
    k: 10,
    l: 11,
    m: 12,
    n: 13,
    o: 14,
    p: 15,
    q: 16,
    r: 17,
    s: 18,
    t: 19,
    u: 20,
    v: 21,
    w: 22,
    x: 23,
    y: 24,
    z: 25,
  };
  const charMap = {
    "!": 0,
    "@": 1,
    "#": 2,
    $: 3,
    "%": 4,
    "^": 5,
    "&": 6,
    "*": 7,
    "(": 8,
    ")": 9,
    " ": 10,
    ".": 11,
    ",": 12,
    "[": 13,
    "]": 14,
    "|": 15,
    "/": 16,
    "\\": 17,
    "-": 18,
    "+": 19,
    "=": 20,
    _: 21,
    "`": 22,
    "~": 23,
    "?": 24,
    "<": 25,
    ">": 26,
    "{": 27,
    "}": 28,
    "'": 29,
    '"': 30,
    ";": 31,
    ":": 32,
  };
  const isUpper = /^[A-Z]+$/;
  const isNumeric = /^-?\d+(\.\d+)?$/;
  const hashPass = (pass) => {
    if (pass.length == 0) {
      return 0;
    }
    let final = 0;
    let temp;
    for (let i = 0; i < pass.length; i++) {
      let multiplier = pass.length;
      const currentIndex = pass[i];
      if (currentIndex.toLowerCase() in abc) {
        if (isUpper.test(currentIndex)) {
          multiplier *= 2;
        }
        temp = (abc[currentIndex.toLowerCase()] + 1) * multiplier;
      } else if (isNumeric.test(currentIndex)) {
        temp = parseInt(currentIndex);
      } else if (currentIndex in charMap) {
        temp = (charMap[currentIndex] + 1) * multiplier;
      } else {
        temp = 1;
      }
      final += temp;
    }

    final = parseInt(final.toString().replace(/0/g, "1"));
    return final;
  };
  async function paste() {
    try {
      const clip = await navigator.clipboard.readText();
      return clip;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
  const pasteToOrignal = async () => {
    orignalMessage = await paste();
  };
  const copytoClipboard = () => {
    navigator.clipboard.writeText(encryptedMessage);
  };
  const encryptAny = (message, code) => {
    message = message.toString();
    code = code.toString();
    let final = "";
    for (let i = 0; i < message.length; i++) {
      const currentLetter = message[i];
      const currentIndex = i % code.length;
      const current_num = parseInt(code[currentIndex]);
      final += shiftUp(currentLetter, current_num);
    }
    return final;
  };
  function shiftUp(letter, num) {
    if (letter.toLowerCase() in abc) {
      const isCap = letter.toUpperCase() === letter;
      const position = abc[letter.toLowerCase()];
      for (const i in abc) {
        if (abc[i] == (position + num) % 26) {
          if (isCap) {
            return i.toUpperCase();
          } else {
            return i.toLowerCase();
          }
        }
      }
    } else if (letter in charMap) {
      const position = charMap[letter];
      const length = Object.keys(charMap).length;
      for (const i in charMap) {
        if (charMap[i] == (position + num) % length) {
          return i;
        }
      }
    } else if (!isNaN(parseInt(letter))) {
      const numShift = (parseInt(letter) + num) % 10;
      return numShift.toString();
    } else {
      return letter;
    }
  }
</script>

<Header
  directory={hrefs["fun-projects"]}
  title={hrefs["fun-projects"]["encrypt"]["title"]}
/>
<main>
  <section>
    <div class="container">
      <div class="row">
        <div class="col-md-12 py-3">
          <h1 class="font-google-work-sans text-sm-center fw-600">Encrypt</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-auto">
          <h2 class="font-google-signika-negative">Enter a Password:</h2>
        </div>
        <div class="col-5">
          <input class="form-control fs-5" type="text" bind:value={password} />
        </div>
        <div class="col-auto">
          <h2 class="font-google-signika-negative">Hash: {hash}</h2>
        </div>
      </div>
    </div>
    <div class="container-fluid p-sm-5">
      <div class="row mt-3">
        <div class="col-md-6">
          <h2 class="font-google-quicksand text-center fw-bold">
            Original Message
          </h2>
          <textarea
            bind:value={orignalMessage}
            placeholder="Place your original message here"
            class="form-control"
            rows="15"
          />
          <button
            class="btn btn-outline-dark w-100 mt-2"
            on:click={pasteToOrignal}
          >
            Paste
          </button>
        </div>
        <div class="col-md-6 mt-4 mt-md-0">
          <h2 class="font-google-quicksand text-center fw-bold">
            Encrypted Message
          </h2>
          <textarea
            bind:value={encryptedMessage}
            placeholder="Encrypted message will be displayed here"
            class="form-control"
            rows="15"
            disabled
          />
          <button
            class="btn btn-outline-dark w-100 my-2"
            on:click={copytoClipboard}
          >
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  textarea {
    resize: none;
  }
</style>
