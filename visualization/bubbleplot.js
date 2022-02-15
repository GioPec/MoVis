import {compute_array} from "./boxplots.js"
import {color_base, color_brushed, color_selected, color_tooltip_light, color_tooltip_dark} from "./functions.js"

var DATASET_PATH = "../datasets/DATASET_MDS_250.csv"
//var DATASET_PATH = "../datasets/dataset_fake.csv"
//var data = null
function checkIfDarkMode() {
  return document.getElementById("darkModeCheckbox").checked
}

var margin_top= 5, 
margin_right= 2, 
margin_bottom= 1, 
margin_left= 2

var width = 500 - margin_left - margin_right
var height = 300 - margin_top - margin_bottom

var chiavi

var x
var y
var xAxis
var yAxis

var x_col
var y_col

var criterio = null

var bubble_flag = false

var selected_ids = []
var chord_ids = []
var brushed_ids = []

var tooltip = d3.select("body")
.append("div")
.attr("id", "tooltip2")
.style("background-color", "rgb(225, 213, 168)")
.style("position", "absolute")
.style("z-index", "10")
.style("visibility", "hidden")
.style("font-size", "20px")
.text("a simple tooltip");

function update(data_updated){

  //console.log("selected_ids_up: ", selected_ids)
  if(chord_ids == null){selected_ids = null}
  compute_array(x_col, y_col, selected_ids, [], false, brushed_ids.length != 0)
  if(!bubble_flag){
      var cerchi = d3.select("#area_2_circles")
      .selectAll(".dot")
      .style("fill", function (d) {
       if(brushed_ids.includes(d.imdb_id)){
        return color_brushed
       }
       return color_base
      }) 
      var cerchi = d3.select("#area_2_circles")
      .selectAll(".dot")
      .style("display", function (d) {
        if((chord_ids != null) && ((chord_ids.includes(d.imdb_id)) || (chord_ids.length == 0))){return null}
        //if((chord_ids.includes(d.imdb_id)) || (chord_ids.length == 0)){return null}
        return "none"
      })
  }
  else{
    var sorted_bubbles = null
    
    if(criterio == "4"){ sorted_bubbles = group_by_year(data_updated, true, true)}
    else if(criterio == "10"){sorted_bubbles = group_by_vote(data_updated, true, true)}
    else{sorted_bubbles = group_by_all(data_updated, true, true)}

    //ray domain
    var ray = d3.scaleLinear().range([2, 30])
    var minimum_not_zero = sorted_bubbles[0]["n"];

    for (let i=0; i<sorted_bubbles.length; i++) {
      if( ((i+1) ==  sorted_bubbles.length) || (sorted_bubbles[i+1]["n"] == 0) ){
        minimum_not_zero = sorted_bubbles[i]["n"]
        break;
      }
    }
  
    var ray_domain = [minimum_not_zero, sorted_bubbles[0]["n"] ]
    
    ray_domain[0] = Math.sqrt((ray_domain[0]/Math.PI))
    ray_domain[1] = Math.sqrt((ray_domain[1]/Math.PI))
    ray.domain(ray_domain);
    
    /// add bubbles
    var bolle =d3.select("#area_2_circles").selectAll(".bubble").data(sorted_bubbles);
    
      bolle.attr("cx", function (d) { return x(d.x)});
      bolle.attr("cy", function (d) { return y(d.y) })
      bolle.style("fill", function (d) { 
        if(brushed_ids.length != 0){return color_brushed}
        else{return color_base}
      });

      bolle.transition().duration(1000)
      .attr("r", function (d) { 
        if(d.n != 0){return  +ray(Math.sqrt((d.n/Math.PI)))}
      });
  }

  d3.select("#svg_2").selectAll("text").attr("class", function(){
    return (checkIfDarkMode()) ? ("lightfill") : ("darkfill")
  })
  d3.select("#svg_2").selectAll("line").attr("class", function(){
    return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
  })
  d3.select("#svg_2").selectAll("path").attr("class", function(){
    return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
  })
}

function group_by_all(data_to_use, use_x, use_y){

  var data_grupped_avg = d3.nest()
  .key(function(d) {return d[chiavi[criterio]]})
  .sortKeys(d3.ascending)
  .entries(data_to_use)

  var min_key = null
  var max_key = null
  

  for(let i=0; i<data_grupped_avg.length; i++){
    if(min_key == null){
      min_key = parseInt(data_grupped_avg[i]["key"])
      max_key = parseInt(data_grupped_avg[i]["key"])
    }
    else{
      if(min_key > parseInt(data_grupped_avg[i]["key"])){
        min_key = parseInt(data_grupped_avg[i]["key"])
      }
      if(max_key <  parseInt(data_grupped_avg[i]["key"])){
        max_key = parseInt(data_grupped_avg[i]["key"])
      }
    }
  }
  
  var start = min_key
  var end = max_key
  var step = parseInt((max_key - min_key)/10)


  var dict_bubbles = {}
  for (let i=start; i<end; i=i+step) {
    var upper_margin = i+step-1
    if( (upper_margin+step >= end) && (upper_margin <= end) ){upper_margin = end +1}
    if((use_x) && (use_y)) {dict_bubbles[i] = {"x":[], "y":[], "n":0, "range": i+"-"+(upper_margin)}}
    else if((use_x) && (!use_y)) {dict_bubbles[i] = {"x":[],"n":0, "range": i+"-"+(upper_margin)}}
    else if((!use_x) && (use_y)) {dict_bubbles[i] = {"y":[], "n":0, "range": i+"-"+(upper_margin)}}
  }

  var k = Object.keys(dict_bubbles)
  
 
  for (let i=0; i<data_to_use.length; i++) {
    if( (selected_ids != null) && ((selected_ids.length == 0) || (selected_ids.includes(data_to_use[i].imdb_id)))){    
      for (let j=0; j<k.length; j++) {
        var min_limit = parseInt(k[j])
        var upper_margin = min_limit+step-1
        if( (upper_margin+step >= end) && (upper_margin <= end) ){upper_margin = end +1}
        var max_limit = upper_margin /// ???
        var data_to_use_criterio = parseInt(data_to_use[i][chiavi[criterio]])
        if( ( data_to_use_criterio >= min_limit ) && ( data_to_use_criterio <= max_limit ) ){
          if(use_x){dict_bubbles[k[j]]['x'].push(parseInt(data_to_use[i][x_col]))}
          if(use_y){dict_bubbles[k[j]]['y'].push(parseInt(data_to_use[i][y_col]))}
          dict_bubbles[k[j]]['n']+=1
          break
        }
      }
    }
  }

  var bubbles = []
  for(let i =0; i< k.length;i++){
    bubbles.push(dict_bubbles[k[i]])
    if(use_x){bubbles[i].x = bubbles[i].x.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].x.length}
    if(use_y){bubbles[i].y = bubbles[i].y.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].y.length}
  }
 
  /// fade circles
  var cerchi = d3.select("#area_2_circles").selectAll(".dot").transition().duration(800).style("opacity", "0")
  cerchi.remove(); // mettere transizione
  ///

 


  /// TEST
  var min_x = 0
  var max_x = 0

  var min_y = 0
  var max_y = 0
  
  
  for(let i =0; i< k.length;i++){
    
    if((use_x) && (isNaN(bubbles[i].x))){
      bubbles[i].x = 0
      bubbles[i].n = 0
    }

    if((use_y) && (isNaN(bubbles[i].y))){
      bubbles[i].y = 0
      bubbles[i].n = 0
    }
    if(use_x){
      if(bubbles[i].x > max_x){max_x = bubbles[i].x}
      if((min_x == 0) || ((bubbles[i].x < min_x)) && (bubbles[i].x != 0)){min_x = bubbles[i].x}
    }
    if(use_y){
      if(bubbles[i].y > max_y){max_y = bubbles[i].y}
      if((min_y == 0) || ((bubbles[i].y < min_y)) && (bubbles[i].y != 0)){min_y = bubbles[i].y}
    }
  
  }

  //console.log("bubbles: ", bubbles)
  
  if(use_x){

    /// change range for bubbles
    var range_x = d3.extent(bubbles, function(d) { return +d.x; })
    range_x = [min_x, max_x]
    
    var padding_x = parseInt((range_x[1] - range_x[0])/5)
    //range_x[0]=(range_x[0]-10) - ((range_x[0]-10)%10)
    //range_x[1]=range_x[1] - ((range_x[0]-10)%10) +10
    range_x[0] = range_x[0] - padding_x -1
    range_x[1] = range_x[1] + padding_x +1
    
    x.domain(range_x);
    xAxis.call(d3.axisBottom(x))

  }
  
  if(use_y){

    var range_y = d3.extent(bubbles, function(d) { return +d.y; })
    range_y = [min_y, max_y]
    
    var padding_y = parseInt((range_y[1] - range_y[0])/5)
    //range_y[0]=(range_y[0]-10) - ((range_y[0]-10)%10)
    //range_y[1]=range_y[1] - ((range_y[0]-10)%10) +10
    range_y[0] = range_y[0] - padding_y -1
    range_y[1] = range_y[1] + padding_y +1
    
    y.domain(range_y);
    yAxis.call(d3.axisLeft(y))

  }
  var sorted_bubbles =sort_bubble(bubbles)


  return sorted_bubbles

  

}

function group_by_year(data_to_use, use_x, use_y){


  var data_grupped_avg = d3.nest()
    .key(function(d) {return d.year})
    .sortKeys(d3.ascending)
    .entries(data_to_use)

    
    var step = 10 // magari sarà un parametro
    var start = data_grupped_avg[0].key-(data_grupped_avg[0].key % step)
    var end = data_grupped_avg[data_grupped_avg.length-1].key-(data_grupped_avg[data_grupped_avg.length-1].key % step)

    var dict_bubbles = {}
    for (let i=start; i<end+step; i=i+step) {
      if(use_x && use_y){dict_bubbles[i] = {"x":[], "y":[], "n":0, "range": i+"-"+(i+step-1)} }
      else if (use_x && !use_y){dict_bubbles[i] = {"x":[], "n":0, "range": i+"-"+(i+step-1)}}
      else if (!use_x && use_y){dict_bubbles[i] = {"y":[], "n":0, "range": i+"-"+(i+step-1)}}
      
      
    }

    //console.log("dict_bubbles: ", dict_bubbles)
    for (let i=0; i<data_to_use.length; i++) { 
      
      if( (selected_ids != null) && ((selected_ids.length == 0) || (selected_ids.includes(data_to_use[i].imdb_id)))){
        var decade = data_to_use[i].year-(data_to_use[i].year % step)
        if(use_x){dict_bubbles[decade]['x'].push(parseInt(data_to_use[i][x_col]))}
        if(use_y){dict_bubbles[decade]['y'].push(parseInt(data_to_use[i][y_col]))}
        dict_bubbles[decade]['n']+=1
      }
      
    }
  var k = Object.keys(dict_bubbles)
  var bubbles = []
  for(let i =0; i< k.length;i++){
    bubbles.push(dict_bubbles[k[i]])
    if(use_x){bubbles[i].x = bubbles[i].x.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].x.length}
    if(use_y){bubbles[i].y = bubbles[i].y.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].y.length}
  }
 
  /// fade circles
  var cerchi = d3.select("#area_2_circles").selectAll(".dot").transition().duration(800).style("opacity", "0")
  cerchi.remove(); // mettere transizione
  ///

 


  /// TEST
  var min_x = 0
  var max_x = 0

  var min_y = 0
  var max_y = 0
  
  
  for(let i =0; i< k.length;i++){
    
    if((use_x) && (isNaN(bubbles[i].x))){
      bubbles[i].x = 0
      bubbles[i].n = 0
    }

    if((use_y) && (isNaN(bubbles[i].y))){
      bubbles[i].y = 0
      bubbles[i].n = 0
    }
    if(use_x){
      if(bubbles[i].x > max_x){max_x = bubbles[i].x}
      if((min_x == 0) || ((bubbles[i].x < min_x)) && (bubbles[i].x != 0)){min_x = bubbles[i].x}
    }
    if(use_y){
      if(bubbles[i].y > max_y){max_y = bubbles[i].y}
      if((min_y == 0) || ((bubbles[i].y < min_y)) && (bubbles[i].y != 0)){min_y = bubbles[i].y}
    }
  
  }

  //console.log("bubbles_346: ", bubbles)
  
  if(use_x){

    /// change range for bubbles
    var range_x = d3.extent(bubbles, function(d) { return +d.x; })
    range_x = [min_x, max_x]
    
    var padding_x = parseInt((range_x[1] - range_x[0])/5)
    //range_x[0]=(range_x[0]-10) - ((range_x[0]-10)%10)
    //range_x[1]=range_x[1] - ((range_x[0]-10)%10) +10
    range_x[0] = range_x[0] - padding_x -1
    range_x[1] = range_x[1] + padding_x +1
    
    x.domain(range_x);
    xAxis.call(d3.axisBottom(x))

  }
  
  if(use_y){

    var range_y = d3.extent(bubbles, function(d) { return +d.y; })
    range_y = [min_y, max_y]
    
    var padding_y = parseInt((range_y[1] - range_y[0])/5)
    //range_y[0]=(range_y[0]-10) - ((range_y[0]-10)%10)
    //range_y[1]=range_y[1] - ((range_y[0]-10)%10) +10
    range_y[0] = range_y[0] - padding_y -1
    range_y[1] = range_y[1] + padding_y +1
    
    y.domain(range_y);
    yAxis.call(d3.axisLeft(y))

  }
  var sorted_bubbles =sort_bubble(bubbles)


  return sorted_bubbles

  

}

function group_by_vote(data_to_use, use_x, use_y){


  var data_grupped_avg = d3.nest()
    .key(function(d) {return d.vote_average})
    .sortKeys(d3.ascending)
    .entries(data_to_use)

    
    var step = 1 
    var start = 0
    var end = 10

    var dict_bubbles = {}
    for (let i=start; i<end; i=i+step) {
      var upper_margin = i+step-0.1
      if( (upper_margin +0.1) == 10) {upper_margin = 10}
      if(use_x && use_y){dict_bubbles[i] = {"x":[], "y":[], "n":0, "range": i+"-"+(upper_margin)} }
      else if (use_x && !use_y){dict_bubbles[i] = {"x":[], "n":0, "range": i+"-"+(upper_margin)}}
      else if (!use_x && use_y){dict_bubbles[i] = {"y":[], "n":0, "range": i+"-"+(upper_margin)}}
    }

    for (let i=0; i<data_to_use.length; i++) { 
      if( (selected_ids != null) && ((selected_ids.length == 0) || (selected_ids.includes(data_to_use[i].imdb_id)))){
        var indice = parseInt(data_to_use[i].vote_average)
        if(indice == 10){indice=9}
        if(use_x){dict_bubbles[indice]['x'].push(parseInt(data_to_use[i][x_col]))}
        if(use_y){dict_bubbles[indice]['y'].push(parseInt(data_to_use[i][y_col]))}
        dict_bubbles[indice]['n']+=1
      }
    }

  //console.log("dict_bubbles_vote: ", dict_bubbles)
  var k = Object.keys(dict_bubbles)
  var bubbles = []
  for(let i =0; i< k.length;i++){
    bubbles.push(dict_bubbles[k[i]])
    if(use_x){bubbles[i].x = bubbles[i].x.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].x.length}
    if(use_y){bubbles[i].y = bubbles[i].y.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].y.length}
  }
 
  /// fade circles
  var cerchi = d3.select("#area_2_circles").selectAll(".dot").transition().duration(800).style("opacity", "0")
  cerchi.remove(); // mettere transizione
  ///

  var min_x = 0
  var max_x = 0

  var min_y = 0
  var max_y = 0
  
  
  for(let i =0; i< k.length;i++){
    
    if((use_x) && (isNaN(bubbles[i].x))){
      bubbles[i].x = 0
      bubbles[i].n = 0
    }

   //console.log(sorted_bubbles)
   // bolle.transition().duration(800).style("opacity", "0.6")
    /// add bubbles

/*     var bolle =d3.select("#area_2_circles").selectAll(".bubble").data(sorted_bubbles);
      bolle.attr("cx", function (d) { return x(d.x)});
      bolle.attr("cy", function (d) { return y(d.y) });
      bolle.attr("r",function (d) { 
        if(d.n == 0){return 0}
        else{return (d.n/10)+2}
      });
      bolle.style("fill", function (d) { 
        if (brushed_ids.length != 0) return color_brushed
        else return color_base
      }); */
      
    if((use_y) && (isNaN(bubbles[i].y))){
      bubbles[i].y = 0
      bubbles[i].n = 0
    }
    if(use_x){
      if(bubbles[i].x > max_x){max_x = bubbles[i].x}
      if((min_x == 0) || ((bubbles[i].x < min_x)) && (bubbles[i].x != 0)){min_x = bubbles[i].x}
    }
    if(use_y){
      if(bubbles[i].y > max_y){max_y = bubbles[i].y}
      if((min_y == 0) || ((bubbles[i].y < min_y)) && (bubbles[i].y != 0)){min_y = bubbles[i].y}
    }
  
  }

  //console.log("bubbles_vote: ", bubbles)
  
  if(use_x){

    /// change range for bubbles
    var range_x = d3.extent(bubbles, function(d) { return +d.x; })
    range_x = [min_x, max_x]
    
    var padding_x = parseInt((range_x[1] - range_x[0])/5)
    //range_x[0]=(range_x[0]-10) - ((range_x[0]-10)%10)
    //range_x[1]=range_x[1] - ((range_x[0]-10)%10) +10
    range_x[0] = range_x[0] - padding_x -1
    range_x[1] = range_x[1] + padding_x +1
    
    x.domain(range_x);
    xAxis.call(d3.axisBottom(x))

  }
  
  if(use_y){

    var range_y = d3.extent(bubbles, function(d) { return +d.y; })
    range_y = [min_y, max_y]
    
    var padding_y = parseInt((range_y[1] - range_y[0])/5)
    //range_y[0]=(range_y[0]-10) - ((range_y[0]-10)%10)
    //range_y[1]=range_y[1] - ((range_y[0]-10)%10) +10
    range_y[0] = range_y[0] - padding_y -1
    range_y[1] = range_y[1] + padding_y +1
    
    y.domain(range_y);
    yAxis.call(d3.axisLeft(y))

  }
  var sorted_bubbles =sort_bubble(bubbles)


  return sorted_bubbles

  

}
  
function sort_bubble(bubble){
  var ret = []
  for (let i=0; i<bubble.length; i++) {
    if(ret.length == 0 ){ ret.push(bubble[i]);}
    else{
      for (let j=0; j<ret.length; j++) {
        if(bubble[i]['n'] >= ret[j]['n']){
          ret.splice(j,0,bubble[i])
          break
        }
        else{if(j == ret.length-1){ret.push(bubble[i]);break}}
      }
    }
  }
  
  return ret
}

function draw_bubbleplot_2(data){   

 
  function update_bubble_x(x_col_updated){

    
    x_col = chiavi[x_col_updated]
    //update boxplot x
    compute_array(x_col, y_col, [], null, true,  brushed_ids.length != 0)
    
    if(!bubble_flag){
      x.domain(d3.extent(data, function(d) { return +d[x_col]; }));
      xAxis.call(d3.axisBottom(x))
    
      var cerchi = d3.select("#area_2_circles").selectAll(".dot");
      cerchi.transition().duration(1000).attr("cx", function (d) { return x(d[x_col]) } )
    }
    else{
        var sorted_bubbles = null
       
        if(criterio == "4"){ sorted_bubbles = group_by_year(data, true, false)}
        else if(criterio == "10"){sorted_bubbles = group_by_vote(data, true, false)}
        else{sorted_bubbles = group_by_all(data, true, false)}


        //ray domain
        var ray = d3.scaleLinear().range([2, 30])
        var minimum_not_zero = sorted_bubbles[0]["n"];

        for (let i=0; i<sorted_bubbles.length; i++) {
          if( ((i+1) ==  sorted_bubbles.length) || (sorted_bubbles[i+1]["n"] == 0) ){
            minimum_not_zero = sorted_bubbles[i]["n"]
            break;
          }
        }

        var ray_domain = [minimum_not_zero, sorted_bubbles[0]["n"] ]
        ray_domain[0] = Math.sqrt((ray_domain[0]/Math.PI))
        ray_domain[1] = Math.sqrt((ray_domain[1]/Math.PI))
        ray.domain(ray_domain);

        cerchi = d3.select("#area_2_circles").selectAll(".bubble").data(sorted_bubbles);
        cerchi.transition().duration(1000).attr("cx", function (d) {  return x(d.x) } )
    }

        //update dark mode colors
        d3.select("#svg_2").selectAll("text").attr("class", function(){
          return (checkIfDarkMode()) ? ("lightfill") : ("darkfill")
        })
        d3.select("#svg_2").selectAll("line").attr("class", function(){
          return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
        })
        d3.select("#svg_2").selectAll("path").attr("class", function(){
          return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
        })
  }

  function update_bubble_y(y_col_updated){

    
    y_col = chiavi[y_col_updated]
    //update boxplot y
    compute_array(x_col, y_col, [], null, true, brushed_ids.length != 0)
    
    if(!bubble_flag){
      y.domain(d3.extent(data, function(d) { return +d[y_col]; }));
      yAxis.call(d3.axisLeft(y))
      var cerchi = d3.select("#area_2_circles").selectAll(".dot");
      cerchi.transition().duration(1000).attr("cy", function (d) { return y(d[y_col]) } )
    }
    else{
      var sorted_bubbles = null
      
      if(criterio == "4"){ sorted_bubbles = group_by_year(data, false, true)}
      else if(criterio == "10"){sorted_bubbles = group_by_vote(data, false, true)}
      else{sorted_bubbles = group_by_all(data, false, true)}

      //ray domain
      var ray = d3.scaleLinear().range([2, 30])
      var minimum_not_zero = sorted_bubbles[0]["n"];

      for (let i=0; i<sorted_bubbles.length; i++) {
        if( ((i+1) ==  sorted_bubbles.length) || (sorted_bubbles[i+1]["n"] == 0) ){
          minimum_not_zero = sorted_bubbles[i]["n"]
          break;
        }
      }
  
    var ray_domain = [minimum_not_zero, sorted_bubbles[0]["n"] ]
    ray_domain[0] = Math.sqrt((ray_domain[0]/Math.PI))
    ray_domain[1] = Math.sqrt((ray_domain[1]/Math.PI))
    ray.domain(ray_domain);

      cerchi = d3.select("#area_2_circles").selectAll(".bubble").data(sorted_bubbles);
      cerchi.transition().duration(1000).attr("cy", function (d) {  return y(d.y) } )
  }

      //update dark mode colors
      d3.select("#svg_2").selectAll("text").attr("class", function(){
        return (checkIfDarkMode()) ? ("lightfill") : ("darkfill")
      })
      d3.select("#svg_2").selectAll("line").attr("class", function(){
        return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
      })
      d3.select("#svg_2").selectAll("path").attr("class", function(){
        return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
      })
  }

  function eliminate_groups(x_col, y_col){

    bubble_flag = false
    
    /// elimina bubble
    var cerchi = d3.select("#area_2_circles").selectAll(".bubble").transition().duration(800).style("opacity", "0"); // mettere transizione
    cerchi.remove()

    /// sistema assi
    x.domain(d3.extent(data, function(d) { return +d[x_col]; }));
    xAxis.call(d3.axisBottom(x))

    y.domain(d3.extent(data, function(d) {return +d[y_col]; }));
    yAxis.call(d3.axisLeft(y))

    /// riposiziona punti
    //console.log(selected_ids)
    var nuovi_cerchi = d3.select("#area_2_circles").selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr('class', 'dot')
      .attr("cx", function (d) { return x(d[x_col]) } )
      .attr("cy", function (d) {  return y(d[y_col]) } )
      .attr("r", 1)
      .attr("id", function (d) { return d[chiavi[2]] })
      .attr("name", function (d) { return d["title"] } )
      .style("fill", function (d) { 
        if ((selected_ids != null) && (selected_ids.includes(d.imdb_id))) return color_brushed
        else return color_base
      })
      .style("display", function (d) {
        
        if((chord_ids != null) && ((chord_ids.includes(d.imdb_id)) || (chord_ids.length == 0))){return null}
        return "none"
      })
      .style("stroke", "black")
      .style("stroke-width", "0.2") 
      .style("opacity", "0.0")
      .style("pointer-events", "all")
      .on("mouseover", function(d) {
        tooltip.html(d.title);
       return tooltip.style("visibility", "visible");
     })
     .on("mousemove", function() {
       return tooltip.style("top",
         (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
     })
     .on("mouseout", function() {
       return tooltip.style("visibility", "hidden");
      
     });
      
    nuovi_cerchi.transition().duration(800).style("opacity", "0.8")

    
    //update dark mode colors
    d3.select("#svg_2").selectAll("text").attr("class", function(){
      return (checkIfDarkMode()) ? ("lightfill") : ("darkfill")
    })
    d3.select("#svg_2").selectAll("line").attr("class", function(){
      return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
    })
    d3.select("#svg_2").selectAll("path").attr("class", function(){
      return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
    })
  }

  function groupping(criterio_update){
    criterio = criterio_update
    var sorted_bubbles = null;
    if(criterio == "20"){eliminate_groups(x_col, y_col); return}
    else if( (criterio == "4") ){sorted_bubbles = group_by_year(data, true, true)}
    else if( (criterio == "10") ){sorted_bubbles = group_by_vote(data, true, true)}
    else{sorted_bubbles = group_by_all(data, true, true)}

    if(bubble_flag == true){/*
      console.log("UPDATE BUBBLES")
      cerchi = d3.select("#area_2_circles").selectAll(".bubble").data(sorted_bubbles);
      cerchi.transition().duration(1000)
      .attr("r",function (d) { 
        if(d.n == 0){return 0}
        else{return (d.n/10)+2}
      })
      .attr("cx", function (d) {  return x(d.x) } )
      .attr("cy", function (d) {  return y(d.y) } )*/
      d3.select("#area_2_circles").selectAll(".bubble").remove()

    }

    //ray domain
    var ray = d3.scaleLinear().range([2, 30])
    var minimum_not_zero = sorted_bubbles[0]["n"];

    for (let i=0; i<sorted_bubbles.length; i++) {
      if( ((i+1) ==  sorted_bubbles.length) || (sorted_bubbles[i+1]["n"] == 0) ){
        minimum_not_zero = sorted_bubbles[i]["n"]
        break;
      }
    }
  
    var ray_domain = [minimum_not_zero, sorted_bubbles[0]["n"] ]
    ray_domain[0] = Math.sqrt((ray_domain[0]/Math.PI))
    ray_domain[1] = Math.sqrt((ray_domain[1]/Math.PI))
    ray.domain(ray_domain);
   
    /// END TEST
    bubble_flag = true
    /// add bubbles
    var bolle =d3.select("#area_2_circles").selectAll(".bubble")
    .data(sorted_bubbles)
    .enter().append("circle")
    .attr("id", function (d) {  return d.range } )
    .attr('class', 'bubble')
    .attr("cx", function (d) {  return x(d.x) } )
    .attr("cy", function (d) {  return y(d.y) } )
    .attr("r", "0")
    .style("cursor", "pointer")
    .style("fill", function (d) { 
      if (brushed_ids.length != 0) return color_brushed
      else return color_base
    })
    .attr("class", function(){
      return (checkIfDarkMode()) ? (" bubble lightstroke") : (" bubble darkstroke")
    })
    .style("stroke-width", "1") 
    .style("opacity", "0")
    .style("pointer-events", "all")
    .on("mouseover", function(d) {
    tooltip.html("<b>range: </b>"+d.range+",<br><b> n°_film:</b> "+d.n);
     return tooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
      return tooltip.style("top",(d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
    })
    .on("mouseout", function() { return tooltip.style("visibility", "hidden"); 
    })
    .on("click", function(d) {
      var colore = d3.select(this).style("fill")

      d3.selectAll(".bubble").style("fill", function (d) {  
        if (brushed_ids.length == 0) return color_base
        else return color_brushed
      })
      
      if (colore == color_selected) {
        d3.select(this).style("fill", function (d) {  
          
          if (brushed_ids.length == 0) return color_base
          else return color_brushed
          
        })
        compute_array(x_col, y_col, selected_ids, [],true, brushed_ids.length != 0)
      }
      else {
        d3.select(this).style("fill", color_selected)
        var bubble_range = d.range.split("-")
        compute_array(x_col, y_col, selected_ids, bubble_range,true, brushed_ids.length != 0)
      }
    });
    bolle.transition().duration(1000)
    .style("opacity", "0.6")
    .attr("r", function (d) { 
      if(d.n != 0){return  +ray(Math.sqrt((d.n/Math.PI)))}
    }
     
      
    );
    /*
    .attr("r",function (d) { 
      if(d.n == 0){return 0}
      else{return (d.n/10)+2}
    });*/
    //bolle.transition().duration(800)
    



    //update dark mode colors
    d3.select("#svg_2").selectAll("text").attr("class", function(){
      return (checkIfDarkMode()) ? ("lightfill") : ("darkfill")
    })
    d3.select("#svg_2").selectAll("line").attr("class", function(){
      return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
    })
    d3.select("#svg_2").selectAll("path").attr("class", function(){
      return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
    })
    
  }

  var menu = d3.select("#area_2").append("div")
    .attr("id", "bubble_toolbar")
    .style("width", "100%")
    .style("height", "10%")
    .style("background", "rgb(225, 213, 168)")
    .style("font-size", "20px")

  menu.append("label").text("ㅤX axis: ")
  var select_opt = menu.append("select").attr("id", "opt_x").on("change", function() {update_bubble_x(this.value)})
  select_opt.append("option").attr("value","4").attr("id", "year").text("Year")
  select_opt.append("option").attr("value","5").attr("id", "budget").attr("selected","true").text("Budget")
  select_opt.append("option").attr("value","6").attr("id", "actual_budget").text("Actual budget")
  select_opt.append("option").attr("value","7").attr("id", "revenue").text("Revenue")
  select_opt.append("option").attr("value","8").attr("id", "actual_revenue").text("Actual revenue")
  select_opt.append("option").attr("value","9").attr("id", "runtime").text("Runtime")
  select_opt.append("option").attr("value","10").attr("id", "vote_average").text("Average vote")
  select_opt.append("option").attr("value","11").attr("id", "vote_count").text("Votes count")
  //select_opt.append("option").attr("value","12").attr("id", "popularity").text("Popularity")
  select_opt.append("option").attr("value","17").attr("id", "in_connections").text("In connections")
  select_opt.append("option").attr("value","18").attr("id", "out_connections").text("Out connections")
  select_opt.append("option").attr("value","19").attr("id", "tot_connections").text("Total connections")

  menu.append("label").text("ㅤY axis: ")
  var select_opt_Y = menu.append("select").attr("id", "opt_y").on("change", function() {
    update_bubble_y(this.value)
 })
 select_opt_Y.append("option").attr("value","4").attr("id", "year").text("Year")
 select_opt_Y.append("option").attr("value","5").attr("id", "budget").text("Budget")
 select_opt_Y.append("option").attr("value","6").attr("id", "actual_budget").text("Actual budget")
 select_opt_Y.append("option").attr("value","7").attr("id", "revenue").attr("selected","true").text("Revenue")
 select_opt_Y.append("option").attr("value","8").attr("id", "actual_revenue").text("Actual revenue")
 select_opt_Y.append("option").attr("value","9").attr("id", "runtime").text("Runtime")
 select_opt_Y.append("option").attr("value","10").attr("id", "vote_average").text("Average vote")
 select_opt_Y.append("option").attr("value","11").attr("id", "vote_count").text("Votes count")
 //select_opt_Y.append("option").attr("value","12").attr("id", "popularity").text("Popularity")
 select_opt_Y.append("option").attr("value","17").attr("id", "in_connections").text("In connections")
 select_opt_Y.append("option").attr("value","18").attr("id", "out_connections").text("Out connections")
 select_opt_Y.append("option").attr("value","19").attr("id", "tot_connections").text("Total connections")


  menu.append("label").text("ㅤGroup by: ")
  var select_opt_GroupBy = menu.append("select").attr("id", "opt_groupby").on("change", function() {
    var select_x_col = document.getElementById('opt_x').selectedOptions[0].id
    var select_y_col = document.getElementById('opt_y').selectedOptions[0].id
    if(this.value == "999"){update([])}
    else{
      groupping(this.value, select_x_col.toLowerCase(), select_y_col.toLowerCase())
 
      
    }
 })
  select_opt_GroupBy.append("option").attr("value","4").text("Year")
  select_opt_GroupBy.append("option").attr("value","5").text("Budget")
  select_opt_GroupBy.append("option").attr("value","6").text("Actual budget")
  select_opt_GroupBy.append("option").attr("value","7").text("Revenue")
  select_opt_GroupBy.append("option").attr("value","8").text("Actual revenue")
  select_opt_GroupBy.append("option").attr("value","9").text("Runtime")
  select_opt_GroupBy.append("option").attr("value","10").text("Average vote")
  select_opt_GroupBy.append("option").attr("value","11").text("Votes count")
  //select_opt_GroupBy.append("option").attr("value","12").text("Popularity")
  select_opt_GroupBy.append("option").attr("value","17").text("In connections")
  select_opt_GroupBy.append("option").attr("value","18").text("Out connections")
  select_opt_GroupBy.append("option").attr("value","19").text("Total connections")
  select_opt_GroupBy.append("option").attr("value","20").attr("selected","true").text("None")

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

var svg_2 = d3.select("#area_2")
.append("svg")
  .attr("id", "svg_2")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 300 165")
  .classed("svg-content", true)

x = d3.scaleLinear().range([0, width-250])
y = d3.scaleLinear().range([height-160, 0])

xAxis = svg_2.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(30," + 146.5 + ")")
  .call(d3.axisBottom(x))
  .attr("font-size", "6px")

  
yAxis = svg_2.append("g")
  .attr("class", "axis axis--y")
  .attr("transform", "translate(30," + 12 + ")")
  .call(d3.axisLeft(y))
  .attr("font-size", "6px")

// Update global vars
x_col = chiavi[5]
y_col = chiavi[7]

x.domain(d3.extent(data, function(d) { return +d[x_col]; }));
y.domain(d3.extent(data, function(d) { return +d[y_col]; }));

xAxis.call(d3.axisBottom(x))
yAxis.call(d3.axisLeft(y))

// Add a clipPath: everything out of this area won't be drawn.
var clip = svg_2.append("defs").append("SVG:clipPath")
  .attr("id", "clip")
  .append("SVG:rect")
  .style("background-color", color_selected)
  .attr("width",  width-250)
  .attr("height", height-160 )
  .attr("x", 0)
  .attr("y", 0)
  .attr("transform", "translate(30," + 12 + ")")

var scatter = svg_2.append('g')
.attr("id", "area_2_circles")
.attr("clip-path", "url(#clip)")
.attr("transform", "translate(30," + 12 + ")")

// Add circles
scatter
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr('class', 'dot')
    .attr("cx", function (d) {  return x(d[x_col]) } )
    .attr("cy", function (d) {  return y(d[y_col]) } )
    .attr("r", 1)
    .attr("id", function (d) { return d[chiavi[2]] })
    .attr("name", function (d) { return d["title"] } )
    .style("fill", color_base) // #ff0099
    .style("stroke", "black")
    .style("stroke-width", "0.2") 
    .style("opacity", 0.8)
    .style("pointer-events", "all")
    .on("mouseover", function(d) {
      tooltip.html(d.title);
     return tooltip.style("visibility", "visible");
   })
   .on("mousemove", function() {
     return tooltip.style("top",
       (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
   })
   .on("mouseout", function() {
     return tooltip.style("visibility", "hidden");
    
   });
}



function start (ids){
  d3.csv("../datasets/DATASET_MDS_NEW.csv", function(error, data) {
    chiavi = d3.keys(data[0])
    
    if (error) throw error;
      var l=data.length;
      for (let i=0;i<l;i++) data[i].id=i
      //data = data
      draw_bubbleplot_2(data,false,ids)
  })

}

/// START
start([])

export function chord_to_bubble(brushed_ids_up, chord_ids_up, bubble_ids_up){

  selected_ids = bubble_ids_up;
  brushed_ids = brushed_ids_up
  chord_ids = chord_ids_up



  d3.csv("../datasets/DATASET_MDS_NEW.csv", function(error, data) {
    chiavi = d3.keys(data[0])
    
    if (error) throw error;
      var l=data.length;
      for (let i=0;i<l;i++) data[i].id=i
    //data = data
    
    update(data)
  })
}



