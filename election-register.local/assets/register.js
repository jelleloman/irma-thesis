// Raw JavaScript file to handle IRMA sessions.
// It is bundled into 'bundle.js' together with 'irma.js'
// To recreate/update bundle.js, run:
//    browserify register.js > bundle.js
// If errors occur, perhaps 'npm install' will solve them.

const irma = require('./irma.js');
const voters = ["j.loman@student.ru.nl"];

window.onload = function() {
    document.getElementById('register').addEventListener('click', doVerificationSession);
}

// Package user values into an IRMA request object, and perform a session
function doVerificationSession() {
  const request = {
    '@context': 'https://irma.app/ld/request/disclosure/v2',
    'disclose': [
      [
        [ 'pbdf.pbdf.email.email' ]
      ]
    ]
  };
  doSession(request).then(function(result) {
                        var eligible = parseResult(result);
                        if (!eligible) {
                            var modal = document.getElementById("myModal");
                            modal.style.display = "block";
                        } else {
                            console.log("Voter is eligible!");
                            window.location.replace("http://election-register.local/views/retrieve.html")
                        }
                    })
                    .catch(function(err) {
                        if (err !== "CANCELLED") {
                            console.log("Not a cancellation");
                            console.error(err);
                        } else {
                            console.log("Just a cancellation...");
                        }
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
             console.error("Issue with irma session, returning error.");
             throw err;
         });
}

function parseResult(result) {
    var rawValue = result.disclosed[0][0].rawvalue;
    return voters.includes(rawValue);
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
