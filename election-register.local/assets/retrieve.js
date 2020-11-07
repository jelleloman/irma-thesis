require('@privacybydesign/irma-css');

const IrmaCore   = require('@privacybydesign/irma-core');
const IrmaWeb    = require('@privacybydesign/irma-web');
const IrmaClient = require('@privacybydesign/irma-client');

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate (date) {
    date = new Date(date);
    var month = months[date.getMonth()];
    var day = date.getDate();
    var year = date.getFullYear();
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

    return month + " " + day + ", " + year + ", " + hours + ":" + minutes;
}

var date = new Date();
var startDate = formatDate(date);
var endDate = formatDate(date.setDate(date.getDate() + 1));

const irma = new IrmaCore({
  debugging: true,
  element:   '#irma-web-form',
  language:  'en',
  translations: {
    header:  '<i class="irma-web-logo">IRMA</i>Retrieve your voting card',
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
          })
      }
  }
});

irma.use(IrmaWeb);
irma.use(IrmaClient);

irma.start()
.then(result => {
    console.log("Successful! 🎉", result);
    window.location = './success.html';
})
.catch(error => {
  if (error === 'Aborted') {
    console.log('We closed it ourselves, so no problem 😅');
    return;
  }
  console.error("Couldn't do what you asked 😢", error);
});
