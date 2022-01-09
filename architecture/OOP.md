# OOP structure

## General Notes
- Use background.js in some capacity to watch for whether the trigger conditions are met
- Triggers pass argObj to Action to pass arguments (usually a tab ID)
- There are user provided arguments (e.g trigger on which sites opening) and implicity arguments (e.g tab ID)

## Considerations
- Needs to be extensible
  - use chrome.storage to store info
  - track stats (this trigger was triggered X times this year)
- Need to try implementing child classes to flesh out further

## Task

Combination of an Action and a Trigger

### Members
- name: String - task name provided by the user
- action: Action
- trigger: Trigger

### Methods
- constructor() 
  - set up trigger using trigger(action) 
  - call trigger.registerTrigger()

- destructor()
  - call trigger.deregisterTrigger()
  


## Trigger
A class whose instance watches for a specific event. A trigger has an action.

### Members

- name: String - trigger name provided by developer (e.g, "Open Tab trigger")
- id: Number - provided by developer (e.g, "Open Tab trigger" is 1)
- action: Action - when the trigger event

Child classes can have additional members. E.g Open Tab Trigger can take a list of hostnames.

### Methods
- constructor(action) - just set the action
- registerTrigger() - to be overidden by children, must call action.execute(argObj) when the condition is satisfied
- deregisterTrigger() - to be overriden by children

## Action

A class whose instance executes an action. 

### Members
- name: String - action name provided by developer (e.g, "Close Tab action")
- id: Number - provided by developer (e.g, "Close Tab action" is 1)
- argObj: Object - arguments provided by the trigger (e.g the Open Tab trigger might provide the tab id)

Child classes can have additional members. E.g Open Tab action can take a list of hostnames.

### Methods
- execute(argObj) - to be overridden by children. Execute what has to be done (e.g opening some tabs, closing some tabs etc.)

