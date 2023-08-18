<script>
  import Header from "../../../components/Header.svelte";
  import Switch from "../../../components/Switch.svelte";
  import wordGuess from "../../../images/svg/word_guess.svg";
  import hrefs from "../../../data/hrefs.json";
  const directory = hrefs["fun-games"];
  let gameBefore = true;
  let gameAfter = false;
  let placeHolder = "_";
  let maxLen = 10;
  let minLen = 0;
  let maxTries = 10;
  let showHints = true;
  let winningWord = "";
  let lettersUsed = [];
  let attempts = 0;
  let userGuess = "";
  let indexes = [];

  $: lettersUsed = lettersUsed.sort();
  $: triesLeft = maxTries - attempts;
  let totalWords = [];
  fetchWords();
  let revealed = "";
  $: win =
    winningWord == revealed && winningWord != "" && revealed != "" && !lose;
  $: lose = attempts >= maxTries;
  function findIndexes(word, letter) {
    let final = [];
    for (let i = 0; i < word.length; i++) {
      const currentLetter = word[i];
      if (currentLetter == letter) {
        final[final.length] = i;
      }
    }
    return final;
  }

  function getPlaceholderWord(word, index) {
    let final = "";
    for (let i = 0; i < word.length; i++) {
      if (index.includes(i)) {
        final += word[i];
      } else {
        final += placeHolder;
      }
    }
    return final;
  }
  function capitalizeFirst(str) {
    if (str.length == 0) {
      return;
    }
    return str[0].toUpperCase() + str.slice(1);
  }
  const startGame = () => {
    lettersUsed = [];
    attempts = 0;
    indexes = [];
    winningWord = chooseWord(minLen, maxLen);
    revealed = getPlaceholderWord(winningWord, indexes);
    gameBefore = false;
    gameAfter = true;
  };

  const check = () => {
    userGuess = userGuess.toLowerCase();
    indexes = indexes.concat(findIndexes(winningWord, userGuess));
    revealed = getPlaceholderWord(winningWord, indexes);
    if (
      !winningWord.includes(userGuess) &&
      !win &&
      !lettersUsed.includes(userGuess)
    ) {
      attempts++;
      if (userGuess.length == 1) {
        lettersUsed[lettersUsed.length] = userGuess;
      }
    }
    userGuess = "";
  };

  const endGame = () => {
    gameBefore = true;
    gameAfter = false;
  };

  const keyPress = (e) => {
    if (e.key == "Enter") {
      check();
    }
  };
  const revealLetter = () => {
    let r;
    while (true) {
      r = Math.floor(Math.random() * winningWord.length);
      if (!indexes.includes(r)) {
        break;
      }
    }
    userGuess = winningWord[r];
    check();
  };
  async function getWords() {
    try {
      const response = await fetch(
        addParams("https://random-word-api.herokuapp.com/word", {
          number: 9999,
        })
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
      return;
    }
  }
  async function fetchWords() {
    totalWords = await getWords();
  }
  function addParams(link, params) {
    link = new URL(link);
    let value;
    for (let key in params) {
      value = params[key];

      link.searchParams.append(key, value);
    }
    return link.toString();
  }
  function chooseWordNow() {
    let randomIndex = Math.floor(Math.random() * totalWords.length);
    let randomWord = totalWords[randomIndex];
    return randomWord;
  }
  function chooseWord(min, max) {
    let temp;
    for (let i = 0; i < totalWords.length; i++) {
      temp = chooseWordNow();
      if (temp.length >= min && temp.length <= max) {
        return temp;
      }
    }
    alert(
      "Could not find a word within your minimum and maximum range; you will be selected a random word instead."
    );
    return temp;
  }
</script>

<main class="text-bg-dark full-background">
  <Header {directory} title={directory["wordguess"]["title"]} />

  <section hidden={gameAfter}>
    <div class="container">
      <form on:submit|preventDefault={startGame}>
        <div class="row">
          <div
            class="col-md-9 col-12 d-flex align-items-center justify-content-center"
          >
            <h1 class="font-google-mulish fw-bold">Word Guesser</h1>
          </div>
          <div class="col-3 d-none d-md-block">
            <img src={wordGuess} alt="Word Guesser" class="img-fluid" />
          </div>
          <div
            class="col-md-9 col-12 border border-info rounded text-start p-3"
          >
            <p class="font-google-quicksand fs-5">
              <span class="text-warning">Word Guesser</span> is an engaging and sophisticated
              word-guessing game that challenges players to deduce a hidden word.
              With each correct guess, the game reveals the place of one letter,
              maintaining a stimulating level of difficulty. Additionally, players
              are provided with a helpful list of guessed letters, neatly arranged
              in alphabetical order.
            </p>
          </div>
          <div class="col-md-3">
            <button
              disabled={totalWords.length == 0}
              type="submit"
              class="btn btn-primary fs-1 h-100 w-100 font-google-signika-negative my-md-0 my-2"
            >
              Start Game
            </button>
          </div>
        </div>

        <div class="row my-3 bg-light text-dark">
          <div class="col-12 bg-warning-subtle py-4">
            <h1 class="font-google-quicksand text-center fw-bold">Settings</h1>
          </div>

          <div class="col-md-6 col-7 p-4 d-flex bg-dark-subtle d-flex-center">
            <h2 class="font-google-roboto-mono fw-bold">Placeholder</h2>
          </div>
          <div class="col-md-6 col-5 d-flex-center">
            <select
              required
              bind:value={placeHolder}
              class="form-select form-select-lg fs-4"
            >
              <option selected value="_">Underscore "_"</option>
              <option value="#">Hashtag "#"</option>
              <option value="$">Dollar Sign "$"</option>
              <option value="*">Asterisk "*"</option>
              <option value="-">Hyphen "-"</option>
              <option value="~">Tilda "~"</option>
              <option value="!">Exclamation Point "!"</option>
              <option value="@">Ampersat "@"</option>
              <option value="^">Circumflex "^"</option>
              <option value="=">Equal Sign "="</option>
              <option value=":">Colin ":"</option>
              <option value=".">Period "."</option>
              <option value="?">Question Mark "?"</option>
              <option value="|">Pipe "|"</option>
            </select>
          </div>
          <div
            class="col-md-6 col-7 p-4 d-flex bg-secondary-subtle d-flex-center"
          >
            <h2 class="font-google-roboto-mono fw-bold">Minimum Length</h2>
          </div>
          <div class="col-md-6 col-5 d-flex align-items-center">
            <input
              required
              type="number"
              class="form-control fs-4"
              bind:value={minLen}
              min="0"
              max="20"
            />
          </div>
          <div class="col-md-6 col-7 p-4 d-flex bg-dark-subtle d-flex-center">
            <h2 class="font-google-roboto-mono fw-bold">Maximum Length</h2>
          </div>
          <div class="col-md-6 col-5 d-flex align-items-center">
            <input
              required
              type="number"
              class="form-control fs-4"
              bind:value={maxLen}
              min="0"
              max="20"
            />
          </div>
          <div
            class="col-md-6 col-7 p-4 d-flex bg-secondary-subtle d-flex-center"
          >
            <h2 class="font-google-roboto-mono fw-bold">
              Maximum Amount of Tries
            </h2>
          </div>
          <div class="col-md-6 col-5 d-flex align-items-center">
            <input
              required
              type="number"
              bind:value={maxTries}
              class="form-control fs-4"
              min="1"
            />
          </div>
          <div class="col-md-6 col-7 p-4 d-flex bg-dark-subtle d-flex-center">
            <h2 class="font-google-roboto-mono fw-bold">Show Hints</h2>
          </div>
          <div class="col-md-6 col-5 d-flex align-items-center">
            <Switch bind:checked={showHints} />
          </div>
        </div>
      </form>
    </div>
  </section>
  <!-- Game -->
  <section hidden={gameBefore}>
    <div class="container">
      <div class="row">
        <div class="col-12 text-center py-4">
          <h1 class="font-google-roboto-mono">Guess the Word</h1>
        </div>
        <div
          class="div col-12 border text-center rounded overflow-auto"
          class:border-info={!win && !lose}
          class:border-success={win}
          class:border-danger={lose}
        >
          <p class="display-2 letter-spaced">
            {capitalizeFirst(revealed)}
          </p>
        </div>
      </div>
      <div class="container-fluid my-5 text-dark">
        <div class="row p-3 d-flex align-items-center bg-secondary-subtle">
          <div class="col-md-6">
            <h1 class="font-google-quicksand text-center">Enter Your Guess</h1>
          </div>
          <div class="col-md-4 d-flex justify-content-center">
            <input
              type="text"
              bind:value={userGuess}
              class="form-control fs-3"
              placeholder="Place your guess"
            />
          </div>
          <div class="col-md-2 d-flex justify-content-center">
            <button
              class="btn btn-primary w-100 my-2 my-md-0 fs-3"
              on:click={check}
            >
              Check
            </button>
          </div>
        </div>
        <div class="row py-3 bg-dark-subtle">
          <div class="col-md-4 py-1 text-md-end text-center">
            <h1 class="font-google-quicksand fw-bold">Letters Used:</h1>
          </div>
          <div class="col-md-8 text-start">
            <p class="display-6">
              {#each lettersUsed as letter, index}
                {#if index != 0}
                  ,
                {/if}
                {letter}
              {/each}
            </p>
          </div>
        </div>
        <div class="row py-3 bg-secondary-subtle">
          <div class="col-md-4 py-1 text-md-end text-center">
            <h1 class="font-google-quicksand fw-bold">Tries Left:</h1>
          </div>
          <div class="col-md-6 text-start">
            <progress value={triesLeft} max={maxTries} class="w-100 h-100" />
          </div>
          <div class="col-md-2 text-center">
            <h1 class="font-google-quicksand">{triesLeft}</h1>
          </div>
        </div>
        <div class="row bg-info-subtle p-3" hidden={!showHints}>
          <div
            class="col-md-12 my-2 my-md-0 d-flex justify-content-center align-items-center"
          >
            <button
              class="btn btn-info fs-3 text-light w-50"
              on:click={revealLetter}
              disabled={revealed == winningWord}
            >
              Reveal Letter
            </button>
          </div>
        </div>

        <div class="row py-3 bg-secondary-subtle">
          <div class="col-md-6 text-center">
            <button
              class="btn btn-warning text-light w-100 h-100 fs-3"
              on:click={startGame}
            >
              Restart
            </button>
          </div>
          <div class="col-md-6 my-md-0 my-2 text-start">
            <button
              class="btn btn-danger w-100 h-100 fs-3 text-light"
              on:click={endGame}
            >
              End Game
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<svelte:window on:keydown={keyPress} />
