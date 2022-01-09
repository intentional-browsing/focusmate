const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('message');
$("#reminder-text").text(myParam);
