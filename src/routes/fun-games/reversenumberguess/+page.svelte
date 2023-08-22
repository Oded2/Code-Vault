<script>
  import Header from "../../../components/Header.svelte";
  import Modal from "../../../components/Modal.svelte";
  import hrefs from "../../../data/hrefs.json";
  import explanations from "./explananations.json";
  let i = 0;
  const description =
    "Hello I am Numbo, and welcome to the reverse number guesser. Please provide me with a maximum and minimum number and I will use my complex algorithmic skills to guess your number as quickly as possible, and don't worry, I'm not cheating. To start, enter a number and a viable range of the number.";

  let start = false;
  let showModal = false;
  let userNum = 50;
  let maxNum = 100;
  let minNum = 0;
  let errors = {
    user: { error: false, message: "" },
    min: { error: false, message: "" },
    max: { error: false, message: "" },
  };
  let guessed;
  let guessedNums = [];
  let stats = {};
  const statuses = { 1: "Hopeful", 2: "Curious", 3: "Confused", 4: "Clueless" };
  let statusLevel = 1;
  function resetGame() {
    for (let i in errors) {
      errors[i]["error"] = false;
      errors[i]["message"] = "";
    }
    guessedNums = [];
    minNum = 0;
    maxNum = 100;
    userNum = 50;
    statusLevel = 1;
  }
  function toggleModal() {
    showModal = !showModal;
  }
  function handleStart() {
    if (!validateValues()) {
      return;
    }
    start = true;
    guessNum(true);
  }

  function handleEnd() {
    stats = {
      win: userNum == guessed,
      attempts: guessedNums.length,
      userNum: userNum,
    };
    toggleModal();
    resetGame();
    start = false;
  }
  function validateValues() {
    let valid = true;
    let user = validateValue(userNum, "Your number");
    let min = validateValue(minNum, "Minimum number");
    let max = validateValue(maxNum, "Maximum number");
    if (user) {
      (errors["user"]["error"] = true), (errors["user"]["message"] = user);
      valid = false;
    }
    if (min) {
      (errors["min"]["error"] = true), (errors["min"]["message"] = min);
    }
    if (max) {
      (errors["max"]["error"] = true), (errors["max"]["message"] = min);
    }
    return valid;
  }
  function validateValue(value, name = "Undefined") {
    if (!value) {
      return `${name} cannot be empty`;
    }
    if (value >= maxNum) {
      return `${name} cannot be higher than or equal to the maximum guess`;
    }
    if (value <= minNum) {
      return `${name} cannot be lower than or equal to the minimum guess`;
    }
    return null;
  }

  function guessNum(first) {
    guessed = Math.round((minNum + maxNum) / 2);
    if (first) {
      guessed = randomNum(minNum, maxNum);
    }
    if (guessedNums.includes(guessed)) {
      handleEnd();
    }
    guessedNums[guessedNums.length] = guessed;
    const length = guessedNums.length;
    if (length > 15) {
      statusLevel = 4;
    } else if (length > 10) {
      statusLevel = 3;
    } else if (length > 4) {
      statusLevel = 2;
    }
  }
  function isLower() {
    maxNum = guessed;
    guessNum();
  }
  function isHigher() {
    minNum = guessed;
    guessNum();
  }
  function randomNum(min, max) {
    const difference = max - min;
    let rand = Math.floor(Math.random() * difference) + min;
    return rand;
  }
  function randomizeUserNum() {
    if (!minNum) {
      minNum = 0;
    }
    if (!maxNum) {
      maxNum = 100;
    }
    userNum = randomNum(minNum, maxNum);
  }
</script>

<Modal {showModal} on:click={toggleModal}
  ><div class="p-5 font-google-quicksand">
    {#if stats["win"]}
      <h1><i class="fa-solid fa-circle-check" /> You Win!</h1>
      <h3>Congratulations! You helped Numbo guess the right number.</h3>
    {:else}
      <h1><i class="fa-solid fa-circle-xmark" /> You Lose</h1>
      <h3>Next time think twice before misleading a helpless robot.</h3>
    {/if}
    <div class="py-5">
      <h4>Attempts: {stats["attempts"]}</h4>
      <h4>Your number: {stats["userNum"]}</h4>
    </div>
  </div>
</Modal>

<main class="full-background text-bg-dark">
  <Header
    directory={hrefs["fun-games"]}
    title={hrefs["fun-games"]["reversenumberguess"]["title"]}
  />
  <div class="container py-5">
    <h1 class="font-google-quicksand fw-bold">
      <span class="text-warning">Reverse</span> Number Guesser
    </h1>

    <div class="border-start ps-3 my-4">
      <p class="font-google-space-mono fs-5">
        {description}
      </p>
    </div>

    <div class="card my-5">
      <div class="card-header">
        <div class="row">
          <div class="col">
            {#if start}Your number: {userNum}{/if}
          </div>
          <div class="col-auto">
            <h4 class="text-center font-google-quicksand fw-bold">
              Reverse Number Guesser
            </h4>
          </div>
          <div class="col" />
        </div>
      </div>
      {#if !start}
        <form on:submit={handleStart}>
          <div class="card-body">
            <div class="row">
              <div class="col" />
            </div>
            <div class="row">
              <div class="col-md">
                <h3 class="font-google-quicksand fw-bold">Your Number</h3>
                <div class="row">
                  <div class="col">
                    <input
                      type="number"
                      class="form-control"
                      class:border-error={errors["user"]["error"]}
                      bind:value={userNum}
                    />
                  </div>
                  <div class="col-auto">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      title="Randomize"
                      on:click={randomizeUserNum}
                    >
                      <i class="fa-solid fa-dice" />
                    </button>
                  </div>
                </div>

                <span class="form-text text-danger"
                  >{errors["user"]["message"]}</span
                >
              </div>
              <div class="col-md mt-2 mt-md-0">
                <h3 class="font-google-quicksand fw-bold">Minmum</h3>
                <input type="number" class="form-control" bind:value={minNum} />
              </div>
              <div class="col-md mt-2 mt-md-0">
                <h3 class="font-google-quicksand fw-bold">Maximum</h3>
                <input type="number" class="form-control" bind:value={maxNum} />
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary fs-5 w-100" type="submit"
              >Start Game</button
            >
          </div>
        </form>
      {:else}
        <div class="card-body">
          <div class="row">
            <div class="col-md mb-4 mb-md-0 px-md-5">
              <h3 class="font-google-quicksand fw-bold">
                Is your number {guessed}?
              </h3>
              <div class="row">
                <div class="col">
                  <button class="btn btn-dark fs-5 w-100" on:click={isLower}
                    ><i class="fa-solid fa-down-long" />&nbsp; Lower</button
                  >
                </div>
                <div class="col">
                  <button class="btn btn-primary fs-5 w-100" on:click={isHigher}
                    ><i class="fa-solid fa-up-long" />&nbsp; Higher</button
                  >
                </div>
              </div>
              <div class="my-2">
                <button class="btn btn-success fs-5 w-100" on:click={handleEnd}
                  ><i class="fa-solid fa-check" />&nbsp; Yes</button
                >
              </div>
              <div class="py-3">
                <h3>Numbo's Info:</h3>

                <ul class="list-group">
                  <li class="list-group-item">
                    Your number is lower than {maxNum}
                  </li>
                  <li class="list-group-item">
                    Your number is higher than {minNum}
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-md mb-4 mb-md-0">
              <h5>Numbo's attempted numbers</h5>
              <ul class="list-group list-group-flush px-5">
                {#each guessedNums as number}
                  <li class="list-group-item fs-4">{number}</li>
                {/each}
              </ul>
            </div>
            <div class="col-md mb-4 mb-md-0">
              <div class="font-google-quicksand text-center">
                <h2 class="fw-bold">Numbo's Status</h2>
                <h1>{statuses[statusLevel]}</h1>
              </div>
            </div>
          </div>
        </div>
      {/if}
      <div class="card-footer">
        <span class="fw-light">
          * Remember, your goal is to help Numbo guess the right number, if he
          loses, you lose too.
        </span>
      </div>
    </div>
    <div>
      <h1 class="font-google-quicksand fw-bold">
        How does this <span class="text-warning">work?</span>
      </h1>
      <p class="fs-4 font-google-quicksand fw-500">
        No, Numbo doesn't pick a number at random. This code utilizes the <a
          href="https://en.wikipedia.org/wiki/Binary_search_algorithm"
          class="text-light"
          target="_blank"
          ><i class="fa-solid fa-up-right-from-square fs-6" /> binary search algorithm</a
        > to find your number at the quickest possible way.
      </p>
      {#each explanations as explanation}
        <div class="my-5">
          <h2
            class="font-google-quicksand fw-bold text-header text-decoration-underline"
          >
            {explanation["title"]}
          </h2>

          <p class="font-google-quicksand fw-500 fs-4">
            {explanation["explanation"]}
          </p>
        </div>
      {/each}
      <div class="row">
        <div class="col-md pe-md-5">
          <h2
            class="font-google-quicksand fw-bold text-header text-decoration-underline"
          >
            Video
          </h2>
          <p class="font-google-quicksand fw-500 fs-4">
            Feel free to watch this video by <a
              href="https://www.youtube.com/@Fireship"
              class="text-light"
              target="_blank"
              ><i class="fa-solid fa-up-right-from-square fs-6" /> Fireship</a
            > to get a better and more visual representation of the binary search
            algorithm.
          </p>
        </div>
        <div class="col-md ratio ratio-16x9">
          <iframe
            src="https://www.youtube-nocookie.com/embed/MFhxShGxHWc"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            class=""
          />
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .border-error {
    border: 2px solid #dc4c64;
  }
  .text-header {
    transition: 0.2s;
  }
  .text-header:hover {
    color: #d3d3d3;
  }
</style>
