<script>
  import Header from "../../components/Header.svelte";
  let questions, questionArr, question, answers, correctAnswer;
  let userAnswer;
  let language = "en";
  let count = 30;
  let start = false;
  const languageResourceId = {
    en: "9a197011-adf9-45a2-81b9-d17dabdf990b",
    he: "bf7cb748-f220-474b-a4d5-2d59f93db28d",
    ar: "fe998a65-83a3-45e5-b4b7-3e0ce86ae072",
    fr: "a106ea08-ff97-4971-8720-c85bdd3d2264",
    ru: "ca264280-1669-45ce-a96f-a4c9ed71e812",
  };
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
  async function fetchQuestions(lang = "en", count = 30) {
    const resourceId = languageResourceId[lang];
    const url = addParams("https://data.gov.il/api/3/action/datastore_search", {
      resource_id: resourceId,
      limit: count,
    });
    const data = await fetch(url).then((response) => response.json());
    questions = parseQuestions(data).sort((a, b) => 0.5 - Math.random());
    questionArr = questions[0];
    question = questionArr["question"];
    answers = questionArr["answers"];
    correctAnswer = questionArr["correctAnswer"];
    console.log(questions);
  }
  fetchQuestions(language, count);
  function addParams(link, params) {
    link = new URL(link);
    let value;
    for (let key in params) {
      value = params[key];
      link.searchParams.append(key, value);
    }
    return link.toString();
  }

  const handleSubmit = () => {
    if (correctAnswer == userAnswer) {
      return true;
    }
    return false;
  };
  const handleStart = () => {
    start = true;
  };
</script>

<main class="text-bg-dark dark-background">
  <Header title="Israel Driving Test" />
  <div class="container">
    <div class="m-5">
      <h1>The Israel Driver Test</h1>

      <div class="border-start ps-4">
        <p class="font-google-quicksand fw-500 fs-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos
          atque, fuga quia quae, omnis itaque eveniet, veritatis voluptate
          corporis minima distinctio maiores consequatur aliquam possimus nisi
          at quam quo corrupti!
        </p>
      </div>
    </div>
    <div class="card bg-light">
      {#if start}
        <div
          class="card-body m-auto"
          class:text-end={language == "he" || language == "ar"}
          lang={language}
        >
          <h1>{question}</h1>
          <div class="form-check">
            {#each answers as answer, index}
              <div class="fs-4">
                <input
                  type="radio"
                  class="form-check-input"
                  id={index}
                  value={answer}
                  bind:group={userAnswer}
                />
                <label for={index} class="form-check-label">{answer}</label>
              </div>
            {/each}
          </div>
        </div>
        <div class="card-footer">
          <div class="row">
            <div class="col-2">
              <button class="btn btn-secondary fs-4 w-100">Back</button>
            </div>
            <div class="col-8">
              <button
                on:click={handleSubmit}
                disabled={!userAnswer}
                class="btn btn-primary fs-4 w-100">Submit</button
              >
            </div>
            <div class="col-2">
              <button class="btn btn-secondary fs-4 w-100">Next</button>
            </div>
          </div>
        </div>
      {:else}
        <form on:submit|preventDefault={handleStart}>
          <div class="card-body">
            <h1 class="text-center font-google-quicksand">
              The Israeli Driver Test
            </h1>
            <div>
              <p class="font-google-quicksand fw-500 fs-4">
                This test consists of 30 questions. Do your best and remember,
                this is not the actual test! Try your best and remember each
                question you get wrong. <span class="text-success"
                  >Good luck!</span
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
                  bind:value={count}
                />
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary w-100 fs-4" disabled={!questions}
              ><i class="fa-solid fa-file-lines" />&nbsp; Begin Test</button
            >
          </div>
        </form>
      {/if}
    </div>
  </div>
</main>
