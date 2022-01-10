import Action from "../Action.js";

class OpenTabAction extends Action {
  static humanName = "Open a website";

  static settingsTypes = [
    {
      name: "host",
      type: "string",
      humanName: "Host Name",
    },
  ];

  constructor(settings) {
    super(settings);
  }

  execute(argObj) {
    chrome.tabs
      .create({ url: "http://" + this.settings.host })
      .catch(function (error) {
        throw error;
      });
  }
}

export default OpenTabAction;
