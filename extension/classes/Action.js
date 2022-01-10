class Action {
  static settingsTypes = [];
  static argList = [];

  constructor(settings) {
    this.settings = settings;
  }

  execute(argObj) {} // must be overriden by children
}

export default Action;
