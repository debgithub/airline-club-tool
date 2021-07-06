country_mapper={};
//country_relation={};
async function object_loader(){
let obj = await (await fetch("https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json")).json();
obj.forEach(function(cntry){
	country_mapper[cntry['alpha-2']]=cntry['alpha-3'];
});
/*for (k in loadedCountriesByCode){
let obj = await (await fetch("https://www.airline-club.com/countries/"+k+"/airline/"+activeAirline.id)).json();
country_relation[country_mapper[k]]=obj.relationship.total;
await new Promise(r => setTimeout(r, 1000));
}*/
if (document.getElementById('d3jslibrary')==null){
console.log("Loading the d3.js library");
let script = document.createElement('script');
script.id="d3jslibrary";
script.src = "https://d3js.org/d3.v6.js";
script.onload=choropleth_creator;
document.head.appendChild(script);
}
else{
console.log("d3.js Library already loaded");
choropleth_creator();
}
};
function choropleth_creator(){
let mapmodal=document.createElement("div");
mapmodal.setAttribute("id","choroplethmodal");
mapmodal.setAttribute("style","display:none;");
mapmodal.setAttribute("class","modal");
let mapmodalheight=window.innerHeight*0.8;
let mapmodalwidth=window.innerWidth*0.8;
mapmodal.innerHTML="<div class=\"modal-content\" style=\"width : "+parseInt(mapmodalwidth)+"px;\"><span class=\"close\" onclick=\"document.getElementById('choroplethmodal').remove();\">×</span><svg id=\"choropleth_dataviz\" width=\""+parseInt(mapmodalwidth)+"\" height=\""+parseInt(mapmodalwidth*0.9*3/4)+"\"></svg></div>"
document.body.appendChild(mapmodal);
document.getElementById('choroplethmodal').style.display='block';
const svg = d3.select("#choropleth_dataviz"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(width / 2.5 / Math.PI)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale
let data = new Map()
const colorScale = d3.scaleThreshold()
  .domain([-10, -1, 1, 10, 20, 40, 60, 80])
  .range(['orange','yellow','white','lime','lightgreen','aqua','skyblue','royalblue','purple']);

// Load external data and boot
Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) {
    data.set(d.code, +d.pop)
})
]).then(function(loadData){
    let topo = loadData[0]

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
        d.total = country_relation[d.id] || 0;
        return colorScale(d.total);
      })
})
}
object_loader();
