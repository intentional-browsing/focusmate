//Initialize the time
function initializeTimer(hours, minutes, seconds, element) {
  const countDownDate =
    new Date().getTime() +
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000 +
    seconds * 1000;
  //send the time to the background script
  chrome.runtime.sendMessage({ cmd: "start-timer", when: countDownDate });
  displayTimer(countDownDate, element);
}

//show timer
function displayTimer(time, element) {
  alert("timer is diplaying");
  let now = new Date().getTime();
  if (time > now) {
    alert(Date(time).toString());
    setInterval(() => {
      const hours = Math.floor(time / (1000 * 60 * 60));
      const minutes = Math.floor((time / (1000 * 60)) % 60);
      const seconds = Math.floor((time / 1000) % 60);

      element.innerHTML = hours + ":" + minutes + ":" + seconds;
    }, 1000);
  }
}
