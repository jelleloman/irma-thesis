const irma = require('./irma.js');
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

window.onload = function() {
    document.getElementById('retrieve').addEventListener('click', issueVotingCard);
}

// function formatDate (date) {
//     return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + ", " + date.getHours() + ":" + date.getMinutes();
// }

function issueVotingCard() {
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
        }]
    };
    doSession(request).then(function(result) {
                        window.location.replace("http://election-register.local/views/success.html");
                    })
                    .catch(function(err) {
                        console.error(err);
                        window.location.replace("http://election-register.local/views/error.html");
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
