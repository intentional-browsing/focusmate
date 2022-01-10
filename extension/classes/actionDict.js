import CloseTabAction from "./Actions/CloseTabAction.js";
import CloseOpenTabAction from "./Actions/CloseOpenTabAction.js";
import TestAction from "./Actions/TestAction.js";
import OpenTabAction from "./Actions/OpenTabAction.js";
import ReminderAction from "./Actions/ReminderAction.js";

const actionDict = {
  CloseTabAction: CloseTabAction,
  CloseOpenTabAction: CloseOpenTabAction,
  OpenTabAction: OpenTabAction,
  ReminderAction: ReminderAction,
};

export default actionDict;
