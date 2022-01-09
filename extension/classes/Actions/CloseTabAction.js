import Action from "../Action.js"

class CloseTabAction extends Action {

    static humanName = "Close Site"
    static argList = ["tabId"]

    constructor(settings) {
        super(settings)
    }

    execute (argObj) {
        chrome.tabs.remove(argObj.tabId).catch(function(error){
          console.log(error);

        })


    }
}

export default CloseTabAction
