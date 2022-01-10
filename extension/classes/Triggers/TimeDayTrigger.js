import Trigger from "../Trigger.js";

class TimeDayTrigger extends Trigger {
  static humanName = "Set Time of Day";

  static settingsTypes = [
    {
      name: "hour",
      type: "int",
      humanName: "Hour of Day",
    },
    {
      name: "min",
      type: "int",
      humanName: "Minute of Hour",
    },
  ];

  constructor(action, settings) {
    super(action, settings);
    this.interval = null;
  }

  registerTrigger() {
    //make sure input is valid
    if (this.settings.hour > 23) {
      this.settings.hour = 23;
    } else if (this.settings.hour < 0) {
      this.settings.hour = 0;
    }

    if (this.settings.min > 59) {
      this.settings.min = 59;
    } else if (this.settings.min < 0) {
      this.settings.min = 0;
    }

    //set up Date
    var today = new Date();
    var date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      this.settings.hour,
      this.settings.min
    );

    //check if user's date is "in the past." If so, set the date for tomorrow
    if (date.getMinutes() <= today.getMinutes()) {
      if (date.getHours() <= today.getHours()) {
        date.setDate(date.getDate() + 1);
      }
    }
    console.log(date);
    //When the time arrives, execute the action
    this.interval = setInterval(() => {
      let now = new Date();
      console.log("now date: " + now);
      console.log("Now: " + now.getTime());
      console.log("Date: " + date.getTime());
      if (now.getTime() >= date.getTime()) {
        try {
          console.log("Time is up!!!!!");
          this.action.execute({});
          clearInterval(this.interval);
        } catch (error) {
          console.log(error);
        }
      }
    }, 1000);
  }

  deregisterTrigger() {
    clearInterval(this.interval);
    console.log("TImeDayTrigger deregistered");
  }
}

export default TimeDayTrigger;
