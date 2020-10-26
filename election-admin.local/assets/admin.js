// Raw JavaScript file to run the election-admin.local page.
// It is bundled into 'bundle.js' together with 'irma.js'
// To recreate/update bundle.js, run:
//    browserify admin.js > bundle.js
// If errors occur, perhaps 'npm install' will solve them.

const irma = require('./irma.js');

window.onload = function() {
    document.getElementById('create').addEventListener('click', createElection);
}

function createElection() {
    console.log("Creating an election isn't yet available.");
}

// Package user values into an IRMA request object, and perform a session
function doVerificationSession() {
  const attr = document.getElementById('attr').value;
  const label = document.getElementById('label').value;
  const labelRequest = !label ? {} : {'labels': {'0': {'en': label, 'nl': label}}};
  const request = {
    '@context': 'https://irma.app/ld/request/disclosure/v2',
    'disclose': [
      [
        [ attr ]
      ]
    ],
    ...labelRequest
  };
  doSession(request).then(function(result) {
                        console.log(result);
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
