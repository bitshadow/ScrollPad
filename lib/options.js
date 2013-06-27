var keys = ["background_colour", "border_colour", "inner_colour"];

function RGBToHex(rgb) {
	var split = rgb.split(',');
	var r = parseInt(split[0]), g = parseInt(split[1]), b = parseInt(split[2]);
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRGB(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return r + "," + g + "," + b;
}

loadData = function () {
    for(var i = 0; i < keys.length; i++) {
        var colour = localStorage.getItem(keys[i]);
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
        spel.style.backgroundColor = '#' + colour;
        break;
    case "inner_colour":
        var spel = document.getElementById('spview');
        spel.style.backgroundColor = '#' + colour;
        break;
    case "border_colour":
        var spel = document.getElementById('spbg');
        spel.style.WebkitBoxShadow =  '0 0 16px 8px rgba( ' + hexToRGB(colour) + ", 0.5 )";
        break;
    default:
        break;
    }
}

document.addEventListener('DOMContentLoaded', loadData);
document.getElementById('save').addEventListener('click', saveAndReload);
document.getElementById('reset').addEventListener('click', resetDefaults);

