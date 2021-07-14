function country_choropleth_creator(){
let country_mapper={};
let country_relation={};
let description={"-3":"Hostile","-2":"Hostile","-1":"Hostile","0":"Neutral","1":"Warm","2":"Friendly","3":"Close","4":"Alliance","5":"Home Country"};
actool_country_data.forEach(function(cntry){
	country_mapper[cntry['alpha-2']]={alpha3: cntry['alpha-3'], name: cntry['name']};
});
selected_country_element=document.querySelectorAll('#countryTable > .table-row.clickable.selected');
if(selected_country_element.length==0){
	alert("Please select a country from the counrty tab");
	return;
}
selected_country=selected_country_element[0].getAttribute('data-country-code');
selected_country_data=actool_country_mutual_relation[selected_country];
for (k in selected_country_data){
	country_relation[country_mapper[k].alpha3]={name: country_mapper[k].name, val: selected_country_data[k], relation: description[selected_country_data[k]]+"("+selected_country_data[k]+")"};
}
if(document.getElementById('choroplethmodal')!=null){
	document.getElementById('choroplethmodal').remove();
}
let mapmodal=document.createElement("div");
mapmodal.setAttribute("id","choroplethmodal");
mapmodal.setAttribute("style","display:none;");
mapmodal.setAttribute("class","modal");
let mapmodalheight=window.innerHeight*0.8;
let mapmodalwidth=window.innerWidth*0.8;
mapmodal.innerHTML="<div class=\"modal-content\" style=\"width : "+parseInt(mapmodalwidth)+"px;\"><span class=\"close\" onclick=\"document.getElementById('choroplethmodal').remove(); document.getElementsByClassName('d3-tooltip')[0].remove();\">×</span><div id=\"choropleth_dataviz\"></div></div>"
document.body.appendChild(mapmodal);
document.getElementById('choroplethmodal').style.display='block';
let d3_tip_css=`
.d3-tooltip {	
    position: absolute;			
    text-align: left;			
    padding: 8px;				
    font: 12px sans-serif;	
    background: white;	
    border: 0px;		
    border-radius: 8px;			
    pointer-events: none;	
	z-index:15;
	color: black;
}
`
if (document.getElementById('d3css')==null){
	var styleSheet = document.createElement("style");
	styleSheet.id="d3css";
	styleSheet.type = "text/css";
	styleSheet.innerHTML = d3_tip_css;
	document.head.appendChild(styleSheet);
	console.log("added d3css");
}
else{
	console.log("d3css already added");
}
const width=parseInt(mapmodalwidth)
const height=parseInt(mapmodalwidth*0.9*3/4)
let svg = d3.select("#choropleth_dataviz")
			.append("svg")
			.attr("width", width)
			.attr("height", height)

var tooltip = d3.select("body").append("div")	
    .attr("class", "d3-tooltip")				
    .style("opacity", 0);

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(width / 2.5 / Math.PI)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale
const colorScale = d3.scaleThreshold()
  .domain([0, 1, 2, 3, 4, 5])
  .range(['orange','lightcyan','lightsteelblue','steelblue','orchid','palevioletred','purple']);
  //.range(d3.schemeRdYlGn[9])
  //.range(d3.schemeBlues[7])

let tooltiptimer=null;

// Load geojson data and boot
  let topo = actool_world_geojson
  
  let mouseOver = function(e,d) {
	tooltiptimer=setTimeout((e,d)=>{
		tooltip.transition()
			.duration(100)
			.style("opacity", .9);
		tooltip.html("Name: "+d.data.name+"<br/>Relationship: "+d.data.relation)
			.style("left", (e.pageX) + "px")
			.style("top", (e.pageY - 28) + "px");
	},1000,e,d);
    /*d3.selectAll(".Country")
      .transition()
      .duration(100)
      .style("opacity", .5);
    d3.select(this)
      .transition()
      .duration(100)
      .style("opacity", 1)
      .style("stroke", "black");*/
  }

  let mouseLeave = function(e,d) {
	clearTimeout(tooltiptimer);
    /*d3.selectAll(".Country")
      .transition()
      .duration(100)
      .style("opacity", .8);
    d3.select(this)
      .transition()
      .duration(100)
	  .style("opacity", .8)
      .style("stroke", "transparent");*/
	tooltip.transition()
		.duration(100)
		.style("opacity", 0);
  }

    // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
		d.data={}
		if(Object.prototype.hasOwnProperty.call(country_relation, d.id)){
			d.data.val = country_relation[d.id].val;
			d.data.name = country_relation[d.id].name;
			d.data.relation = country_relation[d.id].relation;
		}
		else{
			d.data.val = 0;
			const countrykey=Object.keys(country_mapper).find(key => country_mapper[key].alpha3 === d.id);
			d.data.name = countrykey===undefined ? "Undefined" : country_mapper[countrykey].name;
			d.data.relation = description[0]+"(0)";
		}
		if(d.id==country_mapper[selected_country]['alpha3']){
			d.data.val=5;
			d.data.relation = description[0]+"(5)";
		}
        return colorScale(d.data.val);
      })
	  .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      //.style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
}
//country_choropleth_creator();
