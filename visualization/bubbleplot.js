import{compute_array} from "./boxplots.js"

var DATASET_PATH = "../datasets/DATASET_MDS_NEW_500.csv"
//var DATASET_PATH = "../datasets/dataset_fake.csv"

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

var bubble_flag = false

var selected_ids = []
var chord_ids = []
var brushed_ids = []

var tooltip = d3.select("body")
.append("div")
.style("background", "rgba(225, 213, 168,0.8)")
.style("position", "absolute")
.style("z-index", "10")
.style("visibility", "hidden")
.style("font-size", "20px")
.text("a simple tooltip");


function update(data){

  //console.log("selected_ids_up: ", selected_ids)
  if(chord_ids == null){selected_ids = null}
  compute_array(x_col, y_col, selected_ids, [], false)


  if(!bubble_flag){

      
      
      var cerchi = d3.select("#area_2_circles")
      .selectAll(".dot")
      .style("fill", function (d) {
       if(brushed_ids.includes(d.imdb_id)){
        return "red"
       }
       return "rgb(66, 172, 66)"
      }) 

    
    
      //console.log(chord_ids != null)
      var cerchi = d3.select("#area_2_circles")
      .selectAll(".dot")
      .style("display", function (d) {
        if((chord_ids != null) && ((chord_ids.includes(d.imdb_id)) || (chord_ids.length == 0))){return null}
        //if((chord_ids.includes(d.imdb_id)) || (chord_ids.length == 0)){return null}
        return "none"
      })
    
      

  }
  else{

    

    var data_grupped_avg = d3.nest()
    .key(function(d) {return d.year})
    .sortKeys(d3.ascending)
    .entries(data)

    
    var step = 10 // magari sarà un parametro
    var start = data_grupped_avg[0].key-(data_grupped_avg[0].key % step)
    var end = data_grupped_avg[data_grupped_avg.length-1].key-(data_grupped_avg[data_grupped_avg.length-1].key % step)

    var dict_bubbles = {}
    for (let i=start; i<end+step; i=i+step) { dict_bubbles[i] = {"x":[], "y":[], "n":0, "decade": i+"-"+(i+step-1)} }

    for (let i=0; i<data.length; i++) { 
     
      if( (selected_ids!=null) && ( (selected_ids.length == 0) || (selected_ids.includes(data[i].imdb_id)))){
        var decade = data[i].year-(data[i].year % step)
        dict_bubbles[decade]['x'].push(parseInt(data[i][x_col]))
        dict_bubbles[decade]['y'].push(parseFloat(data[i][y_col]))
        dict_bubbles[decade]['n']+=1
      }
    }
   
  

    var bubbles = []
    //console.log("check_null: ",dict_bubbles)
    var k = Object.keys(dict_bubbles)
    for(let i =0; i< k.length;i++){
      bubbles.push(dict_bubbles[k[i]])
      bubbles[i].x = bubbles[i].x.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].x.length
      bubbles[i].y = bubbles[i].y.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].y.length
    }

    bubble_flag = true

    var min_x = 0
    var max_x = 0

    var min_y = 0
    var max_y = 0
    
    
    for(let i =0; i< k.length;i++){
      
      if( isNaN(bubbles[i].x)){
        bubbles[i].x = 0
        bubbles[i].y = 0
        bubbles[i].n = 0
      }

      if(bubbles[i].x > max_x){max_x = bubbles[i].x}
      if(bubbles[i].y > max_y){max_y = bubbles[i].y}
      

      if((min_x == 0) || ((bubbles[i].x < min_x)) && (bubbles[i].x != 0)){min_x = bubbles[i].x}
      if((min_y == 0) || ((bubbles[i].y < min_y)) && (bubbles[i].y != 0)){min_y = bubbles[i].y}
    }

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

    var range_y = d3.extent(bubbles, function(d) { return +d.y; })
    range_y = [min_y, max_y]
    
    var padding_y = parseInt((range_y[1] - range_y[0])/5)
    //range_y[0]=(range_y[0]-10) - ((range_y[0]-10)%10)
    //range_y[1]=range_y[1] - ((range_y[0]-10)%10) +10
    range_y[0] = range_y[0] - padding_y -1
    range_y[1] = range_y[1] + padding_y +1
    
    y.domain(range_y);
    yAxis.call(d3.axisLeft(y))


    
    var sorted_bubbles =sort_bubble(bubbles)

    var scale_of_ray = d3.scaleLinear().range([0, 25])
    scale_of_ray .domain(d3.extent(sorted_bubbles, function(d) { return +d.n; }));
    

   //console.log(sorted_bubbles)
   // bolle.transition().duration(800).style("opacity", "0.6")
    /// add bubbles
    var bolle =d3.select("#area_2_circles").selectAll(".bubble").data(sorted_bubbles);
      bolle.attr("cx", function (d) { return x(d.x)});
      bolle.attr("cy", function (d) { return y(d.y) });
      bolle.attr("r",function (d) { 
        if(d.n == 0){return 0}
        else{return (d.n/10)+2}
      });
      bolle.style("fill", function (d) { 
        if(brushed_ids.length != 0){return "red"}
        else{return "rgb(66, 172, 66)"}
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
  
function sort_bubble(bubble){
  var ret = []
  for (let i=0; i<bubble.length; i++) {
    if(ret.length == 0 ){ ret.push(bubble[i])}
    else{
      for (let j=0; j<ret.length; j++) {
        if(bubble[i]['n'] >= ret[j]['n']){
          ret.splice(j,0,bubble[i])
          break
        }
        else{if(j == ret.length-1){ret.push(bubble[i])}}
      }
    }
  }
  return ret
}

function draw_bubbleplot_2(data){   

  

  function update_bubble_x(x_col_updated){

    
    x_col = chiavi[x_col_updated]
    console.log("x_col: ", x_col)
    //console.log("x_col: ", x_col)
    compute_array(x_col, y_col, [], null, true)
    
    if(!bubble_flag){

      //to boxplot
     
      

      x.domain(d3.extent(data, function(d) { return +d[x_col]; }));
      xAxis.call(d3.axisBottom(x))
    
      var cerchi = d3.select("#area_2_circles").selectAll(".dot");
      cerchi.transition().duration(1000).attr("cx", function (d) { return x(d[x_col]) } )
    }

    else{

        var data_grupped_avg = d3.nest()
        .key(function(d) {return d.year})
        .sortKeys(d3.ascending)
        .entries(data)
      
        var step = 10 // magari sarà un parametro
        var start = data_grupped_avg[0].key-(data_grupped_avg[0].key % step)
        var end = data_grupped_avg[data_grupped_avg.length-1].key-(data_grupped_avg[data_grupped_avg.length-1].key % step)

        var dict_bubbles = {}
        for (let i=start; i<end+step; i=i+step) { dict_bubbles[i] = {"x":[], "n":0, "decade":i+"-"+(i+step-1) }}

        //console.log("x_col", chiavi[x_col])
        
        for (let i=0; i<data.length; i++) {
          if( (selected_ids.length == 0) || (selected_ids.includes(data[i].imdb_id))){
            var decade = data[i].year-(data[i].year % step)
            dict_bubbles[decade]['x'].push(parseInt(data[i][x_col]))
            dict_bubbles[decade]['n']+=1
          } 
        }
        //console.log(dict_bubbles)
        var bubbles = []
        var k = Object.keys(dict_bubbles)
        for(let i =0; i< k.length;i++){
          bubbles.push(dict_bubbles[k[i]])
          bubbles[i].x = bubbles[i].x.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].x.length
        }
       
        var min_x = 0
        var max_x = 0

    
    
    for(let i =0; i< k.length;i++){
      
      if( isNaN(bubbles[i].x)){
        bubbles[i].x = 0
        
        bubbles[i].n = 0
      }

      if(bubbles[i].x > max_x){max_x = bubbles[i].x}
     
      

      if((min_x == 0) || ((bubbles[i].x < min_x)) && (bubbles[i].x != 0)){min_x = bubbles[i].x}
      
    }

        /// change range for bubbles
        
        var range_x = d3.extent(bubbles, function(d) {return +d.x; })
     
        
        range_x = [min_x, max_x]
        var padding_x = parseInt((range_x[1] - range_x[0])/5)
        //range_x[0]=(range_x[0]-10) - ((range_x[0]-10)%10)
        //range_x[1]=range_x[1] - ((range_x[0]-10)%10) +10
        range_x[0] = range_x[0] - padding_x -1
        range_x[1] = range_x[1] + padding_x +1
        x.domain(range_x);
        xAxis.call(d3.axisBottom(x))

        
        

        var sorted_bubbles = sort_bubble(bubbles)

    

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
    //console.log("y_col: ", y_col)
    compute_array(x_col, y_col, [], null, true)
    
    if(!bubble_flag){
      y.domain(d3.extent(data, function(d) { return +d[y_col]; }));
      yAxis.call(d3.axisLeft(y))

      //to boxplot
      //compute_array(y_col)
    
      var cerchi = d3.select("#area_2_circles").selectAll(".dot");
      cerchi.transition().duration(1000).attr("cy", function (d) { return y(d[y_col]) } )
    }

    else{

        var data_grupped_avg = d3.nest()
        .key(function(d) {return d.year})
        .sortKeys(d3.ascending)
        .entries(data)
      
        var step = 10 // magari sarà un parametro
        var start = data_grupped_avg[0].key-(data_grupped_avg[0].key % step)
        var end = data_grupped_avg[data_grupped_avg.length-1].key-(data_grupped_avg[data_grupped_avg.length-1].key % step)

        var dict_bubbles = {}
        for (let i=start; i<end+step; i=i+step) { dict_bubbles[i] = {"y":[], "n":0, "decade":i+"-"+(i+step-1) }}

        //console.log("x_col", chiavi[x_col])
        
        for (let i=0; i<data.length; i++) {
          if( (selected_ids.length == 0) || (selected_ids.includes(data[i].imdb_id))){
            var decade = data[i].year-(data[i].year % step)
            dict_bubbles[decade]['y'].push(parseInt(data[i][y_col]))
            dict_bubbles[decade]['n']+=1
          } 
        }
        //console.log(dict_bubbles)
        var bubbles = []
        var k = Object.keys(dict_bubbles)
        for(let i =0; i< k.length;i++){
          bubbles.push(dict_bubbles[k[i]])
          bubbles[i].y = bubbles[i].y.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].y.length
        }

  
    
        var min_y = 0
        var max_y = 0
        
        
        for(let i =0; i< k.length;i++){
          
          if( isNaN(bubbles[i].y)){
            
            bubbles[i].y = 0
            bubbles[i].n = 0
          }
    
      
          if(bubbles[i].y > max_y){max_y = bubbles[i].y}
          
    
        
          if((min_y == 0) || ((bubbles[i].y < min_y)) && (bubbles[i].y != 0)){min_y = bubbles[i].y}
        }

        /// change range for bubbles
        
        var range_y = d3.extent(bubbles, function(d) {return +d.y; })
     
        
        range_y = [min_y, max_y]
        var padding_y = parseInt((range_y[1] - range_y[0])/5)
        //range_y[0]=(range_y[0]-10) - ((range_y[0]-10)%10)
        //range_y[1]=range_y[1] - ((range_y[0]-10)%10) +10
        range_y[0] = range_y[0] - padding_y -1
        range_y[1] = range_y[1] + padding_y +1
        y.domain(range_y);
        yAxis.call(d3.axisLeft(y))


        var sorted_bubbles = sort_bubble(bubbles)
        //console.log(sorted_bubbles)

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
        if((selected_ids != null) && (selected_ids.includes(d.imdb_id))){return "red"}
        else{return "rgb(66, 172, 66)"}
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

  function groupping(criterio){

    if(criterio == "20"){eliminate_groups(x_col, y_col); return}

    var data_grupped_avg = d3.nest()
    .key(function(d) {return d.year})
    .sortKeys(d3.ascending)
    .entries(data)

    
    var step = 10 // magari sarà un parametro
    var start = data_grupped_avg[0].key-(data_grupped_avg[0].key % step)
    var end = data_grupped_avg[data_grupped_avg.length-1].key-(data_grupped_avg[data_grupped_avg.length-1].key % step)

    var dict_bubbles = {}
    for (let i=start; i<end+step; i=i+step) { dict_bubbles[i] = {"x":[], "y":[], "n":0, "decade": i+"-"+(i+step-1)} }

    
    //console.log(selected_ids != null)
    for (let i=0; i<data.length; i++) { 
      
      if( (selected_ids != null) && ((selected_ids.length == 0) || (selected_ids.includes(data[i].imdb_id)))){
        var decade = data[i].year-(data[i].year % step)
        dict_bubbles[decade]['x'].push(parseInt(data[i][x_col]))
        dict_bubbles[decade]['y'].push(parseFloat(data[i][y_col]))
        dict_bubbles[decade]['n']+=1
      }
      
    }

    
    var bubbles = []
    var k = Object.keys(dict_bubbles)
    for(let i =0; i< k.length;i++){
      bubbles.push(dict_bubbles[k[i]])
      bubbles[i].x = bubbles[i].x.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].x.length
      bubbles[i].y = bubbles[i].y.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].y.length
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
      
      if( isNaN(bubbles[i].x)){
        bubbles[i].x = 0
        bubbles[i].y = 0
        bubbles[i].n = 0
      }

      if(bubbles[i].x > max_x){max_x = bubbles[i].x}
      if(bubbles[i].y > max_y){max_y = bubbles[i].y}
      

      if((min_x == 0) || ((bubbles[i].x < min_x)) && (bubbles[i].x != 0)){min_x = bubbles[i].x}
      if((min_y == 0) || ((bubbles[i].y < min_y)) && (bubbles[i].y != 0)){min_y = bubbles[i].y}
    }

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

    var range_y = d3.extent(bubbles, function(d) { return +d.y; })
    range_y = [min_y, max_y]
    
    var padding_y = parseInt((range_y[1] - range_y[0])/5)
    //range_y[0]=(range_y[0]-10) - ((range_y[0]-10)%10)
    //range_y[1]=range_y[1] - ((range_y[0]-10)%10) +10
    range_y[0] = range_y[0] - padding_y -1
    range_y[1] = range_y[1] + padding_y +1
    
    y.domain(range_y);
    yAxis.call(d3.axisLeft(y))


    
    var sorted_bubbles =sort_bubble(bubbles)


    /// END TEST
    bubble_flag = true
    /// add bubbles
    var bolle =d3.select("#area_2_circles").selectAll(".bubble")
    .data(sorted_bubbles)
    .enter().append("circle")
    .attr("id", function (d) {  return d.decade } )
    .attr('class', 'bubble')
    .attr("cx", function (d) {  return x(d.x) } )
    .attr("cy", function (d) {  return y(d.y) } )
    .attr("r",function (d) { 
      if(d.n == 0){return 0}
      else{return (d.n/10)+2}
      
    })
    .style("fill", function (d) { 
      if(brushed_ids.length != 0){return "red"}
      else{return "rgb(66, 172, 66)"}
    })
    .attr("class", function(){
      return (checkIfDarkMode()) ? (" bubble lightstroke") : (" bubble darkstroke")
    })
    .style("stroke-width", "1") 
    .style("opacity", "0")
    .style("pointer-events", "all")
    .on("mouseover", function(d) {
    tooltip.html("<b>decade: </b>"+d.decade+",<br><b> n°_film:</b> "+d.n);
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
        if(brushed_ids.length == 0){return "rgb(66, 172, 66)"}
        else{return "red"}
      })
      
      if(colore == "yellow"){
       
        d3.select(this).style("fill", function (d) {  
          
          if(brushed_ids.length == 0){return "rgb(66, 172, 66)"}
          else{return "red"}
          
        })
        compute_array(x_col, y_col, selected_ids, [])
      }
      else{
        d3.select(this).style("fill", "yellow")
        
        var bubble_range = d.decade.split("-")
        //console.log("test_x: ",x_col)
        //console.log("test_y: ",y_col)
        compute_array(x_col, y_col, selected_ids, bubble_range)
      }
      
      
      //return tooltip.style("top",(d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
    });
    bolle.transition().duration(800).style("opacity", "0.6")



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
    .style("width", "100%")
    .style("height", "10%")
    .style("background", "rgb(225, 213, 168)")
    .style("font-size", "20px")

  menu.append("label").text("X: ")
  var select_opt = menu.append("select").attr("id", "opt_x").on("change", function() {
  
    update_bubble_x(this.value);
    
 })
  select_opt.append("option").attr("value","4").attr("id", "year").text("Year")
  select_opt.append("option").attr("value","5").attr("id", "budget").attr("selected","true").text("Budget")
  select_opt.append("option").attr("value","6").attr("id", "actual_budget").text("Actual budget")
  select_opt.append("option").attr("value","7").attr("id", "revenue").text("Revenue")
  select_opt.append("option").attr("value","8").attr("id", "actual_revenue").text("Actual revenue")
  select_opt.append("option").attr("value","9").attr("id", "runtime").text("Runtime")
  select_opt.append("option").attr("value","10").attr("id", "vote_average").text("Average vote")
  select_opt.append("option").attr("value","11").attr("id", "vote_count").text("Votes count")
  select_opt.append("option").attr("value","12").attr("id", "popularity").text("Popularity")
  select_opt.append("option").attr("value","17").attr("id", "in_connections").text("In connections")
  select_opt.append("option").attr("value","18").attr("id", "out_connections").text("Out connections")
  select_opt.append("option").attr("value","19").attr("id", "tot_connections").text("Total connections")

  menu.append("label").text("Y: ")
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
 select_opt_Y.append("option").attr("value","12").attr("id", "popularity").text("Popularity")
 select_opt_Y.append("option").attr("value","17").attr("id", "in_connections").text("In connections")
 select_opt_Y.append("option").attr("value","18").attr("id", "out_connections").text("Out connections")
 select_opt_Y.append("option").attr("value","19").attr("id", "tot_connections").text("Total connections")


  menu.append("label").text("G: ")
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
  select_opt_GroupBy.append("option").attr("value","12").text("Popularity")
  select_opt_GroupBy.append("option").attr("value","17").text("In connections")
  select_opt_GroupBy.append("option").attr("value","18").text("Out connections")
  select_opt_GroupBy.append("option").attr("value","19").text("Total connections")
  select_opt_GroupBy.append("option").attr("value","20").attr("selected","true").text("Nessuno")

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
    .style("fill", "rgb(66, 172, 66)") // #ff0099
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
  d3.csv(DATASET_PATH, function(error, data) {
    chiavi = d3.keys(data[0])
    
    if (error) throw error;
      var l=data.length;
      for (let i=0;i<l;i++) data[i].id=i
      draw_bubbleplot_2(data,false,ids)
  })

}

/// START
start([])

export function chord_to_bubble(brushed_ids_up, chord_ids_up, bubble_ids_up){



  selected_ids = bubble_ids_up;
  brushed_ids = brushed_ids_up
  chord_ids = chord_ids_up



  d3.csv(DATASET_PATH, function(error, data) {
    chiavi = d3.keys(data[0])
    
    if (error) throw error;
      var l=data.length;
      for (let i=0;i<l;i++) data[i].id=i

    update(data)
      
  })
}



