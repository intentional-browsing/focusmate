import Action from "../Action.js";

class ReminderAction extends Action {
  static humanName = "Set a reminder";

  static settingsTypes = [
    {
      name: "message",
      type: "string",
      humanName: "Message",
    },
  ];

  constructor(settings) {
    super(settings);
  }

  execute(argObj) {
    chrome.tabs
      .create({
        url:
          "../../reminder.html?message=" +
          encodeURIComponent(this.settings.message),
      })
      .catch(function (error) {
        console.log(error);
      });
    //probs use messages to send the info to the reminder-page
  }
}

export default ReminderAction;
