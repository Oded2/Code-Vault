<script>
  import Header from "../../components/Header.svelte";
  import Modal from "../../components/Modal.svelte";

  let questions,
    questionArr,
    question,
    answers,
    correctAnswer,
    userAnswer,
    image;
  let showScore = false;
  let inProgress = false;
  let language = "en";
  let current = 0;
  let maxQuestions = 30;
  let start = false;
  let checked = false;
  let score = 0;
  let correct = false;
  let questionsDone = {};

  $: isEnd = current + 1 == maxQuestions && questionsDone[maxQuestions - 1];
  $: percent = parseInt((score / maxQuestions) * 100);
  const languageResourceId = {
    en: "9a197011-adf9-45a2-81b9-d17dabdf990b",
    he: "bf7cb748-f220-474b-a4d5-2d59f93db28d",
    ar: "fe998a65-83a3-45e5-b4b7-3e0ce86ae072",
    fr: "a106ea08-ff97-4971-8720-c85bdd3d2264",
    ru: "ca264280-1669-45ce-a96f-a4c9ed71e812",
  };
  function toggleScore() {
    showScore = !showScore;
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
    checked = false;
    correct = false;
    questionArr = questions[current];
    question = questionArr["question"];
    answers = questionArr["answers"];
    correctAnswer = questionArr["correctAnswer"];
    image = questionArr["imageUrl"];
    userAnswer = null;
  }
  function simplifyString(str) {
    for (let i = 0; i < str.length; i++) {
      str = str.replace(/\s/g, "").toLowerCase();
    }
    return str;
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

  const handleCheck = () => {
    checked = true;
    let tempCorrect = simplifyString(correctAnswer);
    let tempUser = simplifyString(userAnswer);
    if (tempCorrect == tempUser) {
      score++;
      correct = true;
    }
    questionsDone[current] = {
      isCorrect: correct,
      correctAnswer: correctAnswer,
      user: userAnswer,
    };
  };
  const handleNext = () => {
    if (current + 1 > maxQuestions - 1) {
      current = 0;
    } else {
      current++;
    }
    updateQuestion();
  };
  const handleBack = () => {
    if (current - 1 < 0) {
      current = maxQuestions - 1;
    } else {
      current--;
    }
    updateQuestion();
  };
  const handleStart = async () => {
    inProgress = true;
    current = 0;
    questionsDone = {};
    await fetchQuestions(language, maxQuestions);
    inProgress = false;
    start = true;
  };

  const handleEnd = () => {
    start = false;
    toggleScore();
  };
  function randomNum(min, max) {
    const difference = max - min;
    let rand = Math.floor(Math.random() * difference) + min;
    return rand;
  }
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
    </div>
  </div>
</Modal>
<main class="text-bg-dark dark-background">
  <Header title="Israel Driving Test" />
  <div class="container">
    <div class="ms-0 ms-sm-2">
      <h1>The Israel Driver Test</h1>
      <div class="border-start ps-4">
        <p class="font-google-quicksand fw-500 fs-5">
          Master the Israeli driver test in any language. Practice exams and
          language-specific support. Drive confidently, and get started now!
          <span class="text-warning"
            >Please remember this isn't affiliated with the official licensing
            department.</span
          >
        </p>
      </div>
    </div>
    <div class="card bg-light mb-5">
      {#if start}
        <div
          class="card-body m-auto w-100 px-4"
          class:text-end={language == "he" || language == "ar"}
          lang={language}
        >
          <span>Question {current + 1} out of {maxQuestions}</span>
          <br />
          <h2>{question}</h2>

          {#if image}
            <div class="d-flex justify-content-center p-2">
              <img src={image} alt={question} class="img-fluid shadow" />
            </div>
          {/if}
          <div class="form-check">
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
        <div class="card-footer">
          <div class="row">
            <div class="col-4 col-sm-2">
              <button
                class="btn btn-secondary fs-4 w-100"
                disabled={!questionsDone[current - 1]}
                on:click={handleBack}><i class="fa-solid fa-backward" /></button
              >
            </div>
            <div class="col-4 col-sm-8">
              <button
                on:click={handleCheck}
                disabled={questionsDone[current] || !userAnswer}
                class="btn btn-primary fs-4 w-100"
                ><span class="d-none d-sm-block">Check</span><span
                  class="d-block d-sm-none"
                  ><i class="fa-solid fa-check" /></span
                ></button
              >
            </div>
            <div class="col-4 col-sm-2">
              <button
                class="btn btn-secondary fs-4 w-100"
                disabled={!questionsDone[current] || isEnd}
                on:click={handleNext}><i class="fa-solid fa-forward" /></button
              >
            </div>
          </div>
          <div class="row mt-2">
            {#if isEnd}
              <div class="col-12">
                <button class="btn btn-success w-100 fs-4" on:click={handleEnd}
                  ><i class="fa-solid fa-square-check" />&nbsp; Submit Test</button
                >
              </div>
            {:else}
              {#if language == "ar" || language == "he"}
                <div class="col" />
              {/if}
              <div class="col-auto">
                <button class="btn btn-outline-danger" on:click={handleEnd}
                  >End Test</button
                >
              </div>
            {/if}
          </div>
        </div>
      {:else}
        <form on:submit|preventDefault={handleStart}>
          <div class="card-body px-4">
            <h1 class="text-center font-google-quicksand">
              The Israeli Driver Test
            </h1>
            <div>
              <p class="font-google-quicksand fw-500 fs-4">
                Please note that the real test consists of 30 questions, so for
                the most realistic version of the test it is recommended to set
                the questions to 30. Do your best and remember, this is not the
                actual test! Try your best and remember each question you get
                wrong. <span class="text-success">Good luck!</span>
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
                >
                  <option value="he" lang="he">עִברִית</option>
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
  </div>
</main>

<style>
  .answer {
    transition: 0.3s;
    cursor: pointer;
  }
  .answer:hover {
    background-color: #d3d3d3 !important;
  }
  input[type="radio"] {
    cursor: pointer;
  }
</style>
