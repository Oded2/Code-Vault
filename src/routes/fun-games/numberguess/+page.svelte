<script>
  import Header from "../../../components/Header.svelte";
  import hrefs from "../../../data/hrefs.json";
  const directory = hrefs["fun-games"];
  let minNum = 0;
  let maxNum = 100;
  let userNum;
  let winningNum;
  let gameBefore = true;
  let gameAfter = false;
  let indicator;
  let attempts = 0;
  let numbersTried = [];
  let win = false;
  $: numbersTried = numbersTried.sort((a, b) => {
    return a - b;
  });
  const startGame = () => {
    gameBefore = false;
    gameAfter = true;
    winningNum = randomNum(minNum, maxNum);
  };
  const hint = () => {
    if (!win) {
      userNum = winningNum;
      checkNum();
    } else {
      resetGame();
    }
  };
  function resetGame() {
    numbersTried = [];
    userNum = null;
    attempts = 0;
    indicator = null;
    win = false;
    gameBefore = true;
    gameAfter = false;
  }

  const checkNum = () => {
    if (isNaN(userNum) || !userNum) {
      return;
    }
    attempts++;
    if (!numbersTried.includes(userNum)) {
      numbersTried[numbersTried.length] = userNum;
    }
    if (userNum == winningNum) {
      win = true;
      return;
    }

    if (userNum < winningNum) {
      indicator = "Low";
    } else if (userNum > winningNum) {
      indicator = "High";
    }
    userNum = null;
  };
  function keyDown(e) {
    const key = e.key;
    if (key == "Enter") {
      checkNum();
    }
  }
  function randomNum(min, max) {
    max++;
    const difference = max - min;
    let rand = Math.floor(Math.random() * difference) + min;
    return rand;
  }
</script>

<main class="text-bg-dark full-background">
  <Header {directory} title={directory["numberguess"]["title"]} />
  <section class="py-5">
    <div class="container">
      <div class="row gx-4 gx-lg-5">
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-7 text-center text-md-start">
              <h1 class="font-google-quicksand">Minimum Number</h1>
            </div>
            <div class="col-md-5 d-flex align-items-center">
              <input
                disabled={!gameBefore}
                bind:value={minNum}
                type="number"
                class="form-control font-google-quicksand"
              />
            </div>
          </div>
          <div class="row my-md-4">
            <div class="col-md-7 text-center text-md-start">
              <h1 class="font-google-quicksand">Maximum Number</h1>
            </div>
            <div class="col-md-5 d-flex align-items-center">
              <input
                disabled={!gameBefore}
                bind:value={maxNum}
                type="number"
                class="form-control font-google-quicksand"
              />
            </div>
          </div>
          <div class="row">
            <div
              class="col-md-12 text-center text-md-start d-flex justify-content-center"
            >
              <button
                disabled={!gameBefore}
                class="btn fs-5 w-100 w-sm-50 w-md-25 my-md-0 my-3 mb-md-3"
                class:btn-primary={gameBefore}
                class:btn-secondary={gameAfter}
                on:click={startGame}
              >
                Start
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-12 text-center">
                  <h1 class="font-google-quicksand">Enter Your Guess</h1>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 text-center">
                  <div class="d-flex justify-content-center">
                    <input
                      disabled={!gameAfter}
                      bind:value={userNum}
                      type="number"
                      class="form-control py-2 w-25 fs-5"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div
                class="d-flex justify-content-center align-items-center h-100"
              >
                <button
                  class="btn h-75 w-25 fs-4 my-4 my-md-0 mx-2"
                  class:btn-secondary={gameBefore}
                  class:btn-primary={gameAfter}
                  disabled={!gameAfter}
                  on:click={checkNum}
                >
                  Check
                </button>
                <button
                  on:click={hint}
                  class="btn h-75 w-25 fs-5 my-4 my-md-0 mx-2 text-light"
                  class:btn-secondary={gameBefore}
                  class:btn-info={gameAfter}
                  disabled={!gameAfter}
                >
                  {#if win}
                    Restart Game
                  {:else}
                    Reveal Answer
                  {/if}
                </button>
              </div>
            </div>
            <div class="col-lg-6 py-4">
              <div
                class="text-light text-center py-4 rounded"
                class:bg-secondary={!indicator && !win}
                class:bg-warning={!win && indicator}
                class:bg-success={win}
              >
                <h1 class="font-google-work-sans">
                  {#if !win && gameAfter && indicator}
                    Too {indicator}
                  {:else if win}
                    You win!
                  {:else}
                    <h1>Please Start the Game</h1>
                  {/if}
                </h1>
              </div>
            </div>
            <div class="col-lg-6 py-4">
              <div
                class="text-light text-center py-4 rounded"
                class:bg-secondary={attempts == 0}
                class:bg-success={gameAfter && attempts > 0 && attempts <= 10}
                class:bg-warning={gameAfter && attempts > 10 && attempts <= 20}
                class:bg-danger={gameAfter && attempts > 20}
              >
                <h1 class="font-google-work-sans">
                  {#if gameAfter}
                    Attempts: {attempts}
                  {:else}
                    Attempt Counter
                  {/if}
                </h1>
              </div>
            </div>
            <div class="col-md-12 py-4">
              {#if gameAfter}
                <p class="display-6">
                  Numbers Tried: {#each numbersTried as number, index}
                    {#if index != 0}
                      ,
                    {/if}
                    {number}
                  {/each}
                </p>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<svelte:window on:keydown={keyDown} />

<style>
  button {
    transition: 0.2s;
  }
</style>
