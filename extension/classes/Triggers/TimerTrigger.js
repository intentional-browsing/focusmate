import Trigger from "../Trigger.js";

class TimerTrigger extends Trigger {
  static humanName = "Set a Timer";

  static settingsTypes = [
    {
      name: "hours",
      type: "int",
      humanName: "Hours",
    },
    {
      name: "mins",
      type: "int",
      humanName: "Minutes",
    },
    {
      name: "secs",
      type: "int",
      humanName: "Seconds",
    },
  ];

  constructor(action, settings) {
    super(action, settings);
    this.interval = null;
    console.log(this.action);
  }

  registerTrigger() {
    //create count down

    var countDown =
      this.settings.hours * 60 * 60 * 1000 +
      this.settings.mins * 60 * 1000 +
      this.settings.secs * 1000;

    //execute timer
    console.log("timer executed");
    this.timeout = setTimeout(() => {
      this.action.execute({});
      clearTimeout(this.timeout);
    }, countDown);
  }

  deregisterTrigger() {
    clearTimeout(this.timeout);
  }
}

export default TimerTrigger;
