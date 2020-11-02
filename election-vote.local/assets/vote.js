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
              [
                  { 'type': "irma-demo.stemmen.stempas.election", 'value': "Demo Election" },
                  { 'type': "irma-demo.stemmen.stempas.votingnumber", 'value': null }
              ]
            ]
          ]
        };
        doSession(request).then(function(result) {
                              console.log("Signature sent, navigating to success page");
                              window.location.replace('http://election-vote.local/assets/success.html');
                          })
                          .catch(function(err) {
                              window.location.replace('http://election-vote.local/assets/error.html');
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
      "token": "h01vJdKF56mT4SW3NbGD",
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
            "c": "4mACR4HgF4PvkLYfJSSTK1piG+F+IkBVPxudViWn1XE=",
            "A": "Yv4yVCNYMGgI/foYIrnIZozqfWzd4/MHKv9wBbso2ajXxr7PJM2pXaSXmTbeatPnb86jujMrUoBo3seNLJ8b0vXA5Qk2xh6GEE1SOFnzEVPM4yV882BIoD4npV02MzWYfIe6I/YIaxeUmRikp/SObXI2lY1UcPPG/1mudKLHap8=",
            "e_response": "Zoeo7MFLBEmsKOjTuRn1xBvuMVKcjN6bz4trwOkqupi6uJnjrfc7FTYOH25EmbU0jcuh8LdFkpcL",
            "v_response": "C6a+yD1GQAAeSNviX1wzhQQW1l3o1bTAqw3OxpbyIBzzbp/ivNX2xWsID66bwERPAn7aGNcFaC2OX2U1KKapPrdC2ZXmSnWOyOS1IQwfsO4hf1yRBy0sCZHdNtz+LSE87oYgIvqmWDaNzPsMcsMey7Sct0G78eUAL0VBIlTX7sOG+Nsp+ry4/XHkfGyQYEukRXWji6E83L07WfF70gsFFi/tAa/Sq5X0drvBf/P4Oca2AzTtXd9GaYnpeR+Xp77kqFpaTbsHWmJYEVyIhHJBg6P9WhNqP3ytNV4qsJRZva7VpCjleL+AkB00ZK3kIdoXK8W/mvZSwi9oEBJibmm1",
            "a_responses": {
              "0": "BOxm+tLH1Wl4XANOkSLieC1l49smUOCqOBm3AwPq/OEU0axluKCHBQdDWYTA1XZrYFLyHgG7md/zTsz0haz2Xl9ZrtZKRcjIlO4="
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
        "nonce": "fEB2jHmaMSqkI+o1lrK3RA==",
        "context": "AQ==",
        "message": "I choose to vote for Option 1",
        "timestamp": {
          "Time": 1600859876,
          "ServerUrl": "https://keyshare.privacybydesign.foundation/atumd/",
          "Sig": {
            "Alg": "ed25519",
            "Data": "OywV+m4FoXdVxthZtZ+TVuycBPfF1qYXg4bxsScuOqMHE4208WvOC596elhKREz9xvPCaRhk5h1d9TJ/D1POAw==",
            "PublicKey": "MKdXxJxEWPRIwNP7SuvP0J/M/NV51VZvqCyO+7eDwJ8="
          }
        }
      }
    }
    */
    console.log("Parsing result.");
    console.log(result);
}
