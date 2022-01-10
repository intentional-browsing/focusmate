import Action from "../Action.js";

class CloseOpenTabAction extends Action {
  static humanName = "Close and Then Open Another Site";
  static argListClose = ["tabId"];

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
      .remove(argObj.tabId)
      .catch(function (error) {
        throw error;
      })
      .then(() => {
        chrome.tabs
          .create({ url: "http://" + this.settings.host })
          .catch(function (error) {
            throw error;
          });
      });
  }
}

export default CloseOpenTabAction;
