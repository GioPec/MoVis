import {color_base, color_brushed, color_selected, color_tooltip_light, color_tooltip_dark} from "./functions.js"

const mapping = {
  "4": "year",
  "5": "budget",
  "6": "actual_budget",
  "7": "revenue",
  "8": "actual_revenue",
  "9": "runtime",
  "10": "vote_average",
  "11": "vote_count",
  "12": "popularity",
  "17": "in_connections",
  "18": "out_connections",
  "19": "tot_connections",
}

var data_used_x = []
var data_used_y = []
var svg_area_3;
var space = 120

var used_ids = []
var bubble_range = []
var isBrushed = false
//var DATASET_PATH = "../datasets/DATASET_MDS_250.csv"
//var DATASET_PATH = "../datasets/dataset_fake.csv"
var DATASET_PATH = "../datasets/DATASET_MDS_NEW.csv"

function checkIfDarkMode() {
  return document.getElementById("darkModeCheckbox").checked
}

function get_group() {
  return document.getElementById("opt_groupby").value
}

export function compute_array(colonna_x, colonna_y, ids_update, bubble_update_range, changing_axis, isBrushedup){
  isBrushed = isBrushedup
  if(!changing_axis){used_ids = ids_update;}
  
  if(bubble_update_range != null){bubble_range = bubble_update_range;}
  
  data_used_x = []
  data_used_y = []
  
  d3v6.csv(DATASET_PATH, function(row) {

    var range_check = bubble_range.length == 0

    
    //console.log("lenght: ",  bubble_range.length)
    //console.log("check_1: ", range_check)
    
    if(!range_check){
      //console.log("val_: ",mapping[get_group()])
      range_check = ( (parseInt(row[mapping[get_group()]])  >= parseInt(bubble_range[0])) && 
                    (parseInt(row[mapping[get_group()]])  <= parseInt(bubble_range[1])) )
    
    }
    
    if(range_check){
      
      if((used_ids!=null) && ((used_ids.length == 0) || (used_ids.includes(row.imdb_id)))){
        data_used_x.push(parseInt(row[colonna_x]))
        data_used_y.push(parseInt(row[colonna_y]))
      }
    }

  }).then(function() {
    
    d3.select("#svg_area_3_x").remove()
    svg_area_3 = d3v6.select("#area_3")
      .append("svg")
      .attr("id", "svg_area_3_x")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 295 300")
      .classed("svg-content", true);

    draw_boxplot_x(colonna_x)
    draw_boxplot_y(colonna_y)
  })
}

function draw_boxplot_x(colonna_x){

  //console.log("data_used_x: ", data_used_x)

  // append the svg object to the body of the page

  var boxplot_x = svg_area_3.append("g")
    .classed("area_3_g_x", true)
    .attr("transform",
      "translate(" + 30 + "," + 50 + "), scale(0.8)")

  boxplot_x.append("text")
    .attr("class", function(){
      return (checkIfDarkMode()) ? ("lightfill") : ("darkfill")
    })
    .style("font-size", "20px")
    .attr("transform",
      "translate(" + 120 + "," + -15 + "), scale(0.8)")
    .text(colonna_x)

  // Compute summary statistics used for the box:
  var data_sorted = data_used_x.sort(d3v6.ascending)
  //console.log(data_sorted)
  var q1 = d3v6.quantile(data_sorted, .25)
  var median = d3v6.quantile(data_sorted, .5)
  var q3 = d3v6.quantile(data_sorted, .75)
  var interQuantileRange = q3 - q1
  //var min = q1 - 1.5 * interQuantileRange
  //var max = q1 + 1.5 * interQuantileRange
  var min = data_sorted.at(0)
  var max = data_sorted.at(-1)

  /*
  console.log("q1: ", q1)
  console.log("q3: ", q3)
  console.log("median: ", median)
  console.log("min: ", min)
  console.log("max: ", max)
  */
  // Show the Y scale

  var y_box = d3v6.scaleLinear()
    .domain([ min, max])
    .range([280, 0]);
  boxplot_x.call(d3v6.axisLeft(y_box));



  // Show the main vertical line
  if(data_used_x.length != 0){
    boxplot_x
  .append("line")
    .attr("x1", 200)
    .attr("x2", 200)
    .attr("y1", y_box(min) )
    .attr("y2", y_box(max) )
    .attr("class", function(){
      return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
    })
    //.attr("stroke", "black")
    //.attr("transform", "scale(0.6) translate(0,0)")
    .attr("transform", "translate("+(space*(-1))+",0)")
    
  
  // Show the box
  boxplot_x
  .append("rect")
    .attr("x", 200 - 100/2)
    .attr("y", y_box(q3) )
    .attr("height", (y_box(q1)-y_box(q3)) )
    .attr("width", 100 )
    .attr("class", function(){
      return (checkIfDarkMode()) ? ("box lightstroke") : ("box darkstroke")
    })
    //.attr("stroke", "black")
    .style("fill", function(){
      return (isBrushed) ? (color_brushed) : (color_base)})
    //.style("opacity", 0.6)
    .attr("transform", "translate("+(space*(-1))+",0)")

  // show median, min and max horizontal lines
  boxplot_x
  .selectAll("toto")
  .data([min, median, max])
  .enter()
  .append("line")
    .attr("x1", 200-100/2)
    .attr("x2", 200+100/2)
    .attr("y1", function(d){ return(y_box(d))} )
    .attr("y2", function(d){ return(y_box(d))} )
    //.attr("stroke", "black")
    .attr("class", function(){
      return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
    })
    .attr("transform", "translate("+(space*(-1))+",0)")
    }

    d3.select(".area_3_g_x").selectAll("text").attr("class", function(){
      return (checkIfDarkMode()) ? ("lightfill") : ("darkfill")
    })
    d3.select(".area_3_g_x").selectAll("line").attr("class", function(){
      return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
    })
    d3.select(".area_3_g_x").selectAll("path").attr("class", function(){
      return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
    })
}

function draw_boxplot_y(colonna_y){
  
    var boxplot_y = svg_area_3.append("g")
      .classed("area_3_g_y", true)
    .attr("transform",
          "translate(" + 180 + "," + 50 + "), scale(0.8)")

    boxplot_y.append("text")
    //.style("fill", "black")
    .attr("class", function(){
      return (checkIfDarkMode()) ? ("lightfill") : ("darkfill")
    })
    .style("font-size", "20px")
    .text(colonna_y)
    .attr("transform",
          "translate(" + 120 + "," + -15 + "), scale(0.8)")
  
  // Compute summary statistics used for the box:
  var data_sorted = data_used_y.sort(d3v6.ascending)
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
  console.log("q1: ", q1)
  console.log("q3: ", q3)
  console.log("median: ", median)
  console.log("min: ", min)
  console.log("max: ", max)
  */
  // Show the Y scale
  
  var y_box = d3v6.scaleLinear()
    .domain([ min, max])
    .range([280, 0])
  boxplot_y.call(d3v6.axisLeft(y_box));
  
  
  // Show the main vertical line
  if(data_used_y.length != 0){

    boxplot_y
  .append("line")
    .attr("x1", 200)
    .attr("x2", 200)
    .attr("y1", y_box(min) )
    .attr("y2", y_box(max) )
    .attr("class", function(){
      return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
    })
    //.attr("transform", "scale(0.6) translate(0,0)")
    .attr("transform", "translate("+(space*(-1))+",0)")
    
  
  // Show the box
  boxplot_y
  .append("rect")
    .attr("x", 200 - 100/2)
    .attr("y", y_box(q3) )
    .attr("height", (y_box(q1)-y_box(q3)) )
    .attr("width", 100 )
    .attr("class", function(){
      return (checkIfDarkMode()) ? ("box lightstroke") : ("box darkstroke")
    })
    .style("fill", function(){
      return (isBrushed) ? (color_brushed) : (color_base)})
    //.style("opacity", 0.6)
    .attr("transform", "translate("+(space*(-1))+",0)")
  
  // show median, min and max horizontal lines
  boxplot_y
  .selectAll("toto")
  .data([min, median, max])
  .enter()
  .append("line")
    .attr("x1", 200-100/2)
    .attr("x2", 200+100/2)
    .attr("y1", function(d){ return(y_box(d))} )
    .attr("y2", function(d){ return(y_box(d))} )
    .attr("class", function(){
      return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
    })
    .attr("transform", "translate("+(space*(-1))+",0)")

  }

  d3.select(".area_3_g_y").selectAll("text").attr("class", function(){
    return (checkIfDarkMode()) ? ("lightfill") : ("darkfill")
  })
  d3.select(".area_3_g_y").selectAll("line").attr("class", function(){
    return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
  })
  d3.select(".area_3_g_y").selectAll("path").attr("class", function(){
    return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
  })
/*
  if(bubble_range != null){
    d3.selectAll(".box").style("fill", function(){
      return (bubble_range.length == 0) ? "color_base ": color_selected
    }) 
  }
*/

  if(bubble_range != null){
    d3.selectAll(".box").style("fill", function(){

      if(bubble_range.length == 0){
        if(isBrushed){return color_brushed}
        else{return color_base}
      }
      else{return color_selected}
    })
  }

  
  
}

compute_array("budget", "revenue", [], [], true, false)

export function boxplotReadCSV(ds) {
  DATASET_PATH = ds
  compute_array("budget", "revenue", [], [], true, false) /// occhio
}

