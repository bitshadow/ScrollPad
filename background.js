var defaults = {
  "background_colour" : "black",
  "border_colour" : "rgba(82, 168, 236, 0.6)",
  "inner_colour" : "white"
};

var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime':'extension';

setDefaults = function (force) {

  for ( var key in defaults) {
      if(force || !localStorage.getItem(key)) {
          localStorage.setItem(key, defaults[key]);
      }
  }
}

resetDefaults = function () {
  setDefaults(true);
}

chrome[runtimeOrExtension].onMessage.addListener (
  function (request, sender, sendResponse) {
      if(request.method == "getColour") {
          sendResponse({ value : localStorage.getItem(request.key)});
      }

      if(request.method == "resetDefaults") {
          resetDefaults();
          sendResponse({reset : true});
      }
});

setDefaults(false);
