<script>
  import Header from "../../components/Header.svelte";
  import hrefs from "../../data/hrefs.json";
  const homeRef = hrefs["fun-projects"];
</script>

<Header directory="fun-projects" title="Fun Projects" activePage="home" />
<main class="bg-light text-dark vh-100">
  <section>
    <div class="container py-5">
      <div class="row">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg h-100 border-0">
            <div class="card-body">
              <div class="row display-flex align-items-center">
                <div class="col-1 pb-1">
                  <i class="fa-solid fa-lock fs-3" />
                </div>
                <div class="col-10">
                  <h3 class="font-google-quicksand fw-600 text-center">
                    Text Encrypter
                  </h3>
                </div>
              </div>

              <div class="container-fluid px-1">
                <p class="fs-5">
                  Secure enough for fun messages and with friends, but not for
                  actual security. Will take a password that is used to encrypt
                  and decrypt the message.
                </p>
              </div>
            </div>

            <div class="card-footer">
              <a href={homeRef["encrypt"]} class="btn btn-primary w-100"
                >Show Me</a
              >
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-4 mt-5 mt-md-0">
          <div class="card shadow-lg h-100 border-0">
            <div class="card-body">
              <div class="row display-flex align-items-center">
                <div class="col-1 pb-1">
                  <i class="fa-solid fa-unlock fs-3" />
                </div>
                <div class="col-10">
                  <h3 class="font-google-quicksand fw-600 text-center">
                    Text Decrypter
                  </h3>
                </div>
              </div>
              <div class="container-fluid px-1">
                <p class="fs-5">
                  Will decrypt any text from the original encrypter above. Use
                  the same password as the encrypted text and it will decrypt
                  it.
                </p>
              </div>
            </div>

            <div class="card-footer">
              <a href={homeRef["decrypt"]} class="btn btn-primary w-100"
                >Show Me</a
              >
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-4 mt-5 mt-lg-0">
          <div class="card shadow-lg h-100 border-0">
            <div class="card-body">
              <div class="row display-flex align-items-center">
                <div class="col-1 pb-1">
                  <i class="fa-solid fa-credit-card fs-3" />
                </div>
                <div class="col-10">
                  <h3 class="font-google-quicksand text-center fw-600">
                    Credit Card Validator
                  </h3>
                </div>
              </div>
              <div class="container-fluid px-1">
                <p class="fs-5">
                  Will validate any credit card. The method used is called the
                  Luhn algorithm, and it will show you how it works. Does not
                  store any information, the entire process happens locally.
                </p>
              </div>
            </div>

            <div class="card-footer">
              <a href={homeRef["ccvalidator"]} class="btn btn-primary w-100"
                >Show Me</a
              >
            </div>
          </div>
        </div>
        <div class="col-md-6 mt-5">
          <div class="card shadow-lg h-100 border-0">
            <div class="card-body">
              <div class="row display-flex align-items-center">
                <div class="col-1 pb-1">
                  <i class="fa-regular fa-credit-card fs-3" />
                </div>
                <div class="col-10">
                  <h3 class="font-google-quicksand fw-600 text-center">
                    Credit Card Generator
                  </h3>
                </div>
              </div>
              <div class="container-fluid px-1">
                <p class="fs-5">
                  Will generate any valid credit card. Will show you how the
                  algorithm is used. For demo purposes only.
                </p>
              </div>
            </div>

            <div class="card-footer">
              <a href={homeRef["ccgenerator"]} class="btn btn-primary w-100"
                >Show Me</a
              >
            </div>
          </div>
        </div>
        <div class="col-md-6 mt-5">
          <div class="card shadow-lg h-100 border-0">
            <div class="card-body">
              <div class="row display-flex align-items-center">
                <div class="col-1 pb-1">
                  <i class="fa-solid fa-image fs-3" />
                </div>
                <div class="col-10">
                  <h3 class="font-google-quicksand fw-600 text-center">
                    Metadata Viewer
                  </h3>
                </div>
              </div>
              <div class="container-fluid px-1">
                <p class="fs-5">Will show you the metadata info of any photo</p>
              </div>
            </div>

            <div class="card-footer">
              <a href={homeRef["photodata"]} class="btn btn-primary w-100"
                >Show Me</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
