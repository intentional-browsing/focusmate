import Trigger from "../Trigger.js";

class OpenTabTrigger extends Trigger {
    static humanName = "A site is opened";

    static settingsTypes = [
        {
            name: "host",
            type: "string",
            humanName: "Host Name",
        },
    ];

    constructor(action, settings) {
        super(action, settings);
        this.triggerFunctionReference = null; // function
        this.recentlyExecuted = false;
    }

    registerTrigger() {
        this.triggerFunctionReference = (tabId, changeInfo, tab) => {
            // check if tab's url matches the host name
            var list = [];
            // tab.url is the property of interest
            if (list.indexOf(tabId) == -1) {
                if (tab.url.includes(this.settings.host.toLowerCase())) {
                    if (!this.recentlyExecuted) {
                        // if not recentlyExecuted
                        const argObj = { tabId };
                        this.action.execute(argObj);
                        this.recentlyExecuted = true
                        console.log("Hi")
                        setTimeout(() => {this.recentlyExecuted = false}, 2000)
                    } else {
                        console.log("OpenTabTrigger execution cancelled")
                    }
                }
            }
        };

        chrome.tabs.onUpdated.addListener(this.triggerFunctionReference);
    }

    deregisterTrigger() {
        chrome.tabs.onUpdated.removeListener(this.triggerFunctionReference);
    }
}

export default OpenTabTrigger;
