<script>
  import Header from "../../../components/Header.svelte";
  import CardInfo from "../../../components/funProjects/CardInfo.svelte";

  let sum;
  let CreditCard = "";
  function getRandomNumber(digit) {
    let number = "";
    for (let i = 0; i < digit; i++) {
      let randomNum = Math.floor(Math.random() * 9 + 1).toString();
      number += randomNum;
    }
    return number;
  }

  const generateCard = () => {
    CreditCard = getRandomNumber(16);
    while (!verifyCardAny(CreditCard)) {
      CreditCard = getRandomNumber(16);
    }
  };
  generateCard();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(CreditCard);
  };
  function verifyCardAny(card) {
    let valid;
    let start = 1;
    sum = 0;
    card = reverseString(card);
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
      valid = true;
    } else {
      valid = false;
    }
    return valid;
  }
  function reverseString(str) {
    str += "";
    let splitString = str.toString().split("");
    let reverseArray = splitString.reverse();
    let joinArray = reverseArray.join("");
    return joinArray;
  }
</script>

<Header
  directory="fun-projects"
  activePage="ccgenerator"
  title="Credit Card Generator"
/>

<main>
  <div class="container py-4">
    <div class="row align-items-md-stretch">
      <div class="col-md-6">
        <div class="h-100 p-5 text-bg-dark rounded-3">
          <h2>Generate a Credit Card</h2>
          <p>For demo purposes only.</p>
          <div class="h-50 d-flex align-items-center justify-content-center">
            <button class="btn btn-primary" on:click={generateCard}>
              Click to Generate
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-6 my-4 my-md-0">
        <div class="h-100 p-5 text-bg-secondary rounded-3" id="validCheck">
          <h2 class="text-center">Credit Card Number</h2>
          <h2 class="text-center">{CreditCard}</h2>
          <div class="h-50 d-flex align-items-center justify-content-center">
            <button class="btn btn-primary" on:click={copyToClipboard}>
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
    <CardInfo {CreditCard} sumOfDigits={sum} />
  </div>
</main>
