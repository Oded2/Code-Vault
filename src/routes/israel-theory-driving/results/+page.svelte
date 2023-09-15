<script>
  import { page } from "$app/stores";
  const url = $page.url;
  const pageHref = url["href"];
  const questions = JSON.parse(url.searchParams.get("questions"));
  const percent = url.searchParams.get("percent");
</script>

<main>
  <div class="container-fluid pt-3 pb-5 px-xl-5">
    <div>
      <h1 class="font-google-quicksand fw-bold text-center display-3">
        Theory Result: <span
          class:text-danger={percent < 86}
          class:text-success={percent >= 86}
          >{percent >= 86 ? "Pass" : "Fail"}</span
        >
      </h1>
      <h4 class="font-google-quicksand fw-bld text-center">{percent}%</h4>
    </div>
    <div class="font-google-quicksand fw-600 fs-4 px-5 rounded">
      <div class="row border-bottom py-3 my-4 fw-bold d-none d-xl-flex fs-3">
        <div class="col">Question</div>
        <div class="col">User's Answer</div>
        <div class="col">Correct Answer</div>
        <div class="col-5">Answers</div>
      </div>
      {#each questions as question, index}
        <div class="row border-bottom border-dark my-5">
          <div class="d-flex d-xl-none fw-bold my-2 border-bottom">
            Question ({index + 1})
          </div>
          <div class="col-xl border-xl-start border-xl-end">
            {question["question"]}
          </div>
          <div class="d-flex d-xl-none fw-bold my-2 border-bottom">
            User's Answer
          </div>
          <div
            class="col-xl border-xl-start border-xl-end"
            class:bg-danger-subtle={!question["isCorrect"]}
            class:bg-success-subtle={question["isCorrect"]}
          >
            {question["user"]}
          </div>
          <div class="d-flex d-xl-none fw-bold my-2 border-bottom">
            Correct Answer
          </div>
          <div class="col-xl border-xl-start border-xl-end">
            {question["correct"]}
          </div>
          <div class="d-flex d-xl-none fw-bold my-2 border-bottom">Answers</div>
          <div class="col-xl-5 border-xl-start border-xl-end fs-5 py-2">
            {#each question["answers"] as answer}
              <ul>
                <li>{answer}</li>
              </ul>
            {/each}
          </div>
        </div>
        <!-- <div class="border-dark border-bottom" /> -->
      {/each}
    </div>
  </div>
</main>

<style>
</style>
