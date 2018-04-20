var schedule = require('node-schedule');
var unirest = require('unirest');
var hangoutsChatRoom = process.env.HANGOUTS_CHAT_ROOM;
var rodoanelUrl = process.env.RODOANEL_URL;
var runningFrequency = process.env.RUNNING_FREQ;

console.log("Hangouts Chat Room: " + hangoutsChatRoom);
console.log("Rodoanel Url: " + rodoanelUrl);
console.log("Running Freq: " + runningFrequency);

var j = schedule.scheduleJob(runningFrequency, function(){
  checkAlert();
});

function checkAlert() {
  console.log("checking alerts...");
  unirest.get(rodoanelUrl)
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
    console.log("analysing event " + i + " class: " + e.OccurrenceTypeCssClass + " Texto: " + e.Text);
    if (e.OccurrenceTypeCssClass != 'green' && e.OccurrenceTypeCssClass != 'yellow')
    {
      if (new Date().getDay() == 0 || new Date().getDay() == 6)
        return;

      console.log("posting problem: " + e.Text);
      unirest.post(hangoutsChatRoom)
        .headers({'Content-Type': 'application/json'})
        .send({ "text": e.Text})
        .end(function (response) {
          console.log("problem posted.");
      });
    }
  }
}



var port = process.env.PORT || 8080;
var express = require('express');
var app = express();
app.listen(port);
