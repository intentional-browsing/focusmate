class Trigger {
  static settingsTypes = [];

  constructor(action, settings) {
    this.action = action;
    this.settings = settings;
  }

  registerTrigger() {
    throw Error("Must be overriden by child class");
  }
  deregisterTrigger() {
    throw Error("Must be overriden by child class");
  }
}

export default Trigger;
