require('@privacybydesign/irma-css');

const IrmaCore   = require('@privacybydesign/irma-core');
const IrmaPopup  = require('@privacybydesign/irma-popup');
const IrmaClient = require('@privacybydesign/irma-client');

document.getElementById('attrHeader').addEventListener('click', toggleAttributeInput);
document.getElementById('attrPage').addEventListener('click', toggleAttributeInput);

function toggleAttributeInput() {
    var inputDiv = document.getElementById('inputDiv');
    if (inputDiv.style.display === 'none' || inputDiv.style.display === '') {
        inputDiv.style.display = 'block';
    } else {
        inputDiv.style.display = 'none';
    }
}

document.getElementById('register').addEventListener('click', () => {
    const irma = new IrmaCore({
      debugging: true,
      language:  'en',
      translations: {
        header:  '<i class="irma-web-logo">IRMA</i>Confirm your identity',
        loading: 'Just one second please!'
      },
      session: {
          url: 'http://localhost:8088',
          start: {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  '@context': 'https://irma.app/ld/request/disclosure/v2',
                  'disclose': [[[ 'pbdf.pbdf.email.email' ]]]
              })
          }
      }
    });

    irma.use(IrmaPopup);
    irma.use(IrmaClient);

    irma.start()
    .then(result => {
        var eligible = parseResult(result);
        if (!eligible) {
            console.error("These attributes are not eligible to vote");
            // Pop up to show ineligibility?
            return;
        } else {
            console.log("These attributes are eligible to vote!");
            // Send through to voting card retrieval
            window.location = '/views/retrieve.html';
        }
    })
    .catch(error => {
      if (error === 'Aborted') {
        console.log('We closed it ourselves, so no problem 😅');
        return;
      }
      console.error("Couldn't do what you asked 😢", error);
    });
});

function parseResult(result) {
    var expectedValue = document.getElementById('email').value;
    var rawValue = result.disclosed[0][0].rawvalue;
    return rawValue === expectedValue;
}

/* Raw result example
{
  "token": "ptzsaM8FfhDxe1hxEaFp",
  "status": "DONE",
  "type": "disclosing",
  "proofStatus": "VALID",
  "disclosed": [
    [
      {
        "rawvalue": "irma-demo@irma-demo.nl",
        "value": {
          "": "irma-demo@irma-demo.nl",
          "en": "irma-demo@irma-demo.nl",
          "nl": "irma-demo@irma-demo.nl"
        },
        "id": "irma-demo.sidn-pbdf.email.email",
        "status": "PRESENT",
        "issuancetime": 1598486400
      }
    ]
  ]
}
*/
