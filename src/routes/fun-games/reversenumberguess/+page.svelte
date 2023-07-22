<script>
  import Header from "../../../components/Header.svelte";
  import Modal from "../../../components/Modal.svelte";
  import hrefs from "../../../data/hrefs.json";
  let newDescription = "";
  let i = 0;
  const description =
    "Hello I am Numbo, and welcome to the reverse number guesser. Please provide me with a maximum and minimum number and I will use my complex algorithmic skills to guess your number as quickly as possible, and don't worry, I'm not cheating. To start, enter a number and a viable range of the number.";
  function typeWriter() {
    if (i < description.length) {
      newDescription += description[i];
      i++;
      setTimeout(typeWriter, 25);
    }
  }

  typeWriter();
  let start = false;
  let showLoseModal = false;
  let showWinModal = false;
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
  function toggleLoseModal() {
    showLoseModal = !showLoseModal;
  }
  function toggleWinModal() {
    showWinModal = !showWinModal;
  }
  function handleStart() {
    if (!validateValues()) {
      return;
    }
    start = true;
    guessNum();
  }
  function handleEnd() {
    const func = userNum == guessed ? toggleWinModal : toggleLoseModal;
    func();
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
    if (value > maxNum) {
      return `${name} cannot be higher than the maximum guess`;
    }
    if (value < minNum) {
      return `${name} cannot be lower than the minimum guess`;
    }
    return null;
  }

  function guessNum() {
    guessed = randomNum(minNum, maxNum);
    while (guessedNums.includes(guessed)) {
      guessed = randomNum(minNum, maxNum);
      if (maxNum - minNum == 1 || maxNum - minNum == 0) {
        handleEnd();
        break;
      }
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
</script>

<Modal showModal={showLoseModal} on:click={toggleLoseModal}
  ><div class="p-5 font-google-quicksand">
    <h1>You Lose!</h1>
    <h3>
      Maybe next time you should think twice about misleading a helpless robot
    </h3>
  </div>
</Modal>
<Modal showModal={showWinModal} on:click={toggleWinModal}
  ><div class="p-5 font-google-quicksand">
    <h1>You Win!</h1>
    <h3>Congratulations! You helped Numbo guess the right number.</h3>
  </div>
</Modal>

<main class="dark-background text-bg-dark">
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
        {newDescription}
      </p>
    </div>

    <div class="card my-5">
      <div class="card-header">
        <h4 class="text-center font-google-quicksand fw-bold">
          Reverse Number Guesser
        </h4>
      </div>
      {#if !start}
        <form on:submit={handleStart}>
          <div class="card-body">
            <div class="row">
              <div class="col">
                <h3 class="font-google-quicksand fw-bold">Your Number</h3>
                <input
                  type="number"
                  class="form-control"
                  class:border-error={errors["user"]["error"]}
                  bind:value={userNum}
                />

                <span class="form-text text-danger"
                  >{errors["user"]["message"]}</span
                >
              </div>
              <div class="col">
                <h3 class="font-google-quicksand fw-bold">Minmum</h3>
                <input type="number" class="form-control" bind:value={minNum} />
              </div>
              <div class="col">
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
                    Your number isn't higher than {maxNum}
                  </li>
                  <li class="list-group-item">
                    Your number isn't lower than {minNum}
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
          * Remember, you're goal is to help Numbo guess the right number, if he
          loses, you lose too.
        </span>
      </div>
    </div>
  </div>
</main>

<style>
  .border-error {
    border: 2px solid #dc4c64;
  }
</style>
