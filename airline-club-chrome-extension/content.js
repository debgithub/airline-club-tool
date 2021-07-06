chrome.runtime.onMessage.addListener(
	function(message, sender, callback) {
		if(message.type=="airlineMapLoad") {
			/*var s = document.createElement('script');
			s.src = chrome.runtime.getURL('airline_relation_map.js');
			s.onload = function() {
				this.remove();
			};
			document.head.appendChild(s);*/
			alert("This functionality has been disabled");
			callback("Done");
		}
		if(message.type=="countryMapLoad") {
			var s = document.createElement('script');
			s.src = chrome.runtime.getURL('country_relation_map.js');
			s.onload = function() {
				this.remove();
			};
			document.head.appendChild(s);
			callback("Done");
		}
	}
);
var s = document.createElement('script');
s.src = chrome.runtime.getURL('ac_country_data.js');
document.head.appendChild(s);
s = document.createElement('script');
s.src = chrome.runtime.getURL('ac_country_mutual_relation.js');
document.head.appendChild(s);
s = document.createElement('script');
s.src = chrome.runtime.getURL('ac_world_geojson.js');
document.head.appendChild(s);
s = document.createElement('script');
s.src = 'https://d3js.org/d3.v6.js';
document.head.appendChild(s);
s = document.createElement('script');
s.src = chrome.runtime.getURL('country_relation_map.js');
document.head.appendChild(s);
s = document.createElement('div');
s.setAttribute('class','table-row');
s.innerHTML="<div class=\"label\"><h5>Relationship Map:</h5></div><div class=\"value\" style=\"padding-bottom : 10px;\"><div class=\"button\" onclick=\"country_choropleth_creator();\">Show Map</div></div>";
document.querySelector('#countryDetails').appendChild(s);
console.log("Airline Tool loaded");
