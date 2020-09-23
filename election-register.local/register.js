// Raw JavaScript file to handle IRMA sessions.
// It is bundled into 'bundle.js' together with 'irma.js'
// To recreate/update bundle.js, run:
//    browserify register.js > bundle.js
// If errors occur, perhaps 'npm install' will solve them.

const irma = require('./irma.js');

window.onload = function() {
    document.getElementById('verify').addEventListener('click', doVerificationSession);
}

// Package user values into an IRMA request object, and perform a session
function doVerificationSession() {
  const attr = document.getElementById('attr').value;
  const email = document.getElementById('email').value;
  // const label = document.getElementById('label').value;
  // const labelRequest = !label ? {} : {'labels': {'0': {'en': label, 'nl': label}}};
  const id = Math.floor(Math.random() * 1000000000) + 1;
  const request = {
    '@context': 'https://irma.app/ld/request/issuance/v2',
    'credentials': [{
        'credential': 'irma-demo.IRMATube.member',
        'attributes': {
            'type': 'vote',
            'id': id.toString()
        }
    }],
    'disclose': [
      [
        [ {'type': 'irma-demo.sidn-pbdf.email.email', 'value': email} ]
      ]
    ]
  };
  doSession(request).then(function(result) {
                        parseResult(result);
                    })
                    .catch(function(err) {
                        console.error(err);
                    });
}

// Perform a stock, !unsafe! IRMA session with 'request'
function doSession(request) {
  console.log("Starting IRMA session.");

  const server = 'http://localhost:8088';
  const authmethod = 'none';
  const key = '';
  const requestorname = '';

  return irma.startSession(server, request, authmethod, key, requestorname)
         .then(function(pkg) {
             let options = {
                 server: server,
                 token: pkg.token,
                 method: 'popup',
                 language: 'en'
             };
             return irma.handleSession(pkg.sessionPtr, options);
         })
         .then(function(result) {
             console.log("Done with irma session, returning result.");
             return result;
         })
         .catch(function(err) {
             throw "Error performing session";
             console.error(err);
         });
}

function parseResult(result) {
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
    console.log("Parsing retrieved result: ", result);
    console.log("Raw email value: ", result.disclosed[0][0].rawvalue);
}
