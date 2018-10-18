// inputs
// id ="trainName"
// id="destination"
// id="firstTrainTime"-
// id="minuteFrequency"
//     id="nextArrival" (calulated)
//     id="minutesAway" (calulated)

//Flow
//connections to firebase
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDLOwy6TRyJbvrtGxSlR-I5uAj9qvcnb0c",
  authDomain: "nuboot-0440ac.firebaseapp.com",
  databaseURL: "https://nuboot-0440ac.firebaseio.com",
  projectId: "nuboot-0440ac",
  storageBucket: "nuboot-0440ac.appspot.com",
  messagingSenderId: "646943071848"
};
firebase.initializeApp(config);
//////////////////////////////////////////
var database = firebase.database();

function getTrainArrival(minuteFrequency, firstTimeConverted) {
  var today = moment();
  var frequency = 0;
  var firstTrainTime = 0;

  var diffTime =today.diff(moment(firstTimeConverted), "minutes");
  console.log("diffTime" + diffTime.format());

  var tRemainder = diffTime % minuteFrequency;
  console.log("tRemainder" + tRemainder);

  var minutesTilTrain = minuteFrequency - tRemainder;
  console.log("minutesTilTrain" + minutesTilTrain);

  var nextTrain = today.add(minutesTilTrain, "minutes");
console.log("the next train"+ nextTrain);

  return nextTrain;
}
//capture input
$("#enterInput").on("click", function(event) {
  console.log("Get User input");
  event.preventDefault();

  // inputs // id ="trainName"
  var trainName = $("#trainName")
    .val()
    .trim();
  //     id="destination"
  var destination = $("#destination")
    .val()
    .trim();
  //     id="firstTrainTime"
  var firstTrainTime = $("#firstTrainTime")
    .val()
    .trim();
  //     id="minuteFrequency"
  var minuteFrequency = $("#minuteFrequency")
    .val()
    .trim();

  console.log(
    "Here's input " + trainName,
    destination,
    firstTrainTime,
    minuteFrequency
  );

  // push into fire
  database.ref("/trainInfo").push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    minuteFrequency: minuteFrequency
  });
});

database.ref("/trainInfo").on("child_added", function(snapshot) {
  console.log(snapshot.val());

  //dynamically create rows
  var newRow = $("<div>").addClass("row");
  var hardLine = $("<hr>").addClass("my-2");

  //add input values and calculations
  var trainNameCol = $("<div>")
    .addClass("col-2")
    .text(snapshot.val().trainName);
  console.log(trainNameCol);
  
  var destinationCol = $("<div>")
    .addClass("col-2")
    .text(snapshot.val().destination);

  var minuteFrequencyCol = $("<div>")
    .addClass("col-2")
    .text(snapshot.val().minuteFrequency);

    //   var minuteFrequency = moment(snapshot.val().minuteFrequency);
//   console.log("minuteFrequency" + minuteFrequency.format());
//   console.log(moment().diff(minuteFrequency, "minutes"));

  var firstTrainTimeCol = $("<div>")
    .addClass("col-2")
    .text(snapshot.val().firstTrainTime);
  var firstTimeConverted = moment(snapshot.val().firstTrainTime, "HH:mm");
  console.log(" firstTrainTime" + firstTimeConverted.format());

  var diffTime = moment().diff(moment(snapshot.val().firstTrainTime), "minutes");
   console.log("diffTime" + diffTime.format());

  // var tRemainder = diffTime % minuteFrequency;
  // console.log("tRemainder" + tRemainder);

  // var minutesTilTrain = minuteFrequency - tRemainder;
  // console.log("minutesTilTrain" + minutesTilTrain);
  var minutesAwayCol = $("<div>")
    .addClass("col-2")
    .text("minutesTilTrain");

//   var nextTrain = getTrainArrival(minuteFrequency, firstTimeConverted);
  var nextTrainCol = $("<div>")
    .addClass("col-2")
    .text("nextTrain");

  //attach info to DOM
  newRow.append(
    trainNameCol,
    destinationCol,
    minuteFrequencyCol,
    // firstTrainTimeCol,
    nextTrainCol,
    minutesAwayCol
  );
  $("#currentTrainSchedule")
    .append(newRow)
    .append(hardLine);
});
//make time calculations
