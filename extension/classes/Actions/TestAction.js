import Action from "../Action.js"

class TestAction extends Action {

    static humanName = "Test Action"
    static argList = ["tabId"]

    constructor(settings) {
        super(settings)
    }

    execute (argObj) {
        console.log("action executed")
    }
}

export default TestAction
