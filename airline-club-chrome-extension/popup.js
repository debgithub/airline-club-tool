function airlinemaptrigger() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {type:"airlineMapLoad"}, function(response){
			console.log(response);
		});
	});
	window.close();
}
function countrymaptrigger() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {type:"countryMapLoad"}, function(response){
			console.log(response);
		});
	});
	window.close();
}

document.getElementById('airlinemap').addEventListener('click', airlinemaptrigger);
//document.getElementById('countrymap').addEventListener('click', countrymaptrigger);