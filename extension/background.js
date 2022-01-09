import {deserializeTask, addToTasksStorage, getAllTasksFromStorage, removeTaskFromStorage, createUUID, addAllTasksToStorage} from './functions.js'

// set tasks to an empty list on install
// I believe the service worker runs constantly, so we don't need to reinit
// on chrome startup

var taskList = [];

chrome.runtime.onInstalled.addListener(() => {

  chrome.tabs.create({url: 'about.html'})

  chrome.storage.sync.set({ tasks: [] }, () => {
    //if no tasks exist, create the sample tasks
    const sampleTask1 = {
      uuid: createUUID(),
      name: "Sample Task 1: Close Facebook",
      triggerString: "OpenTabTrigger",
      triggerSettings: { host: "facebook.com" },
      actionString: "CloseTabAction",
      actionSettings: {},
    };

    const sampleTask2 = {
      uuid: createUUID(),
      name: "Sample Task 2: Close Reddit, Open Wikipedia",
      triggerString: "OpenTabTrigger",
      triggerSettings: { host: "reddit.com" },
      actionString: "CloseOpenTabAction",
      actionSettings: { host: "wikipedia.com" },
    };

    const sampleTask3 = {
      uuid: createUUID(),
      name: "Sample Task 3: Reminder on opening Netflix",
      triggerString: "OpenTabTrigger",
      triggerSettings: { host: "netflix.com" },
      actionString: "ReminderAction",
      actionSettings: { message: "Go study!" },
    };

    const sampleTask4 = {
      uuid: createUUID(),
      name: "Sample Task 4: Improve performance on CNN.com",
      triggerString: "OpenTabTrigger",
      triggerSettings: { host: "cnn.com" },
      actionString: "CloseOpenTabAction",
      actionSettings: { host: "www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" },
    }

    addAllTasksToStorage([sampleTask1, sampleTask2, sampleTask3, sampleTask4]);
    initialRegistry()

  });
});

// log changes to tasks
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if ("tasks" in changes && namespace == "sync") {
    console.log(changes.tasks)
  }
});

initialRegistry()


function initialRegistry () {

  console.log("Initial registry is called")


  // store tasks from storage in taskList

  getAllTasksFromStorage((serializedTasks) => {
    console.log(serializedTasks)
    if (serializedTasks) {
      serializedTasks.forEach((serializedTask) => {
        const task = deserializeTask(serializedTask)
        taskList.push(task)
        task.registerTask()
      });

      console.log(taskList)
    }


  });

}

// handle all messages

let timerID;
let timerTime;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
  /* request
    {
      command: "",
      payload: {}
    }
  */

  console.log(taskList)

  switch(request.command) {
    case "addTask":
      handleAddTask(request.payload)
      sendResponse(null)
      break;
    case "deleteTask":
      handleDeleteTask(request.payload)
      sendResponse(null)
      break;
    case 'start-timer':
      timerTime = new Date(request.when)
      timerID = setTimeout(() => {
        console.log("done!")
        chrome.storage.sync.set({ isTimerOn: false });
        chrome.tabs.create({
          url: 'time-is-up.html'
        });
      }, timerTime.getTime() - Date.now());
      break;
    case 'stop-timer':
      console.log("stopped timer")
      clearInterval(timerID);
      break;
    case 'get-time':
      console.log("got time")
      console.log(timerTime)
      sendResponse({time: timerTime.getTime()})
      break;
  }
})

/*
const nums = [1, 2, 3]
nums.map(x => x * 2) // [2, 4, 6]
*/

function handleAddTasks(serializedTasks) {
  console.log(serializedTasks)
  const tasks = serializedTasks.map(deserializeTask)
  console.log(tasks)
  addAllTasksToStorage(serializedTasks)
  tasks.forEach(task => task.registerTask())
  taskList = [...taskList, ...tasks]
  console.log(taskList)

}

function handleAddTask(serializedTask) {
  const task = deserializeTask(serializedTask)
  addToTasksStorage(serializedTask)
  task.registerTask()
  taskList.push(task)
}

function handleDeleteTask(uuid){
  console.log(taskList)

  const taskIndex = taskList.findIndex((task) => task.uuid == uuid);
  if(taskIndex == -1){

    throw Error("task could not be found");
  }
  taskList[taskIndex].deregisterTask();
  removeTaskFromStorage(uuid);
  const newTaskList = [
    ...taskList.slice(0, taskIndex),
    ...taskList.slice(taskIndex + 1),
  ];

  taskList = newTaskList;
}
