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


var tooltip = d3.select("body")
.append("div")
.style("background", "rgb(225, 213, 168)")
.style("position", "absolute")
.style("z-index", "10")
.style("visibility", "hidden")
.style("font-size", "20px")
.text("a simple tooltip");
  


function draw_bubbleplot_2(data, bubble_flag){   

  function sort_bubble(bubble){
    ret = []

    for (let i=0; i<bubble.length; i++) {

      if(ret.length == 0 ){ ret.push(bubble[i])}

      else{
        for (let j=0; j<ret.length; j++) {
          if(bubble[i]['n'] > ret[j]['n']){
            ret.splice(j,0,bubble[i])
            break
          }
          else{
            if(j == ret.length-1){ret.push(bubble[i])}
          }
        }
      }
    }

    return ret
  }

  function update_bubble_x(x_col, bubble_flag){
    
    if(!bubble_flag){
      x.domain(d3.extent(data, function(d) { return +d[chiavi[x_col]]; }));
      xAxis.call(d3.axisBottom(x))
    
      cerchi = d3.select("#area_2_circles").selectAll(".dot");
      cerchi.transition().duration(1000).attr("cx", function (d) { return x(d[chiavi[x_col]]) } )
    }

    else{

        data_grupped_avg = d3.nest()
        .key(function(d) {return d.year})
        .sortKeys(d3.ascending)
        .entries(data)

      
        var step = 10 // magari sarà un parametro
        start = data_grupped_avg[0].key-(data_grupped_avg[0].key % step)
        end = data_grupped_avg[data_grupped_avg.length-1].key-(data_grupped_avg[data_grupped_avg.length-1].key % step)

        dict_bubbles = {}
        for (let i=start; i<end+step; i=i+step) { dict_bubbles[i] = {"x":[], "n":0, "decade":i }}

        //console.log("x_col", chiavi[x_col])
        
        for (let i=0; i<data.length; i++) { 
          decade = data[i].year-(data[i].year % step)
          dict_bubbles[decade]['x'].push(parseInt(data[i][chiavi[x_col]]))
          dict_bubbles[decade]['n']+=1
        }
        //console.log(dict_bubbles)
        bubbles = []
        k = Object.keys(dict_bubbles)
        for(let i =0; i< k.length;i++){
          bubbles.push(dict_bubbles[k[i]])
          bubbles[i].x = bubbles[i].x.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].x.length
        }

        

        /// change range for bubbles
        console.log("bubbles", bubbles)
        range_x = d3.extent(bubbles, function(d) {return +d.x; })
        console.log("range_x", range_x)
        range_x[0]=range_x[0]-10
        range_x[1]=range_x[1]+10
        x.domain(range_x);
        xAxis.call(d3.axisBottom(x))

        sorted_bubbles = sort_bubble(bubbles)

        cerchi = d3.select("#area_2_circles").selectAll(".bubble").data(sorted_bubbles);
        cerchi.transition().duration(1000).attr("cx", function (d) {  return x(d.x) } )



    }
    
    
  }

  function update_bubble_y(y_col, bubble_flag){
    
    if(!bubble_flag){
      y.domain(d3.extent(data, function(d) { return +d[chiavi[y_col]]; }));
      yAxis.call(d3.axisLeft(y))
    
      cerchi = d3.select("#area_2_circles").selectAll(".dot");
      cerchi.transition().duration(1000).attr("cy", function (d) { return y(d[chiavi[y_col]]) } )

    }

    else{
    

      data_grupped_avg = d3.nest()
      .key(function(d) {return d.year})
      .sortKeys(d3.ascending)
      .entries(data)

    
      var step = 10 // magari sarà un parametro
      start = data_grupped_avg[0].key-(data_grupped_avg[0].key % step)
      end = data_grupped_avg[data_grupped_avg.length-1].key-(data_grupped_avg[data_grupped_avg.length-1].key % step)

      dict_bubbles = {}
      for (let i=start; i<end+step; i=i+step) { dict_bubbles[i] = {"y":[], "n":0, "decade":i } }

      //console.log("x_col", chiavi[x_col])
      
      for (let i=0; i<data.length; i++) { 
        decade = data[i].year-(data[i].year % step)
        dict_bubbles[decade]['y'].push(parseInt(data[i][chiavi[y_col]]))
        dict_bubbles[decade]['n']+=1
      }
      //console.log(dict_bubbles)
      bubbles = []
      k = Object.keys(dict_bubbles)
      for(let i =0; i< k.length;i++){
        bubbles.push(dict_bubbles[k[i]])
        bubbles[i].y = bubbles[i].y.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].y.length
      }

      sorted_bubbles = sort_bubble(bubbles)

      /// change range for bubbles
      
      range_y = d3.extent(bubbles, function(d) {return +d.y; })
     
      range_y[0]=range_y[0]-10
      range_y[1]=range_y[1]+10
      y.domain(range_y);
      yAxis.call(d3.axisLeft(y))

      cerchi = d3.select("#area_2_circles").selectAll(".bubble").data(sorted_bubbles);
      cerchi.transition().duration(1000).attr("cy", function (d) {  return y(d.y) } )



  }

    
    
  }

  function eliminate_groups(x_col, y_col, bubble_flag = false){

    
    
    /// elimina bubble
    cerchi = d3.select("#area_2_circles").selectAll(".bubble").transition().duration(800).style("opacity", "0"); // mettere transizione
    cerchi.remove()

    /// sistema assi
    x.domain(d3.extent(data, function(d) { return +d[x_col]; }));
    xAxis.call(d3.axisBottom(x))

    y.domain(d3.extent(data, function(d) {return +d[y_col]; }));
    yAxis.call(d3.axisLeft(y))

    /// riposiziona punti

  nuovi_cerchi = d3.select("#area_2_circles").selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr('class', 'dot')
    .attr("cx", function (d) {return x(d[x_col]) } )
    .attr("cy", function (d) {  return y(d[y_col]) } )
    .attr("r", 1)
    .attr("id", function (d) { return d[chiavi[2]] })
    .attr("name", function (d) { return d["title"] } )
    .style("fill", "rgb(66, 172, 66)") // #ff0099
    .style("stroke", "black")
    .style("stroke-width", "0.2") 
    .style("opacity", "0.0")
    .style("pointer-events", "all")
  
    nuovi_cerchi.transition().duration(800).style("opacity", "1")
    
  }

  function groupping(criterio, x_col, y_col){

    if(criterio == "18"){eliminate_groups(x_col, y_col); return}
    //console.log("criterio: ", criterio)
    //console.log("x_col: ", x_col)
    //console.log("y_col: ", y_col)

    data_grupped_avg = d3.nest()
    .key(function(d) {return d.year})
    .sortKeys(d3.ascending)
    .entries(data)

    
    var step = 10 // magari sarà un parametro
    start = data_grupped_avg[0].key-(data_grupped_avg[0].key % step)
    end = data_grupped_avg[data_grupped_avg.length-1].key-(data_grupped_avg[data_grupped_avg.length-1].key % step)

    dict_bubbles = {}
    for (let i=start; i<end+step; i=i+step) { dict_bubbles[i] = {"x":[], "y":[], "n":0, "decade": i} }

 
    for (let i=0; i<data.length; i++) { 
      decade = data[i].year-(data[i].year % step)
      dict_bubbles[decade]['x'].push(parseInt(data[i][x_col]))
      dict_bubbles[decade]['y'].push(parseFloat(data[i][y_col]))
      dict_bubbles[decade]['n']+=1
    }
    
    bubbles = []
    k = Object.keys(dict_bubbles)
    for(let i =0; i< k.length;i++){
      bubbles.push(dict_bubbles[k[i]])
      bubbles[i].x = bubbles[i].x.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].x.length
      bubbles[i].y = bubbles[i].y.reduce((partialSum, a) => partialSum + a, 0)/bubbles[i].y.length
    }


    /// fade circles
    cerchi = d3.select("#area_2_circles").selectAll(".dot").transition().duration(800).style("opacity", "0")
    cerchi.remove(); // mettere transizione

  
    /// change range for bubbles
    range_x = d3.extent(bubbles, function(d) { return +d.x; })
    range_x[0]=range_x[0]-10
    range_x[1]=range_x[1]+10
    x.domain(range_x);
    xAxis.call(d3.axisBottom(x))

    range_y = d3.extent(bubbles, function(d) { return +d.y; })
    range_y[0]=range_y[0]-10
    range_y[1]=range_y[1]+10
    y.domain(range_y);
    yAxis.call(d3.axisLeft(y))

 
   sorted_bubbles = sort_bubble(bubbles)
    
    

    /// add bubbles
    bolle =d3.select("#area_2_circles").selectAll(".bubble")
    .data(sorted_bubbles)
    .enter().append("circle")
    .attr('class', 'bubble')
    .attr("cx", function (d) {  return x(d.x) } )
    .attr("cy", function (d) {  return y(d.y) } )
    .attr("r",function (d) {  return d.n/10})
    .style("fill", "rgb(66, 172, 66)") // #ff0099
    .style("stroke", "black")
    .style("stroke-width", "1") 
    .style("opacity", "0")
    .style("pointer-events", "all")
    .on("mouseover", function(d) {
      tooltip.text("decade : "+d.decade+", n°_film: "+d.n);
     return tooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
      return tooltip.style("top",
        (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      return tooltip.style("visibility", "hidden");
      
    });

    bolle.transition().duration(800).style("opacity", "0.6")

  }

 

  

  menu = d3.select("#area_2").append("div")

  menu.style("width", "100%")
  .style("height", "10%")
  .style("background", "rgb(225, 213, 168)")
  .style("font-size", "20px")

  menu.append("label").text("X: ")
  select_opt = menu.append("select").attr("id", "opt_x").on("change", function() {
    update_bubble_x(this.value, document.getElementById('opt_groupby').selectedOptions[0].value != 18);
 })
  select_opt.append("option").attr("value","4").attr("id", "year").text("Year")
  select_opt.append("option").attr("value","5").attr("id", "budget").attr("selected","true").text("Budget")
  select_opt.append("option").attr("value","6").attr("id", "revenue").text("Revenue")
  select_opt.append("option").attr("value","7").attr("id", "runtime").text("Runtime")
  select_opt.append("option").attr("value","8").attr("id", "vote_average").text("Average vote")
  select_opt.append("option").attr("value","9").attr("id", "vote_count").text("Votes count")
  select_opt.append("option").attr("value","10").attr("id", "popularity").text("Popularity")
  select_opt.append("option").attr("value","15").attr("id", "in_connections").text("In connections")
  select_opt.append("option").attr("value","16").attr("id", "out_connections").text("Out connections")
  select_opt.append("option").attr("value","17").attr("id", "tot_connections").text("Total connections")

  menu.append("label").text("Y: ")
  select_opt_Y = menu.append("select").attr("id", "opt_y").on("change", function() {
    update_bubble_y(this.value, document.getElementById('opt_groupby').selectedOptions[0].value != 18);
 })
  select_opt_Y.append("option").attr("value","4").attr("id", "year").text("Year")
  select_opt_Y.append("option").attr("value","5").attr("id", "budget").text("Budget")
  select_opt_Y.append("option").attr("value","6").attr("id", "revenue").attr("selected","true").text("Revenue")
  select_opt_Y.append("option").attr("value","7").attr("id", "runtime").text("Runtime")
  select_opt_Y.append("option").attr("value","8").attr("id", "vote_average").text("Average vote")
  select_opt_Y.append("option").attr("value","9").attr("id", "vote_count").text("Votes count")
  select_opt_Y.append("option").attr("value","10").attr("id", "popularity").text("Popularity")
  select_opt_Y.append("option").attr("value","15").attr("id", "in_connections").text("In connections")
  select_opt_Y.append("option").attr("value","16").attr("id", "out_connections").text("Out connections")
  select_opt_Y.append("option").attr("value","17").attr("id", "tot_connections").text("Total connections")


  menu.append("label").text("G: ")
  select_opt_GroupBy = menu.append("select").attr("id", "opt_groupby").on("change", function() {
    //console.log(document.getElementById('opt_y').selectedOptions[0].id)
    x_col = document.getElementById('opt_x').selectedOptions[0].id
    y_col = document.getElementById('opt_y').selectedOptions[0].id
    groupping(this.value, x_col.toLowerCase(), y_col.toLowerCase());
 })
  select_opt_GroupBy.append("option").attr("value","4").text("Year")
  select_opt_GroupBy.append("option").attr("value","5").text("Budget")
  select_opt_GroupBy.append("option").attr("value","6").text("Revenue")
  select_opt_GroupBy.append("option").attr("value","7").text("Runtime")
  select_opt_GroupBy.append("option").attr("value","8").text("Average vote")
  select_opt_GroupBy.append("option").attr("value","9").text("Votes count")
  select_opt_GroupBy.append("option").attr("value","10").text("Popularity")
  select_opt_GroupBy.append("option").attr("value","15").text("In connections")
  select_opt_GroupBy.append("option").attr("value","16").text("Out connections")
  select_opt_GroupBy.append("option").attr("value","17").text("Total connections")
  select_opt_GroupBy.append("option").attr("value","18").attr("selected","true").text("Nessuno")

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
  
  if (error) throw error;
    var l=data.length;
    for (i=0;i<l;i++) data[i].id=i
    draw_bubbleplot_2(data)
})
//load_axis()