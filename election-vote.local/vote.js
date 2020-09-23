// Raw JavaScript file to handle IRMA sessions.
// It is bundled into 'bundle.js' together with 'irma.js'
// To recreate/update bundle.js, run:
//    browserify register.js > bundle.js
// If errors occur, perhaps 'npm install' will solve them.

const irma = require('./irma.js');

window.onload = function() {
    document.getElementById('vote').addEventListener('click', registerVote);
    document.getElementById('vote').disabled = true;
}

// Package user values into an IRMA request object, and perform a session
function registerVote() {
  var radios = document.getElementsByName('options');
  for (var i = 0, length = radios.length; i < length; i++) {
  if (radios[i].checked) {
    const request = {
      '@context': 'https://irma.app/ld/request/signature/v2',
      'message': 'I choose to vote for ' + radios[i].value,
      'disclose': [
        [
          [ {'type': 'irma-demo.IRMATube.member.type', 'value': 'vote'},
            {'type': 'irma-demo.IRMATube.member.id', 'value': null}
          ]
        ]
      ]
    };
    doSession(request).then(function(result) {
                          parseResult(result);
                      })
                      .catch(function(err) {
                          console.error(err);
                      });

    break;
    }
  }
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
      "token": "HkbPBlDALeNymUZj1VKg",
      "status": "DONE",
      "type": "signing",
      "proofStatus": "VALID",
      "disclosed": [
        [
          {
            "rawvalue": "vote",
            "value": {
              "": "vote",
              "en": "vote",
              "nl": "vote"
            },
            "id": "irma-demo.IRMATube.member.type",
            "status": "PRESENT",
            "issuancetime": 1600300800
          },
          {
            "rawvalue": "517633040",
            "value": {
              "": "517633040",
              "en": "517633040",
              "nl": "517633040"
            },
            "id": "irma-demo.IRMATube.member.id",
            "status": "PRESENT",
            "issuancetime": 1600300800
          }
        ]
      ],
      "signature": {
        "@context": "https://irma.app/ld/signature/v2",
        "signature": [
          {
            "c": "uCCqLcuJFn2Yg5pi55CVyhjYl/u4yLcqP6cipqbKbmI=",
            "A": "ZllhrnokVTWH61Sce0NXn0nyU42S2oJHHtJdbWlbamde0qLiv7kTEjmVFNjYieAdQswGZRoi+L2BegENk4y9GAZkX6eVtcnvsjh0dkJeq0QRcrghp6sVvouYlSpJYtiJM/sMsqifIOgklg+LWm14fJKGHQJ7hfobGcqt6hR8wGE=",
            "e_response": "iISjwdy+MK+rT3J2BjdJ0HsEHT58SFUIRh83qj3tzfpXfpBp0cZ2YwTN6ScisjqBALq4nIQ1Sfxg",
            "v_response": "ASD+0wqsKdek2fkyb/OS1GTaCkd1U1kDFnlaIQhQeKitPfaq4a4CAWtK2dhrQ2WvLfxzDx9YwJTBdZSfVjwHEa2nV0GktABeBVW9ISPKgNXSCozny81weZzwgsGDxa8vliKYxsi6Nu0RsPDZiQGqhCemKtq1FWoFXGoW6GJ+SbkOkQA89fooBDtbqQgh4CVPofzXqR3rhkN9hZx581fGAJrwCy6lfw0D2yf8tQh8T/I7Yn2Di/IIBtqBdNWIHsMXZFbg/rirHGrGUZ+pxiOc54yfkYYgHz+X23mOWM4Bn+SjDNm3cEdnmKrGPAgQoq3AyTNJyfXl++YKCISvx4zY",
            "a_responses": {
              "0": "2CZte2pzfC6IgHs8aqitUCP45aky6BKM2oqLounQstNLSFBQvSfy8nAoBJLfE+cFQR8TxxvZjpppZNPIXaWFgkJyRw2D7pHePWQ="
            },
            "a_disclosed": {
              "1": "AwAKVgAaAAHoerasdGHy0VAlhe6aBc8l",
              "2": "7N7oyw==",
              "3": "amJubGZmYGhh"
            }
          }
        ],
        "indices": [
          [
            {
              "cred": 0,
              "attr": 2
            },
            {
              "cred": 0,
              "attr": 3
            }
          ]
        ],
        "nonce": "7Ih1/jNcYA5z+KTKJxVMTA==",
        "context": "AQ==",
        "message": "I choose to vote for option1",
        "timestamp": {
          "Time": 1600848776,
          "ServerUrl": "https://keyshare.privacybydesign.foundation/atumd/",
          "Sig": {
            "Alg": "ed25519",
            "Data": "+EN6G7zW5z1w3Q6FzZEvCiIM1Dxw0dfPIp1EwjKlkRJTYyfM0heBbYFfFmzhVYWqOefJ5oRCNlRKeJyUhgsIAQ==",
            "PublicKey": "MKdXxJxEWPRIwNP7SuvP0J/M/NV51VZvqCyO+7eDwJ8="
          }
        }
      }
    }
    */
    console.log("Parsing result.");
    console.log(result);
}
