require('@privacybydesign/irma-css');

const IrmaCore   = require('@privacybydesign/irma-core');
const IrmaPopup  = require('@privacybydesign/irma-popup');
const IrmaClient = require('@privacybydesign/irma-client');

document.getElementById('vote').addEventListener('click', () => {
    var radios = document.getElementsByName('options');
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            const irma = new IrmaCore({
              debugging: true,
              language:  'en',
              translations: {
                header:  '<i class="irma-web-logo">IRMA</i>Cast your vote',
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
                          '@context': 'https://irma.app/ld/request/signature/v2',
                          'message': 'I choose to vote for ' + radios[i].value,
                          'disclose': [[[
                              { 'type': "irma-demo.stemmen.stempas.election", 'value': "Demo Election" },
                              { 'type': "irma-demo.stemmen.stempas.votingnumber", 'value': null }
                          ]]]
                      })
                  }
              }
            });

            irma.use(IrmaPopup);
            irma.use(IrmaClient);

            irma.start()
            .then(result => {
                console.log('Successful signature! A success page will come later');
                console.log(result);
            })
            .catch(error => {
              if (error === 'Aborted') {
                console.log('We closed it ourselves, so no problem 😅');
                return;
              }
              console.error("Couldn't do what you asked 😢", error);
            });
        }
    }
});

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
