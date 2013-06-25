var defaults = {
  "background_colour" : "000000",
  "border_colour" : "18EDDF",
  "inner_colour" : "FFFFFF"
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
