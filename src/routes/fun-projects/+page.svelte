<script>
  import Header from "../../components/Header.svelte";
  import FunProjectsCard from "../../components/cards/FunProjectsCard.svelte";
  import hrefs from "../../data/hrefs.json";
  const homeRef = hrefs["fun-projects"];
</script>

<Header directory={homeRef} title={homeRef["home"]["title"]} />
<main>
  <section>
    <div class="container">
      <div class="row">
        <FunProjectsCard
          icon="lock"
          title={homeRef["encrypt"]["title"]}
          description="Secure enough for fun messages and with friends, but not for actual
        security. Will take a password that is used to encrypt and decrypt the
        message."
          href={homeRef["encrypt"]["link"]}
        />
        <FunProjectsCard
          icon="unlock"
          title={homeRef["decrypt"]["title"]}
          description="Will decrypt any text from the original encrypter above. Use the same password as the encrypted text and it will decrypt it."
          href={homeRef["decrypt"]["link"]}
        />
        <FunProjectsCard
          icon="credit-card"
          title={homeRef["ccvalidator"]["title"]}
          description="Will validate any credit card. The method used is called the Luhn algorithm, and it will show you how it works. Does not store any information, the entire process happens locally."
          href={homeRef["ccvalidator"]["link"]}
        />
        <FunProjectsCard
          large={true}
          iconType="regular"
          icon="credit-card"
          title={homeRef["ccgenerator"]["title"]}
          description="Will generate any valid credit card. Will show you how the algorithm is used. For demo purposes only."
          href={homeRef["ccgenerator"]["link"]}
        />
        <FunProjectsCard
          large={true}
          icon="image"
          title={homeRef["photodata"]["title"]}
          description="Will show you the metadata info of any photo"
          href={homeRef["photodata"]["link"]}
        />
      </div>
    </div>
  </section>
</main>
