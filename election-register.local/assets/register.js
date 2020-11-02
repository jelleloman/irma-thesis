// Raw JavaScript file to handle IRMA sessions.
// It is bundled into 'bundle.js' together with 'irma.js'
// To recreate/update bundle.js, run:
//    browserify register.js > bundle.js
// If errors occur, perhaps 'npm install' will solve them.

const irma = require('./irma.js');
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

window.onload = function() {
    document.getElementById('register').addEventListener('click', doVerificationSession);
}

// Package user values into an IRMA request object, and perform a session
function doVerificationSession() {
  const email = document.getElementById('email').value;

  var date = new Date();
  var startDate = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + ", " + date.getHours() + ":" + date.getMinutes();
  date.setDate(date.getDate() + 1);
  var endDate = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + ", " + date.getHours() + ":" + date.getMinutes();

  const request = {
    '@context': 'https://irma.app/ld/request/issuance/v2',
    'credentials': [{
        'credential': 'irma-demo.stemmen.stempas',
        'attributes': {
            'election': 'Demo Election',
            'voteURL': 'http://election-vote.local',
            'start': startDate,
            'end': endDate
        }
    }],
    'disclose': [
      [
        [ {'type': 'pbdf.pbdf.email.email', 'value': email} ]
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
