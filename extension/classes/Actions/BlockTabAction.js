import Action from "../Action.js"

class BlockTabAction extends Action {

    static humanName = "Block a Website"
    static argListClose = ["tabId"]

    static settingsTypes = [
        {
            name: 'host',
            type: 'string',
            humanName: 'Host Name'
        }
    ]

    constructor(settings) {
        super(settings)
    }

    execute (argObj) {
        chrome.tabs.remove(argObj.tabId).catch(function(error){
          console.log(error);
        })

        chrome.tabs.create(this.settings.url).catch(function(error){
          console.log(error);
        })

    }
}

export default BlockTabAction