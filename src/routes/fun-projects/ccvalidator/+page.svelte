<script>
  import Header from "../../../components/Header.svelte";
  import CardInfo from "../../../components/funProjects/CardInfo.svelte";
  let cardNum;
  let sum;
  $: isValid = verifyCard(cardNum);
  $: if (!cardNum) {
    cardNum = "";
  }
  function reverseString(str) {
    str += "";
    let splitString = str.toString().split("");
    let reverseArray = splitString.reverse();
    let joinArray = reverseArray.join("");
    return joinArray;
  }
  const verifyCard = (card) => {
    card = reverseString(card);
    let start = 1;
    sum = 0;
    for (let i in card) {
      i = parseInt(i);
      let place = parseInt(card[i]);
      if (start % 2 == 0) {
        place = place * 2;
        if (place > 9) {
          place -= 9;
        }

        sum += place;
      } else {
        sum += place;
      }
      start++;
    }

    if (sum % 10 == 0 && card != "" && /[a-zA-Z]/.test(card) == false) {
      return true;
    } else {
      return false;
    }
  };
  async function paste() {
    try {
      const clip = await navigator.clipboard.readText();
      if (isNaN(clip)) {
        return null;
      }
      return clip;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
  const pasteToCreditCard = async () => {
    cardNum = await paste();
  };
</script>

<Header
  directory="fun-projects"
  activePage="ccvalidator"
  title="Credit Card Validator"
/>

<main>
  <div class="container py-4">
    <div class="row align-items-md-stretch">
      <div class="col-md-6">
        <div class="h-100 p-5 text-bg-dark rounded-3">
          <h2>Enter your credit card number</h2>
          <p>Your credit card is secure.</p>
          <input
            bind:value={cardNum}
            type="number"
            min="0"
            maxlength="20"
            class="form-control"
          />
          <div class="h-50 d-flex align-items-center justify-content-center">
            <button class="btn btn-primary mt-n1" on:click={pasteToCreditCard}>
              Paste from Clipboard
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-6 my-4 my-md-0">
        <div
          class="h-100 p-5 rounded-3"
          class:text-bg-danger={!isValid}
          class:text-bg-success={isValid}
        >
          <h2 class="text-center">Credit Card Is...</h2>
          <h1 class="text-center">
            {#if isValid}Valid{:else}Invalid{/if}
          </h1>
          <div class="h-50 d-flex align-items-center justify-content-center" />
        </div>
      </div>
    </div>
    <CardInfo CreditCard={cardNum} sumOfDigits={sum} />
  </div>
</main>
