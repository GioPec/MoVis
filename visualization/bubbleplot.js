var data_x = []
var data_y = []
var data_xy = []


var margin_top= 5, 
margin_right= 2, 
margin_bottom= 1, 
margin_left= 2

var width = 500 - margin_left - margin_right
var height = 300 - margin_top - margin_bottom

var x
var y
  


function draw_bubbleplot_2(data){   

  function update_bubble_x(x_col){
  
    x.domain(d3.extent(data, function(d) { return +d[chiavi[x_col]]; }));
    xAxis.call(d3.axisBottom(x))
  
    cerchi = d3.select("#area_2_circles").selectAll(".dot");
    cerchi.transition().duration(1000).attr("cx", function (d) { return x(d[chiavi[x_col]]) } )
    
  }

  function update_bubble_y(y_col){
  
    y.domain(d3.extent(data, function(d) { return +d[chiavi[y_col]]; }));
    yAxis.call(d3.axisLeft(y))
  
    cerchi = d3.select("#area_2_circles").selectAll(".dot");
    cerchi.transition().duration(1000).attr("cy", function (d) { return y(d[chiavi[y_col]]) } )
    
  }

  function groupping(criterio){

    
    data_grupped = d3.nest()
    .key(function(d) {return d.year})
    .sortKeys(d3.ascending)
    .entries(data)
  }



  menu = d3.select("#area_2").append("div")

  menu.style("width", "100%")
  .style("height", "10%")
  .style("background", "rgb(225, 213, 168)")
  .style("font-size", "20px")

  menu.append("label").text("X: ")
  select_opt = menu.append("select").on("change", function() {
    update_bubble_x(this.value,);
 })
  select_opt.append("option").attr("value","4").text("Year")
  select_opt.append("option").attr("value","5").attr("selected","true").text("Budget")
  select_opt.append("option").attr("value","6").text("Revenue")
  select_opt.append("option").attr("value","7").text("Runtime")
  select_opt.append("option").attr("value","8").text("Average vote")
  select_opt.append("option").attr("value","9").text("Votes count")
  select_opt.append("option").attr("value","10").text("Popularity")
  select_opt.append("option").attr("value","15").text("In connections")
  select_opt.append("option").attr("value","16").text("Out connections")
  select_opt.append("option").attr("value","17").text("Total connections")

  menu.append("label").text("Y: ")
  select_opt_Y = menu.append("select").on("change", function() {
    update_bubble_y(this.value);
 })
  select_opt_Y.append("option").attr("value","4").text("Year")
  select_opt_Y.append("option").attr("value","5").text("Budget")
  select_opt_Y.append("option").attr("value","6").attr("selected","true").text("Revenue")
  select_opt_Y.append("option").attr("value","7").text("Runtime")
  select_opt_Y.append("option").attr("value","8").text("Average vote")
  select_opt_Y.append("option").attr("value","9").text("Votes count")
  select_opt_Y.append("option").attr("value","10").text("Popularity")
  select_opt_Y.append("option").attr("value","15").text("In connections")
  select_opt_Y.append("option").attr("value","16").text("Out connections")
  select_opt_Y.append("option").attr("value","17").text("Total connections")


  menu.append("label").text("G: ")
  select_opt_GroupBy = menu.append("select").on("change", function() {
    //update_bubble_y(this.value);
 })
  select_opt_GroupBy.append("option").attr("value","4").text("Year")
  select_opt_GroupBy.append("option").attr("value","5").text("Budget")
  select_opt_GroupBy.append("option").attr("value","6").attr("selected","true").text("Revenue")
  select_opt_GroupBy.append("option").attr("value","7").text("Runtime")
  select_opt_GroupBy.append("option").attr("value","8").text("Average vote")
  select_opt_GroupBy.append("option").attr("value","9").text("Votes count")
  select_opt_GroupBy.append("option").attr("value","10").text("Popularity")
  select_opt_GroupBy.append("option").attr("value","15").text("In connections")
  select_opt_GroupBy.append("option").attr("value","16").text("Out connections")
  select_opt_GroupBy.append("option").attr("value","17").text("Total connections")

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

var svg_2 = d3.select("#area_2")
.append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 300 165")
  //.style("background-color", "yellow")
  .classed("svg-content", true)

x = d3.scaleLinear().range([0, width-250])
y = d3.scaleLinear().range([height-160, 0])

var xAxis = svg_2.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(30," + 146.5 + ")")
  .call(d3.axisBottom(x))
  .attr("font-size", "6px")
  
var yAxis = svg_2.append("g")
  .attr("class", "axis axis--y")
  .attr("transform", "translate(30," + 12 + ")")
  .call(d3.axisLeft(y))
  .attr("font-size", "6px")

  
  x.domain(d3.extent(data, function(d) { return +d[chiavi[5]]; }));
  y.domain(d3.extent(data, function(d) { return +d[chiavi[6]]; }));

//x.domain([d3.min(+d[chiavi[5]]), 1.05*d3.max(+d[chiavi[5]])]);
//y.domain([d3.min(+d[chiavi[6]]), 1.05*d3.max(+d[chiavi[6]])]);

xAxis.call(d3.axisBottom(x))
yAxis.call(d3.axisLeft(y))

// Add a clipPath: everything out of this area won't be drawn.
var clip = svg_2.append("defs").append("SVG:clipPath")

  .attr("id", "clip")
  
  .append("SVG:rect")
  .style("background-color", "yellow")
  .attr("width",  width-250)
  .attr("height", height-160 )
  .attr("x", 0)
  .attr("y", 0)
  .attr("transform", "translate(30," + 12 + ")")

var scatter = svg_2.append('g')
.attr("id", "area_2_circles")
.attr("clip-path", "url(#clip)")
.attr("transform", "translate(30," + 12 + ")")

//.style("height", "100%")

// Add circles
scatter

  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr('class', 'dot')
    .attr("cx", function (d) {  return x(d[chiavi[5]]) } )
    .attr("cy", function (d) {  return y(d[chiavi[6]]) } )
    .attr("r", 1)
    .attr("id", function (d) { return d[chiavi[2]] })
    .attr("name", function (d) { return d["title"] } )
    .style("fill", "rgb(66, 172, 66)") // #ff0099
    .style("stroke", "black")
    .style("stroke-width", "0.2") 
    .style("opacity", 0.8)
    .style("pointer-events", "all")
}

d3.csv("../datasets/dataset_mds_500.csv", function(error, data) {
  chiavi = d3.keys(data[0])
  console.log(chiavi)
  if (error) throw error;
    var l=data.length;
    for (i=0;i<l;i++) data[i].id=i
    draw_bubbleplot_2(data)
})
//load_axis()