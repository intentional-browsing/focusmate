import actionDict from "./classes/actionDict.js";
import triggerDict from "./classes/triggerDict.js";
import Task from "./classes/Task.js";
import TimerTrigger from "./classes/Triggers/TimerTrigger.js";
import ReminderAction from "./classes/Actions/ReminderAction.js";

export function startTimer(hours, minutes, seconds, element, date = 0) {
  var countDownDate =
    new Date().getTime() +
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000 +
    seconds * 1000;

  chrome.runtime.sendMessage(
    { cmd: "start-timer", when: countDownDate },
    (response) => {
      console.log("sent message");
    }
  );
  timer(countDownDate, element);
}

export function createReminder(hours, minutes, seconds, message) {
  const task = {
    uuid: createUUID(),
    name: "reminder",
    triggerString: "TimerTrigger",
    triggerSettings: { hours: hours, mins: minutes, secs: seconds },
    actionString: "ReminderAction",
    actionSettings: { message: message },
  };

  const msg = {
    command: "addTask",
    payload: task,
  };
  chrome.runtime.sendMessage(msg);
  console.log("created reminder");
}

export function timer(time, element) {
  let x = setInterval(function () {
    let now = new Date().getTime();

    let timeLeft = time - now;
    var hours = Math.floor(timeLeft / (1000 * 60 * 60));
    var minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    var seconds = Math.floor((timeLeft / 1000) % 60);

    element.innerHTML = hours + ":" + minutes + ":" + seconds;

    chrome.storage.sync.get("isTimerOn", function (data) {
      if (data.isTimerOn == false) {
        clearInterval(x);
        chrome.runtime.sendMessage({ cmd: "stop-timer" });
      }
    });

    //check if timer reaches 0 to turn it off
    chrome.storage.sync.get("popUpTimer", function (data) {
      if (timeLeft <= 0) {
        element.innerHTML = "00:00:00";
        clearInterval(x);
      }
    });
  });
}

// Attribution: https://gist.github.com/ifandelse/3031112

export function createUUID() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}

export function getTaskFromStorage(uuid, callback) {
  chrome.storage.sync.get(["tasks"], function (result) {
    const task = result.tasks.find((task) => task.uuid == uuid);
    if (!task) {
      throw Error(`Task ${uuid} could not be found`);
    } else {
      callback(task);
    }
  });
}

export function getAllTasksFromStorage(callback) {
  chrome.storage.sync.get(["tasks"], function (result) {
    callback(result.tasks);
  });
}

export function addToTasksStorage(newTask) {
  chrome.storage.sync.get(["tasks"], function (result) {
    chrome.storage.sync.set({ tasks: [...result.tasks, newTask] });
  });
}

export function addAllTasksToStorage(newTasklist) {
  chrome.storage.sync.set({ tasks: newTasklist });
}

export function removeTaskFromStorage(uuid) {
  chrome.storage.sync.get(["tasks"], function ({ tasks }) {
    const deleteTaskIdx = tasks.findIndex((task) => task.uuid == uuid);
    if (deleteTaskIdx == -1) {
      throw Error(`Task ${uuid} could not be found for deletion`);
    }

    const newTaskList = [
      ...tasks.slice(0, deleteTaskIdx),
      ...tasks.slice(deleteTaskIdx + 1),
    ];
    chrome.storage.sync.set({ tasks: newTaskList });
  });
}

function editTaskFromStorage(newTask) {
  chrome.storage.sync.get(["tasks"], function ({ tasks }) {
    const editTaskIdx = tasks.findIndex((task) => task.uuid == newTask.uuid);
    if (editTaskIdx == -1) {
      throw Error(`Task ${newTask.uuid} could not be found for editing`);
    }
    const newTaskList = [
      ...tasks.slice(0, editTaskIdx),
      newTask,
      ...tasks.slice(editTaskIdx + 1),
    ];
    chrome.storage.sync.set({ tasks: newTaskList });
  });
}

/*
popup js has lsit of diff timers in storage
when you add a timer, it can listen for changes
chrome.storage.onChanged (lets you listen to changes in storage)
in background.js, create a set interval function
  After n seconds, deal with the tab thing

To cancel timer, will need to create a callback and then figure out how to cancel it
  create a setInterval and then find a way to cancel the setInterval call
*/

export function deserializeTask(serializedTask) {
  //convert actionstring to actiontype and triggerstring to triggertype
  var actionType = actionDict[serializedTask.actionString];
  var triggerType = triggerDict[serializedTask.triggerString];
  //set up static dictionaries for these

  return new Task(
    serializedTask.uuid,
    serializedTask.name,
    triggerType,
    serializedTask.triggerSettings,
    actionType,
    serializedTask.actionSettings
  );
}

export function serializeTask(task) {}
