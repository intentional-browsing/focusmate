import { createReminder, startTimer, timer } from "./functions.js";

let timerBtn = document.getElementById("timerBtn");
timerBtn.addEventListener("click", displayTimer);

let reminderBtn = document.getElementById("reminderBtn");
let timerReminderBtn = document.getElementById("timerReminderBtn");
reminderBtn.addEventListener("click", displayReminder);
timerReminderBtn.addEventListener("click", displayReminder);

let optionsBtn = document.getElementById("optionsBtn");
let timerOptionsBtn = document.getElementById("timerOptionsBtn");
optionsBtn.addEventListener("click", displayOptions);
timerOptionsBtn.addEventListener("click", displayOptions);

let timerOkBtn = document.getElementById("timerOkBtn");
timerOkBtn.addEventListener("click", submitTime);

let cancelTimerBtn = document.getElementById("cancelTimerBtn");
cancelTimerBtn.addEventListener("click", cancelSetTime);

let stopTimerBtn = document.getElementById("stopTimerBtn");
stopTimerBtn.addEventListener("click", cancelTime);

let timerElement;

window.onload = function () {
  chrome.storage.sync.get("isTimerOn", function (data) {
    if (data.isTimerOn == true) {
      document.getElementById("defaultWindow").style.display = "none";
      document.getElementById("countDownWindow").style.display = "block";
      timerElement = document.getElementById("timer");

      chrome.runtime.sendMessage({ cmd: "get-time" }, (response) => {
        timer(response.time, timerElement);
      });
    } else {
      document.getElementById("countDownWindow").style.display = "none";
      document.getElementById("defaultWindow").style.display = "block";
    }
  });
};

function displayTimer() {
  document.getElementById("defaultWindow").style.display = "none";
  document.getElementById("setTimerWindow").style.display = "block";
}

function displayReminder() {
  document.getElementById("defaultWindow").style.display = "none";
  document.getElementById("countDownWindow").style.display = "none";
  document.getElementById("setReminderWindow").style.display = "block";
}

function displayOptions() {
  chrome.tabs.create({ url: "options.html" });
}

function submitTime() {
  //validate input
  let hours = document.getElementById("timerHours").value;
  if (hours > 24) {
    hours = 24;
  } else if (hours < 0 || hours == null) {
    hours = 0;
  }

  let minutes = document.getElementById("timerMinutes").value;
  if (minutes > 59) {
    minutes = 59;
  } else if (minutes < 0 || minutes == null) {
    minutes = 0;
  }

  var seconds = document.getElementById("timerSeconds").value;
  if (seconds > 59) {
    seconds = 59;
  } else if (seconds < 1 || seconds == null) {
    seconds = 1;
  }
  chrome.storage.sync.set({ isTimerOn: true }, function () {
    document.getElementById("countDownWindow").style.display = "block";
    document.getElementById("setTimerWindow").style.display = "none";
    timerElement = document.getElementById("timer");

    startTimer(hours, minutes, seconds, timerElement);
  });
}

function cancelSetTime() {
  document.getElementById("setTimerWindow").style.display = "none";
  document.getElementById("defaultWindow").style.display = "block";
}

function cancelTime() {
  chrome.storage.sync.set({ isTimerOn: false }, function () {
    document.getElementById("countDownWindow").style.display = "none";
    document.getElementById("defaultWindow").style.display = "block";
    chrome.runtime.sendMessage({ cmd: "stop-timer" });
  });
}

//----------------Set Reminder---------------\\
let reminderOK = document.getElementById("reminderOK");
reminderOK.addEventListener("click", submitReminder);

function submitReminder() {
  //gather text from textarea
  let message = document.getElementById("message").value;
  if (message !== "") {
    let hours = document.getElementById("reminderHours").value;
    if (hours > 24) {
      hours = 24;
    } else if (hours < 0 || hours == null) {
      hours = 0;
    }

    let minutes = document.getElementById("reminderMins").value;
    if (minutes > 59) {
      minutes = 59;
    } else if (minutes < 0 || minutes == null) {
      minutes = 0;
    }

    var seconds = document.getElementById("reminderSeconds").value;
    if (seconds > 59) {
      seconds = 59;
    } else if (seconds < 1 || seconds == null) {
      seconds = 1;
    }

    createReminder(hours, minutes, seconds, message);
    window.close();
  }
}
