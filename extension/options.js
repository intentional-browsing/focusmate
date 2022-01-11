import actionDict from "./classes/actionDict.js";
import triggerDict from "./classes/triggerDict.js";
import { createUUID, getTaskFromStorage } from "./functions.js";

// adding event handlers
$("#tasksModal__saveBtn").on("click", saveTaskButtonHandler);
$("#createTaskBtn").on("click", openCreateTaskModal);

// populate IfSelect and ThenSelect
for (const triggerKey in triggerDict) {
  const option = `<option value="${triggerKey}">${triggerDict[triggerKey].humanName}</option>`;
  $("#tasksModal__IfSelect").append(option);
}

for (const actionKey in actionDict) {
  const option = `<option value="${actionKey}">${actionDict[actionKey].humanName}</option>`;
  $("#tasksModal__ThenSelect").append(option);
}

function openCreateTaskModal() {
  //clear anything that might have been in modal

  $(".tasksModal__NameInput").val("");
  // $(".tasks__triggerHostNameInput").val('');
  // $(".tasks__actionHostNameInput").val('');
  $("#tasksModal__IfSelect").val("Choose...");
  $("#tasksModal__ThenSelect").val("Choose...");

  document.getElementById("popupModal").innerHTML = "New Task";

  $("#taskModal").modal("show");

  //clear content in the If Specs
  $("#tasksModal__IfSpecifications").empty();
  $("#tasksModal__ThenSpecifications").empty();
}

//check what is within the if field
let currentIfSelection;
$("#tasksModal__IfSelect").on("change", function () {
  //clear content in the If Specs
  $("#tasksModal__IfSpecifications").empty();

  currentIfSelection = this.value;
  if (this.value != -1 || this.value != currentIfSelection) {
    //populate the field
    triggerDict[this.value].settingsTypes.forEach((element) => {
      const div = `
      <div class="row tasks__modalrow">
        <div class="input-group">
          <label class="col-sm">${element.humanName}</label>
          <input type="text" id="tasksModal__IfSpecifications__${element.name}" class="col-sm"/>
        </div>
      </div>
      `;
      $("#tasksModal__IfSpecifications").append(div);
    });
  }
});

//check what is within the then field
let currentThenSelection;
$("#tasksModal__ThenSelect").on("change", function () {
  //clear content in the If Specs
  $("#tasksModal__ThenSpecifications").empty();

  currentThenSelection = this.value;
  if (this.value != -1 || this.value != currentThenSelection) {
    //populate the field
    actionDict[this.value].settingsTypes.forEach((element) => {
      const div = `
      <div class="row tasks__modalrow">
        <div class="input-group">
          <label class="col-sm">${element.humanName}</label>
          <input type="text" id="tasksModal__ThenSpecifications__${element.name}" class="col-sm"/>
        </div>
      </div>
      `;
      $("#tasksModal__ThenSpecifications").append(div);
    });
  }
});

// update ui
/*
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if ("tasks" in changes && namespace == "sync") {
    console.log("change made to storage");
    // render the new tasks List
    refreshTasks();
  }
});
*/

// modal state
var modalCurrentTaskId = "";

/*
tests
1. the list of triggers and actions should display correctly
2. the associated settings should populate accordingly
*/

function saveTaskButtonHandler() {
  //initialize task
  const triggerString = $("#tasksModal__IfSelect").val();
  const actionString = $("#tasksModal__ThenSelect").val();

  console.log(triggerString, actionString);

  const task = {
    name: $(".tasksModal__NameInput").val(),
    triggerString: triggerString,
    triggerSettings: {},
    actionString: actionString,
    actionSettings: {},
  };

  //place if Specs into trigger Settings
  triggerDict[triggerString].settingsTypes.forEach((element) => {
    task.triggerSettings[element.name] = $(
      `#tasksModal__IfSpecifications__${element.name}`
    ).val();
    if (element.type === "int") {
      task.triggerSettings[element.name] = parseInt(
        task.triggerSettings[element.name]
      );
    }
  });

  //place then Specs into action Settings
  actionDict[actionString].settingsTypes.forEach((element) => {
    task.actionSettings[element.name] = $(
      `#tasksModal__ThenSpecifications__${element.name}`
    ).val();
    if (element.type === "int") {
      task.actionSettings[element.name] = parseInt(
        task.actionSettings[element.name]
      );
    }
  });

  console.log(task);

  if (modalCurrentTaskId === "") {
    // create a new task
    task.uuid = createUUID();
    addTaskMessage(task);
    // addToTasksStorage(task);
  } else {
    // edit existing task
    task.uuid = modalCurrentTaskId;
    // editTaskFromStorage(task);
    editTaskMessage(task);
  }

  modalCurrentTaskId = "";

  // close modal
  $("#taskModal").modal("hide");
}

function addTaskMessage(task) {
  const message = {
    command: "addTask",
    payload: task,
  };
  chrome.runtime.sendMessage(message);
}

function deleteTaskMessage(
  uuid,
  func = (response) => {
    console.log(response);
  }
) {
  const message = {
    command: "deleteTask",
    payload: uuid,
  };
  chrome.runtime.sendMessage(message, func);
}

function editTaskMessage(task) {
  let f = function (response) {
    addTaskMessage(task);
  };
  deleteTaskMessage(task.uuid, f);
}

window.addEventListener("load", (event) => {
  refreshTasks();
});

function refreshTasks() {
  clearTasksList();
  // send a message to receive the latest tasks
  const message = {
    command: "getAllTasks",
  };
  chrome.runtime.sendMessage(message, (tasks) => {
    // on receive, populate with those tasks
    populateTasks(tasks);
  });
  /*
  chrome.storage.sync.get(["tasks"], function (result) {
    console.log(result.tasks);
    result.tasks.forEach((task) => {
      createTaskDiv(task);
    });
  });
  */
}

function populateTasks(tasks) {
  console.log("Will populate these tasks");
  console.log(tasks);
}

function clearTasksList() {
  $(".tasks__list").empty();
}

function createTaskDiv(task) {
  var listDiv = `
  <div class="list-group-item" id="task__${task.uuid}">
    <div class="row">
      <div class="col-sm">${task.name}</div>
      <div class="col-sm-2 tasks__editdeletediv">
        <button class="btn btn-warning" id="taskEditBtn__${task.uuid}"><i class="fas fa-edit"></i></button>
        <button class="btn btn-danger" id="taskDeleteBtn__${task.uuid}"><i class="fas fa-trash-alt"></i></button>
      </div>
    </div>
  </div>
  `;
  $(".tasks__list").append(listDiv);

  // registering delete event handler
  $(`#taskDeleteBtn__${task.uuid}`).on("click", getDeleteHandler(task.uuid));
  $(`#taskEditBtn__${task.uuid}`).on("click", getEditHandler(task.uuid));
}

function getDeleteHandler(uuid) {
  return () => {
    // delete from storage
    deleteTaskMessage(uuid);
  };
}

function getEditHandler(uuid) {
  return () => {
    //clear content in the If Specs
    $("#tasksModal__IfSpecifications").empty();
    $("#tasksModal__ThenSpecifications").empty();

    //changes name of modal
    document.getElementById("popupModal").innerHTML = "Edit Task";

    modalCurrentTaskId = uuid;
    getTaskFromStorage(uuid, (task) => {
      $("#tasksModal__IfSelect").val(task.triggerString);
      $("#tasksModal__ThenSelect").val(task.actionString);
      $(".tasksModal__NameInput").val(task.name);

      console.log(task);

      triggerDict[task.triggerString].settingsTypes.forEach((element) => {
        const div = `
        <div class="row tasks__modalrow">
          <div class="input-group">
            <label class="col-sm">${element.humanName}</label>
            <input type="text" id="tasksModal__IfSpecifications__${element.name}" class="col-sm"/>
          </div>
        </div>
        `;
        $("#tasksModal__IfSpecifications").append(div);
      });

      actionDict[task.actionString].settingsTypes.forEach((element) => {
        const div = `
        <div class="row tasks__modalrow">
          <div class="input-group">
            <label class="col-sm">${element.humanName}</label>
            <input type="text" id="tasksModal__ThenSpecifications__${element.name}" class="col-sm"/>
          </div>
        </div>
        `;
        $("#tasksModal__ThenSpecifications").append(div);
      });

      console.log(task);
      triggerDict[task.triggerString].settingsTypes.forEach((element) => {
        $(`#tasksModal__IfSpecifications__${element.name}`).val(
          task.triggerSettings[element.name]
        );
        if (element.type === "int") {
          task.triggerSettings[element.name] = parseInt(
            task.triggerSettings[element.name]
          );
        }
      });

      actionDict[task.actionString].settingsTypes.forEach((element) => {
        $(`#tasksModal__ThenSpecifications__${element.name}`).val(
          task.actionSettings[element.name]
        );
        if (element.type === "int") {
          task.actionSettings[element.name] = parseInt(
            task.actionSettings[element.name]
          );
        }
      });

      $("#taskModal").modal("show");

      $("tasksModal__deleteBtn").on(
        "click",
        getDeleteHandler(modalCurrentTaskId)
      );
    });
  };
}
