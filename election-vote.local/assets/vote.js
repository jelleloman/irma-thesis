require('@privacybydesign/irma-css');

const IrmaCore   = require('@privacybydesign/irma-core');
const IrmaPopup  = require('@privacybydesign/irma-popup');
const IrmaClient = require('@privacybydesign/irma-client');

// Get the modal
var modal = document.getElementById("modal");
var radios = document.getElementsByName('options');
// var vote = document.getElementById("vote");
// var cancel = document.getElementById("cancel");
var choice = "";

// When the user clicks the button, open the modal
document.getElementById('vote').addEventListener('click', () => {
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            choice = radios[i].value;
        }
    }
    var voteChoice = document.getElementById('voteChoice');
    voteChoice.innerText = choice;
    modal.style.display = "block";
})

document.getElementById('cancel').addEventListener('click', () => {
    modal.style.display = "none";
})

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.getElementById('confirm').addEventListener('click', () => {
    var radios = document.getElementsByName('options');
    // for (var i = 0, length = radios.length; i < length; i++) {
    //     if (radios[i].checked) {
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
                  'message': 'I choose to vote for ' + choice,
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
        console.log('Successful signature!');
        console.log(result);
        window.location = './views/success.html';
    })
    .catch(error => {
      if (error === 'Aborted') {
        console.log('We closed it ourselves, so no problem 😅');
        modal.style.display = "none";
        return;
      }
      console.error("Couldn't do what you asked 😢", error);
    });
    //     }
    // }
});

/* Raw result example
{
  "token": "uy6ckiu71DqkUPaGPvWG",
  "status": "DONE",
  "type": "signing",
  "proofStatus": "VALID",
  "disclosed": [
    [
      {
        "rawvalue": "Demo Election",
        "value": {
          "": "Demo Election",
          "en": "Demo Election",
          "nl": "Demo Election"
        },
        "id": "irma-demo.stemmen.stempas.election",
        "status": "PRESENT",
        "issuancetime": 1604534400
      },
      {
        "rawvalue": null,
        "value": null,
        "id": "irma-demo.stemmen.stempas.votingnumber",
        "status": "NULL",
        "issuancetime": 1604534400
      }
    ]
  ],
  "signature": {
    "@context": "https://irma.app/ld/signature/v2",
    "signature": [
      {
        "c": "Rfq7ndri+yUpb/B+KpldbpySmV5218sle7NPVT5Io4w=",
        "A": "ZyuJTZt7+vfqO5iRit5eaqkMXgNkU2Z4HZVbuQ9oG32jETmenXA7TvS5+xvFEhMcdRqzJkN8HzA4CiolJKwAWBvMHZzEH4sbtogiSGmxHUjz+PobrXZ9eDHCu80BEHeunmXgQCVUWNzj+/5tqooTIo/rHV/whposMddWFXLz/CY=",
        "e_response": "FCFeOuhnEw3BQNJjdC22qvTb93WShpKdZN9wbo2JMxLyHufZ0g/cRqB4BI75/F4iIuSN85bIIw/8",
        "v_response": "BbMVjabBzpr4DtvONItlYXr7x0YP8uX8NoQg5YKQOams0Ixzf41ARdq3MGYdaq6zvcU2BMdI3+9qv4eJIsLNLUflpg0mw8bCdxFCcbncapqYSGb7iZh9WTu+B+pgztaBh2ktM1lCT5CjbPT5AyGcC9aHMIzX7eqtjmgPS0yratJBj6qNoa505yXea79aBhhrplmTed3xIgnVilmDgGz6FdTYZPcrbhAkK5dqxKJ4kVkiJRIjBtO0GjHRd+enE4dPCXY2pIN+V3D7PGDs+ZBKc+pWvjwrAZmcdd0kHVjFcJoZTOB3WZ032OzWBbDoqKS3/WeQ9HF6+y1DWSv+KnT7",
        "a_responses": {
          "0": "NPoG2pi7u4WWG/VrIBUuA99RAIKut4rfYzXacsKCmYQkmaQyS+gxHnTL98OvUkkwhh6ffG5rMKQ+b8j9bFYkVmxdMLrxR1zo2cA=",
          "4": "xDjJPiKk1jrhkr0tZxwF2iY7xHXs2dTdGgxnO9ZAvc/jxL03JDReHz0mfqARPqqMKcHiLD2Nc/WqPhF9pe/VurvuYptb+FBjp0M=",
          "5": "3N/ldCWCKJij28MJIjZPAE2mQ44cFkCHAlFACPeSKJx7ZS+Af3+k1WClhjIVjfJmJi8L21KLDt+VhJCQotiSZUBPCU9TNrJ5dGA=",
          "6": "Y40Tirv1YHUKZx6TPvj9NdJ3+u1b0JRrKlE8PMzTOcur/R+BDvp0ltTDYBmE9yYpQN22xN7FTnk4aOFKDcC6DUIXjt9l8ujideE="
        },
        "a_disclosed": {
          "1": "AwAKXQAaAADS0fKeBGn0500XKCoNBNol",
          "2": "iMra3kCK2MrG6NLe3Q==",
          "3": "PQ2tkZeIL45uE37vdpPoAthp081M68Wt48VWAk34vKQ="
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
    "nonce": "Na7jv7T8iURdkhdhiBWU6w==",
    "context": "AQ==",
    "message": "I choose to vote for Option 1",
    "timestamp": {
      "Time": 1604766602,
      "ServerUrl": "https://keyshare.privacybydesign.foundation/atumd/",
      "Sig": {
        "Alg": "ed25519",
        "Data": "4bkG+YG+nVO59hVklUAm9AxcoB9px1kSx08Echez/cRv0XktnTnhYhsCq3TjM49Wp5ooqNCa34CK64pH7oiLAw==",
        "PublicKey": "MKdXxJxEWPRIwNP7SuvP0J/M/NV51VZvqCyO+7eDwJ8="
      }
    }
  }
}
*/
