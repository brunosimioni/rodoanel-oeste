var schedule = require('node-schedule');
var unirest = require('unirest');
var hangoutsChatRoom = "https://chat.googleapis.com/v1/spaces/AAAAGepSZ08/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=lE5A54ZWlDlcwvQD1YAg_gzWO81Z5Kl2uoN9mUXeA4g%3D";

var j = schedule.scheduleJob('* * * * *', function(){
  checkAlert();
});

function checkAlert() {
  console.log("checking alerts...");
  unirest.get('http://www.rodoaneloeste.com.br/generic/home/ListOccurrences?abc&_=1524247552871')
  .headers({'Accept': '*/*', 'Accept-Encoding': 'gzip, deflate'})
  .end(function (response) {
    console.log("analysing alerts...");
    checkProblems(response.body);
  });
}

function checkProblems(occurences) {
  var events = occurences.Occurences;
  for (var i in events) {
    var e = events[i];
    console.log("analysing event...");
    if (e.OccurrenceTypeCssClass != 'green')
    {
      console.log("posting problem...");
      console.log(e);
      unirest.post(hangoutsChatRoom)
      .headers({'Content-Type': 'application/json'})
      .send({ "text": e.Text})
      .end(function (response) {
        console.log(response);
      });
    }
  }
}
