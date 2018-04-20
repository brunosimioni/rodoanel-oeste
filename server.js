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
    checkProblems(response.body);
  });
}

function checkProblems(occurences) {
  var events = occurences.Occurences;
  console.log(events.length + " events happening...");
  for (var i in events) {
    var e = events[i];
    console.log("analysing event " + i + " class: " + e.OccurrenceTypeCssClass);
    if (e.OccurrenceTypeCssClass != 'green' && e.OccurrenceTypeCssClass != 'yellow')
    {
      if (new Date().getDay() == 0 || new Date().getDay() == 6)
        return;
      console.log("posting problem...");
      unirest.post(hangoutsChatRoom)
        .headers({'Content-Type': 'application/json'})
        .send({ "text": e.Text})
        .end(function (response) {
          console.log("problem posted.");
      });
    }
  }
}
