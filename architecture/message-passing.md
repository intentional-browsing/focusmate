# Message Passing

## Problem

- Storing tasks in chrome.sync.storage results in the objects being serialised. i.e, the methods of the tasks are not retained

## Message Passing

- options.js currently stores tasks in chrome.storage directly
- instead, options.js will send messages to background.js
- background.js will store tasks in a list, and store serialised versions in chrome.storage

## Tasks Serialisation and Deserialisation

- we need to implement a serialise() and deserialise() method
- serialise() - create an object with just data members - name, actionType (string), triggerType, actionSettings, triggerSettings
- deserialise() - static class function or constructor - create task object from a serialised object
- background.js takes all the serialised tasks from storage, deserialises them, stores them in a list, and registers them all on startup
