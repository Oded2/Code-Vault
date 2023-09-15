<script>
  import Header from "../../components/Header.svelte";
  import Modal from "../../components/Modal.svelte";
  import DarkModeSwitch from "../../components/DarkModeSwitch.svelte";
  import Fullscreen from "../../components/Fullscreen.svelte";
  import Results from "../../components/Results.svelte";
  import { addParams, randomNum } from "../../hooks.client.js";
  import hrefs from "../../data/hrefs.json";
  let questions,
    questionArr,
    question,
    answers,
    correctAnswer,
    userAnswer,
    image,
    category;
  let showScore = false;
  let inProgress = false;
  let language = "en";
  let current = 0;
  let maxQuestions = 30;
  let start = false;
  let score = 0;
  let correct = false;
  let questionsDone = [];
  let darkMode = false;
  let questionDiv;
  let isFinished = false;
  let showResults = false;
  $: percent = parseInt((score / maxQuestions) * 100);
  $: manualDir = language == "he" || language == "ar" ? "rtl" : "ltr";
  const languageResourceId = {
    en: "9a197011-adf9-45a2-81b9-d17dabdf990b",
    he: "bf7cb748-f220-474b-a4d5-2d59f93db28d",
    ar: "fe998a65-83a3-45e5-b4b7-3e0ce86ae072",
    fr: "a106ea08-ff97-4971-8720-c85bdd3d2264",
    ru: "ca264280-1669-45ce-a96f-a4c9ed71e812",
  };

  function checkIfFinished() {
    for (let i = 0; i < maxQuestions; i++) {
      if (!questionsDone[i]) {
        isFinished = false;
        return;
      }
    }
    isFinished = true;
  }
  function toggleScore() {
    showScore = !showScore;
  }
  function toggleResults() {
    showResults = !showResults;
  }
  function parseQuestions(data) {
    return data.result.records.map((record) => {
      const htmlContent = record.description4;

      // Matches both the normal answers and the correct answer.
      // It then removes HTML tags and trims whitespace from each answer.
      const answersMatch = htmlContent.match(
        /<li><span>(.*?)<\/span><\/li>|<span id=\"correctAnswer\d+\">(.*?)<\/span>/g
      );
      const answers = answersMatch
        ? answersMatch.map((answer) =>
            answer.replace(/<\/?[^>]+(>|$)/g, "").trim()
          )
        : [];

      // Matches the correct answer and extracts it, or null if no match was found.
      const correctAnswerMatch = htmlContent.match(
        /<span id=\"correctAnswer\d+\">(.*?)<\/span>/
      );
      const correctAnswer = correctAnswerMatch ? correctAnswerMatch[1] : null;

      // Matches the image URL and extracts it, or null if no match was found.
      const imageUrlMatch = htmlContent.match(/<img src=\"(.*?)\"/);
      const imageUrl = imageUrlMatch ? imageUrlMatch[1] : null;

      // Extracts the question number from the title.
      const questionNumber = record.title2.split(".")[0];

      return {
        questionNumber: questionNumber,
        question: record.title2.split(". ")[1], // Excludes the part before the dot
        answers: answers,
        correctAnswer: correctAnswer,
        category: record.category,
        imageUrl: imageUrl, // Adds the image URL to the result object
      };
    });
  }
  async function fetchQuestions(lang = "en") {
    const resourceId = languageResourceId[lang];
    const url = addParams("https://data.gov.il/api/3/action/datastore_search", {
      resource_id: resourceId,
      limit: 5000,
    });
    const data = await fetch(url).then((response) => response.json());
    questions = shuffleArray(parseQuestions(data), maxQuestions);
    updateQuestion();
  }
  function shuffleArray(arr, maxLength) {
    const arrLength = arr.length;
    let numUsed = [];
    let newArray = [];

    for (let i = 0; i < maxLength; i++) {
      let random = randomNum(0, arrLength);
      while (numUsed.includes(random)) {
        random = randomNum(0, arrLength);
      }
      numUsed[numUsed.length] = random;
      newArray[newArray.length] = arr[random];
    }
    return newArray;
  }
  function updateQuestion() {
    correct = false;
    questionArr = questions[current];
    question = questionArr["question"];
    answers = questionArr["answers"];
    correctAnswer = questionArr["correctAnswer"];
    image = questionArr["imageUrl"];
    category = questionArr["category"];
    userAnswer = null;
  }
  function simplifyString(str) {
    for (let i = 0; i < str.length; i++) {
      str = str.replace(/\s/g, "").toLowerCase();
    }
    return str;
  }

  const handleCheck = () => {
    let tempCorrect = simplifyString(correctAnswer);
    let tempUser = simplifyString(userAnswer);
    if (tempCorrect == tempUser) {
      score++;
      correct = true;
    }
    questionsDone[current] = {
      isCorrect: correct,
      correct: correctAnswer,
      user: userAnswer,
      question: question,
      answers: answers,
    };
    checkIfFinished();
  };
  const handleNext = () => {
    current++;

    updateQuestion();
  };
  const handleBack = () => {
    current--;
    updateQuestion();
  };
  const handleStart = async () => {
    inProgress = true;
    current = 0;
    score = 0;
    isFinished = false;
    questionsDone = [];
    await fetchQuestions(language, maxQuestions);
    inProgress = false;

    start = true;
  };

  const handleSkip = (num) => {
    current = num;
    updateQuestion();
    questionDiv.scrollIntoView();
  };
  const handleEnd = () => {
    start = false;
    toggleScore();
  };
</script>

<Modal showModal={showScore} on:click={toggleScore}>
  <div class="font-google-quicksand p-5 text-center">
    {#if percent >= 86}
      <h1>
        <i class="fa-solid fa-circle-check" />&nbsp; Congratualions, you passed!
      </h1>
      <p class="fs-5 text-center fw-500">
        Great job, you are ready for the Israeli drivers test. Always remember
        to drive safely.
      </p>
    {:else}
      <h1>
        <i class="fa-solid fa-circle-xmark" />&nbsp; Better luck next time
      </h1>
      <p class="fs-5 text-center fw-500">At least it's not the real test!</p>
    {/if}
    <div class="my-5">
      <h2>You scored {percent}%</h2>
      <h4>You got {score} out of {maxQuestions} questions correct.</h4>
      <button
        class="btn btn-primary fs-3"
        on:click={() => {
          toggleResults();
          toggleScore();
        }}>Show Results</button
      >
    </div>
  </div>
</Modal>

<Fullscreen showFullScreen={showResults} on:click={toggleResults}>
  <Results {percent} questions={questionsDone} />
</Fullscreen>

<main
  class="text-bg-dark full-background"
  class:vh-100={showResults}
  class:overflow-hidden={showResults}
>
  <Header title={hrefs["israeli-driver-test"]["home"]["title"]} />
  <div class="container">
    <div class="ms-0 ms-sm-2">
      <h1>The Israeli Driver Test</h1>
      <div class="border-start ps-4">
        <p class="font-google-quicksand fw-500 fs-5">
          Master the Israeli driver test in any language. Practice exams and
          language-specific support. Drive confidently, and get started now!
          <span class="text-warning"
            >Please remember this isn't affiliated with the official licensing
            authority.</span
          >
        </p>
      </div>
    </div>
    <div
      class="card my-5"
      class:text-bg-light={!darkMode}
      class:text-bg-dark={darkMode}
      class:vh-90={start}
      bind:this={questionDiv}
    >
      <div class="card-header" class:border-light={darkMode}>
        <div class="row px-4">
          {#if start}
            <div class="col-sm text-center">
              <span>Question {current + 1} out of {maxQuestions}</span>
            </div>
            <div class="col-sm text-center py-2 py-sm-0">
              <span>{category}</span>
            </div>
          {:else}
            <div class="col-md" />
            <div class="col-md-auto text-center">
              <h1 class=" font-google-quicksand">The Israeli Driver Test</h1>
            </div>
          {/if}

          <div
            class="col-sm d-flex justify-content-center"
            class:align-items-center={!start}
          >
            <DarkModeSwitch bind:checked={darkMode} />
          </div>
        </div>
      </div>
      {#if start}
        <div class="card-body m-auto w-100 px-4 overflow-auto">
          <h2 dir="auto" lang={language}>{question}</h2>
          {#if image}
            <div class="d-flex justify-content-center p-2">
              <img src={image} alt={question} class="img-fluid shadow" />
            </div>
          {/if}
          <div
            class="form-check"
            class:form-check-reverse={manualDir == "rtl"}
            class:mt-sm-5={!image}
            dir={manualDir}
            lang={language}
          >
            {#each answers as answer}
              <div class="fs-4 my-2">
                <input
                  type="radio"
                  class="form-check-input"
                  id={answer}
                  value={answer}
                  bind:group={userAnswer}
                />
                <label
                  for={answer}
                  class="form-check-label answer rounded pb-3 px-3"
                  class:bg-success-subtle={simplifyString(correctAnswer) ==
                    simplifyString(answer) && questionsDone[current]}
                  class:bg-danger-subtle={questionsDone[current] &&
                    questionsDone[current]["user"] == answer &&
                    questionsDone[current]["user"] !=
                      questionsDone[current]["correctAnswer"] &&
                    !questionsDone[current]["isCorrect"]}
                >
                  {answer}
                </label>
              </div>
            {/each}
          </div>
        </div>
        <div class="card-footer" dir={manualDir}>
          <div class="row">
            <div class="col-4">
              <button
                class="btn btn-secondary fs-4 w-100"
                disabled={!questions[current - 1]}
                on:click={handleBack}
              >
                {#if manualDir != "rtl"}
                  <i class="fa-solid fa-backward" />
                {:else}
                  <i class="fa-solid fa-forward" />
                {/if}
              </button>
            </div>
            <div class="col-4">
              {#if !questionsDone[current]}
                <button
                  on:click={handleCheck}
                  disabled={questionsDone[current] || !userAnswer}
                  class="btn btn-primary fs-4 w-100"
                  ><span class="d-none d-md-block">Check</span><span
                    class="d-block d-md-none"
                    ><i class="fa-solid fa-check" /></span
                  >
                </button>
              {:else if questionsDone[current] && !isFinished}
                <button
                  class="btn btn-primary fs-4 w-100"
                  on:click={handleNext}
                  disabled={!questions[current + 1]}>Next</button
                >
              {:else}
                <button class="btn btn-success fs-4 w-100" on:click={handleEnd}
                  ><span class="d-none d-lg-block">Submit Test</span><span
                    class="d-block d-lg-none"
                    ><i class="fa-solid fa-square-check" /></span
                  ></button
                >
              {/if}
            </div>
            <div class="col-4">
              <button
                on:click={handleNext}
                disabled={!questions[current + 1]}
                class="btn btn-secondary fs-4 w-100"
                >{#if manualDir != "rtl"}
                  <i class="fa-solid fa-forward" />
                {:else}
                  <i class="fa-solid fa-backward" />
                {/if}
              </button>
            </div>
          </div>
        </div>
      {:else}
        <form on:submit|preventDefault={handleStart}>
          <div class="card-body px-4">
            <div>
              <p class="font-google-quicksand fw-500 fs-4">
                Please take into consideration that the genuine test contains 30
                questions. To optimize your practice experience, it's advisable
                to configure the questions to a total of 30. Give it your utmost
                effort, and always bear in mind, this is a practice test, not
                the real deal! Strive to perform at your best and make note of
                any questions you happen to answer incorrectly. <span
                  class="text-success">Good Luck!</span
                >
              </p>
            </div>

            <div class=" py-2 row">
              <div class="col-auto">
                <h2>
                  <i class="fa-solid fa-language" />&nbsp; Language
                </h2>
              </div>
              <div class="col">
                <select
                  required
                  bind:value={language}
                  class="form-select form-select-lg"
                  class:text-bg-dark={darkMode}
                >
                  <option value="he" lang="he">עברית</option>
                  <option value="en" selected>English</option>
                  <option value="ar" lang="ar">عربي</option>
                  <option value="fr" lang="fr">Français</option>
                  <option value="ru" lang="ru">русский</option>
                </select>
              </div>
            </div>
            <div class=" py-2 row">
              <div class="col-auto">
                <h2>
                  <i class="fa-solid fa-arrow-up-9-1" />&nbsp; Questions
                </h2>
              </div>
              <div class="col">
                <input
                  required
                  type="number"
                  class="form-control fs-5"
                  class:text-bg-dark={darkMode}
                  min="1"
                  max="100"
                  bind:value={maxQuestions}
                />
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary w-100 fs-4" disabled={inProgress}
              ><i class="fa-solid fa-file-lines" />&nbsp; Begin Test</button
            >
          </div>
        </form>
      {/if}
    </div>
    {#if start}
      <div
        class="card mb-5"
        class:text-bg-light={!darkMode}
        class:text-bg-dark={darkMode}
      >
        <div class="card-body pt-4 pb-5 px-0 px-sm-5">
          <div class="mb-4">
            <h1 class="font-google-quicksand">Questions</h1>
            <span class="fw-light"
              >Click on any number to jump to the respective question.</span
            >
          </div>
          <ol class="list-group list-group-numbered fs-5">
            {#each questions as currentQuestion, index}
              <button
                dir="auto"
                lang={language}
                class="list-group-item list-group-item-action transition"
                class:list-group-item-secondary={!questionsDone[index] &&
                  darkMode}
                class:list-group-item-warning={current == index &&
                  !questionsDone[index]}
                class:list-group-item-danger={questionsDone[index] &&
                  !questionsDone[index]["isCorrect"]}
                class:list-group-item-success={questionsDone[index] &&
                  questionsDone[index]["isCorrect"]}
                on:click={() => handleSkip(index)}
              >
                {currentQuestion["question"]}
              </button>
            {/each}
          </ol>
        </div>
        <div class="card-footer py-4">
          <button class="btn btn-danger w-100 fs-4" on:click={handleEnd}
            >End Test</button
          >
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  .answer {
    transition: 0.3s;
    cursor: pointer;
  }
  .answer:hover {
    background-color: #d3d3d3 !important;
    color: #000000;
  }
  input[type="radio"] {
    cursor: pointer;
  }
  .card {
    transition: 0.2s;
  }
  .bg-success-subtle,
  .bg-danger-subtle {
    color: #000000;
  }
  .transition {
    transition: 0.3s;
  }
</style>
