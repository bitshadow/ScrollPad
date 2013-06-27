var keys = ["background_colour", "border_colour", "inner_colour"];

loadData = function () {
    for(var i = 0; i < keys.length; i++) {
        var colour = '#'+localStorage.getItem(keys[i]);
        if(colour) {
            var e = document.getElementById(keys[i]);
            e.value = colour;
            e.style.backgroundColor = colour;
            setColour(keys[i], colour);
        }
    }
}

saveData = function () {

    for(var i = 0; i < keys.length; i++) {
        localStorage.setItem(keys[i], document.getElementById(keys[i]).value);
        //console.log("storing: "+ document.getElementById(keys[i]).value);
    }

    flashStatus("Options Saved.");
}

saveAndReload = function () {
	
    saveData();
    loadData();
}

resetDefaults = function () {

   var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime':'extension';
   chrome[runtimeOrExtension].sendMessage({method : "resetDefaults"}, function(response) {
        if(response.reset) {
            loadData();
            flashStatus("Data Reset");
        } else {
            flashStatus("Error Reseting Options. If problem persists please reinstall the extension");
        }
    });
}

flashStatus = function (flashText) {
    var status = document.getElementById("status");
    status.innerHTML = flashText;
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
}

setColour = function(key, colour)
{
    switch(key) {
    case "background_colour":
        var spel = document.getElementById('spbg');
        spel.style.backgroundColor = colour;
        break;
    case "inner_colour":
        var spel = document.getElementById('spview');
        spel.style.backgroundColor = colour;
        break;
    case "border_colour":
        var spel = document.getElementById('spbg');
        spel.style.WebkitBoxShadow =  '0 0 8px 4px ' + colour;
        break;
    default:
        break;
    }
}

document.addEventListener('DOMContentLoaded', loadData);
document.getElementById('save').addEventListener('click', saveAndReload);
document.getElementById('reset').addEventListener('click', resetDefaults);

