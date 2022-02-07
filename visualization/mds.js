//../datasets/dataset_mds_500.csv
var data_path = "../datasets/dataset_fake.csv"

var margin_top= 5, 
margin_right= 2, 
margin_bottom= 1, 
margin_left= 2

var width = 500 - margin_left - margin_right
var height = 300 - margin_top - margin_bottom
  
function draw_MDS(data){   

  var tooltip = d3.select("body")
   .append("div")
   .style("background", "rgba(225, 213, 168,0.8)")
   .style("position", "absolute")
   .style("z-index", "10")
   .style("visibility", "hidden")
   .style("font-size", "20px")
   .text("a simple tooltip");

  var zoom = d3.zoom()
    .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
    .extent([[0, 0], [width, height]])
    .on("zoom", updateChart);

  var svg_1 = d3.select("#area_1")
  .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 300 175")
    .classed("svg-content", true)
    .call(zoom)
    .on("mousedown.zoom", null)
    .on("touchstart.zoom", null)
    .on("touchmove.zoom", null)
    .on("touchend.zoom", null)
   
    //.call(zoom)
    //.attr("transform", "translate(" + 2 + "," + 2 + ")")
    //.style("border", "1px solid")
    //.style("background-color","red")

  var x = d3.scaleLinear().range([0, width-250])
  var y = d3.scaleLinear().range([height-140, 2])

  var xAxis = svg_1.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(30," + 156 + ")")
    .call(d3.axisBottom(x))
    .attr("font-size", "6px")
    
  var yAxis = svg_1.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(30," + 2 + ")")
    .call(d3.axisLeft(y))
    .attr("font-size", "6px")
  x.domain(d3.extent(data, function(d) { return +d[chiavi[0]]; }));
  y.domain(d3.extent(data, function(d) { return +d[chiavi[1]]; }));
  
  // Add a clipPath: everything out of this area won't be drawn.
  var clip = svg_1.append("defs").append("SVG:clipPath")
    .attr("id", "clip")
    
    .append("SVG:rect")
    .attr("width",  width-240)
    .attr("height", height-138 )
    .attr("x", 0)
    .attr("y", 0)
 
  var scatter = svg_1.append('g')
  .attr("clip-path", "url(#clip)")
  .attr("transform", "translate(30," + 1 + ")")
  
  // Add circles
  scatter
  
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr('class', 'dot')
      .attr("cx", function (d) { return x(d[chiavi[0]]) } )
      .attr("cy", function (d) { return y(d[chiavi[1]]) } )
      .attr("r", 1)
      .attr("id", function (d) { return d[chiavi[2]] })
      .attr("name", function (d) { return d["title"] } )
      .style("fill", "rgb(66, 172, 66)") // #ff0099
      .style("stroke", "black")
      .style("stroke-width", "0.2") 
      .style("opacity", 0.8)
      .style("pointer-events", "all")
      .on("mouseover", function(d) {
      tooltip.text(d.title);
     return tooltip.style("visibility", "visible");
   })
   .on("mousemove", function() {
     return tooltip.style("top",
       (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
   })
   .on("mouseout", function() {
     return tooltip.style("visibility", "hidden");
    
   });

/*
    scatter.append("rect")
      .attr("width",  width-240)
      .attr("height", height-140)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('transform', 'translate(' + 30 + ',' + 4 + ')')
      .style("background-color","red")
      .call(zoom)
      
  */

  function updateChart() {

    // recover the new scale
    var newX = d3.event.transform.rescaleX(x);
    var newY = d3.event.transform.rescaleY(y);

    // update axes with these new boundaries
    xAxis.call(d3.axisBottom(newX))
    yAxis.call(d3.axisLeft(newY))

    // update circle position
    scatter
      .selectAll("circle")
      .attr("cx", function (d) { return newX(d[chiavi[0]]) } )
      .attr("cy", function (d) { return newY(d[chiavi[1]]) } )
  }
}

d3.csv(data_path, function(error, data) {
  chiavi = d3.keys(data[0])
  if (error) throw error;
    var l=data.length;
    for (i=0;i<l;i++) data[i].id=i
    draw_MDS(data)
})