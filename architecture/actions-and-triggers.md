1. Close Tab 
  - arguments: tab ID
  - settings: none
  - func: close
2. Close Tab and Open Tab
  - arguments: tab ID
  - settings: url (the one to be opened)
  - func: close a tab Id, and open the URL
3. Block Tab
  - arguments: 
  - settings: host
  - func: don't let host tabs be opened
4. Open Tab
  - arguments: -
  - settings: url (the one to be opened)
  - func: literally open a tab with this site
5. Reminder
  - arguments:
  - settings: message
  - func: open an html page with the message. This page has to look good.

Trigger
1. Open Tab
  - settings: host
  - func: watch for a host, if opened, start action
  - arguments passed: tab id
2.  Timer - watching a tab - push to later
   - close tab, close tab and open tab
3.  Timer - in general
  - Actions - Block site action, open tab action, or reminder action  
4.  Time tracking - skip
5.  Time of day trigger
  - arguments passed: none
  - settings: hh:mm
  - func: at a certain time in the day, start action
