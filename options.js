var keys = ["background_colour", "border_colour", "inner_colour"];

loadData = function () {
	
	for(var i = 0; i < keys.length; i++) {
		
		var colour = localStorage.getItem(keys[i]);
		
		if(colour)
			document.getElementById(keys[i]).value = colour;
	}

}

saveData = function () {
	
	for(var i = 0; i < keys.length; i++) {
		
		localStorage.setItem(keys[i], document.getElementById(keys[i]).value);
	}		
	
	flashStatus("Options Saved.");
}

resetDefaults = function () {
	
	chrome.runtime.sendMessage({method : "resetDefaults"}, function(response) {
		
		if(response.reset) {
			loadData();	
			flashStatus("Data Reset");
		}
		else
			flashStatus("Error Reseting Options. If problem persists please reinstall the extension");
	});
}

flashStatus = function (flashText) {
	
	var status = document.getElementById("status");
	status.innerHTML = flashText;
	setTimeout(function() {
		status.innerHTML = "";
	}, 750);
}

document.addEventListener('DOMContentLoaded', loadData);
document.getElementById('save').addEventListener('click', saveData);				
document.getElementById('reset').addEventListener('click', resetDefaults);