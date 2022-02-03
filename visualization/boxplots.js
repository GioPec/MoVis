
var data_used = []

function compute_array(){

  
 
  d3v6.csv("../datasets/dataset_mds_500.csv", function(row) {
    
    //console.log(row.budget)
    data_used.push(parseInt(row.runtime))
  

  }).then(function() {
    
   // console.log(data_used)
    draw_boxplots()

  })

}


function draw_boxplots(){


// append the svg object to the body of the page
var svg_area_3 = d3v6.select("#area_3")
.append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 300 252")
    .classed("svg-content", true)
  .append("g")
    .classed("area_3_g", true)
  .attr("transform",
        "translate(" + 30 + "," + 16 + ")")
  
  
// create dummy data
var data_fake = [25,28.0,29,29,30,34,35,35,37,38,10,-1,10,6]
//console.log(data_used[0][0])



// Compute summary statistics used for the box:
var data_sorted = data_used.sort(d3v6.ascending)
//console.log(data_sorted)
var q1 = d3v6.quantile(data_sorted, .25)
var median = d3v6.quantile(data_sorted, .5)
var q3 = d3v6.quantile(data_sorted, .75)
var interQuantileRange = q3 - q1
//var min = q1 - 1.5 * interQuantileRange
//var max = q1 + 1.5 * interQuantileRange
var min = data_sorted.at(0)
var max= data_sorted.at(-1)
/*
console.log("median", median)
console.log("min", min)
console.log("max", max)
console.log("q1", q1)
console.log("q3", q3)
console.log("what", parseInt(max)+(parseInt(max)-parseInt(min))/10)
*/
// Show the Y scale

var y_box = d3v6.scaleLinear()
  //.domain([ parseInt(min)-(parseInt(max)-parseInt(min))/10, parseInt(max)+(parseInt(max)-parseInt(min))/10])
  .domain([ min, max])
  .range([220, 0]);
svg_area_3.call(d3v6.axisLeft(y_box));

//console.log("y_box",y_box(0))

// a few features for the box


// Show the main vertical line

svg_area_3
.append("line")
  .attr("x1", 200)
  .attr("x2", 200)
  .attr("y1", y_box(min) )
  .attr("y2", y_box(max) )
  .attr("stroke", "black")
  //.attr("transform", "scale(0.6) translate(0,0)")
  .attr("transform", "translate(-100,0)")
  

// Show the box
svg_area_3
.append("rect")
  .attr("x", 200 - 100/2)
  .attr("y", y_box(q3) )
  .attr("height", (y_box(q1)-y_box(q3)) )
  .attr("width", 100 )
  .attr("stroke", "black")
  .style("fill", "#69b3a2")
  .attr("transform", "translate(-100,0)")

// show median, min and max horizontal lines
svg_area_3
.selectAll("toto")
.data([min, median, max])
.enter()
.append("line")
  .attr("x1", 200-100/2)
  .attr("x2", 200+100/2)
  .attr("y1", function(d){ return(y_box(d))} )
  .attr("y2", function(d){ return(y_box(d))} )
  .attr("stroke", "black")
  .attr("transform", "translate(-100,0)")
}



compute_array()