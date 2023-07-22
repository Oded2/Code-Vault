<script>
  import Header from "../../../components/Header.svelte";
  import hrefs from "../../../data/hrefs.json";
  import happyRobot from "../../../images/funGames/robot/happy.png";
  import neutralRobot from "../../../images/funGames/robot/neutral.png";
  import angryRobot from "../../../images/funGames/robot/angry.png";
  let newDescription = "";
  let i = 0;
  const description =
    "Hello I am Numbo, and welcome to the reverse number guesser. Please provide me with a maximum and minimum number and I will use my complex algorithmic skills to guess your number as quickly as possible. Don't worry, I'm not cheating. To start, enter a number and a viable range of the number.";
  const speed = 10;
  function typeWriter() {
    if (i < description.length) {
      newDescription += description[i];
      i++;
      setTimeout(typeWriter, speed);
    }
  }
  typeWriter();
  let start = false;
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
  function resetGame() {
    for (let i in errors) {
      errors[i]["error"] = false;
      errors[i]["message"] = "";
    }
    guessedNums = [];
    minNum = 0;
    maxNum = 100;
    userNum = 50;
  }

  function handleStart() {
    if (!validateValues()) {
      return;
    }
    resetGame();
    start = true;
    guessNum();
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
    guessedNums[guessedNums.length] = guessed;
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

<main class="dark-background text-bg-dark">
  <Header
    directory={hrefs["fun-games"]}
    title={hrefs["fun-games"]["reversenumberguess"]["title"]}
  />
  <div class="container py-5">
    <h1 class="font-google-quicksand fw-bold">Reverse Number Guesser</h1>
    <h2 class="font-google-quicksand fw-bold text-warning">
      This is a work in progress
    </h2>
    <div class="border-start ps-3 my-4">
      <p class="font-google-space-mono fs-5">
        {description}
      </p>
    </div>

    <div class="card my-5">
      <div class="card-header">
        <h4 class="text-center">Reverse Number Guesser</h4>
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
                <h3 class="font-google-quicksand fw-bold">Minmum Guess</h3>
                <input type="number" class="form-control" bind:value={minNum} />
              </div>
              <div class="col">
                <h3 class="font-google-quicksand fw-bold">Maximum Guess</h3>
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
                  <button class="btn btn-success fs-5 w-100">Yes</button>
                </div>
                <div class="col">
                  <button class="btn btn-dark fs-5 w-100" on:click={isLower}
                    >Lower</button
                  >
                </div>
                <div class="col">
                  <button class="btn btn-primary fs-5 w-100" on:click={isHigher}
                    >Higher</button
                  >
                </div>
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
              <img src={happyRobot} alt="Happy Robot" class="img-fluid" />
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  .border-error {
    border: 2px solid #dc4c64;
  }
</style>
