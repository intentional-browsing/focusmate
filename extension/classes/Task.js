class Task {
    constructor(uuid, name, triggerType, triggerSettings, actionType, actionSettings) {
        this.uuid = uuid
        this.name = name
        this.actionType = actionType
        this.triggerType = triggerType
        this.action = new this.actionType(actionSettings)
        this.trigger = new this.triggerType(this.action, triggerSettings)
    }

    registerTask() {
        this.trigger.registerTrigger()
    }

    deregisterTask() {
        this.trigger.deregisterTrigger()
    }

    serialize() {
        return {
            uuid: this.uuid,
            name : this.name,
            actionString: this.actionType.prototype.constructor.name,
            actionSettings: this.action.settings,
            triggerString: this.triggerType.prototype.constructor.name,
            triggerSettings: this.trigger.settings
        }
    }


}

export default Task