import{chord_to_bubble} from "./bubbleplot.js"

function checkIfDarkMode() {
  return document.getElementById("darkModeCheckbox").checked
}

var DATASET_PATH = "../datasets/DATASET_MDS_NEW.csv"

// create the svg area
const svg = d3v6.select("#area_5")
.append("svg")
  .attr("id", "svg_5")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 300 175")
  .classed("svg-content", true)
  //.style("background-color","violet")

const colors = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c",
  "#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]

const colors_light = ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462",
  "#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]

var tooltip = d3.select("body")
.append("div")
.style("background", "rgba(225, 213, 168,0.8)")
.style("position", "absolute")
.style("z-index", "10")
.style("visibility", "hidden")
.style("font-size", "20px")

tooltip.html("")
//tooltip.append("li").text("tooltip");
//.style("width", "10%")
//.style("height", "10%")

function filtro(f) {
  if (f==0) return
  for (let i=0; i<matrix2.length; i++) {
    for (let j=0; j<matrix2.length; j++) {
      if (matrix2[i][j]<f){
        matrix2[i][j]=0
      }
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

const dict = {
  "Documentary": 0,
  "Western": 1,
  "Musical": 2,
  "Animation": 3,
  "Adventure": 4,
  "Fantasy": 5,
  "Horror": 6,
  "Sci-Fi": 7,
  "Comedy": 8,
  "Drama": 9,
  "Thriller": 10,
  "Action": 11,
}
const gens = Object.keys(dict);
/*
var generi_info_2 = []
for(i=0;i<gens.length;i++){
  genere_inf = {}
  genere_inf["genere"] = gens[i]
  genere_inf["colore"] = colors_light[i]
  genere_inf
  generi_info_2.push(genere_inf)
}
*/
const generi_info = [
  {"genere":"Documentary", "colore": "#8dd3c7", "id": 0},
  {"genere":"Western", "colore": "#ffffb3", "id": 1},
  {"genere":"Musical", "colore": "#bebada", "id": 2},
  {"genere":"Animation", "colore": "#fb8072", "id": 3},
  {"genere":"Adventure", "colore": "#80b1d3", "id": 4},
  {"genere":"Fantasy", "colore": "#fdb462", "id": 5},
  {"genere":"Horror", "colore": "#b3de69", "id": 6},
  {"genere":"Sci-Fi", "colore": "#fccde5", "id": 7},
  {"genere":"Comedy", "colore": "#d9d9d9", "id": 8},
  {"genere":"Drama", "colore": "#bc80bd", "id": 9},
  {"genere":"Thriller", "colore": "#ccebc5", "id": 10},
  {"genere":"Action", "colore": "#ffed6f", "id": 11},
]

createLabel(generi_info)

var matrix2 = []

var matrix_couples = []

function reset_matrix() {
  matrix2 = [
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
  
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
  
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0]
  ]
  matrix_couples = [
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
  
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
  
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0]
  ]
}

//var included_genres = Object.keys(dict)

var included_genres = []

var brushed_ids = []

var bubble_ids = []

var chord_ids = []

var selected_ids = []

function compute_matrix_row(row, genres_num) {

  if (genres_num==1) {
    var gen = row.genres.split("|")
    matrix2[dict[gen]][dict[gen]] += 1
  }
  else {
    for (let i=0; i<genres_num-1; i++) {
      for (let j=i+1; j<genres_num; j++) {
        var gen1 = row.genres.split("|")[i]
        var gen2 = row.genres.split("|")[j]
        matrix2[dict[gen1]][dict[gen2]] += 1
        matrix2[dict[gen2]][dict[gen1]] += 1
      }
    }
  } 
}

function compute_couples_matrix_row(row, genres_num) {

  if (genres_num==1) {
    var gen = row.genres.split("|")
    matrix_couples[dict[gen]][dict[gen]] += 1
  }
  else {
    var gen1 = row.genres.split("|")[0]
    var gen2 = row.genres.split("|")[1]
    matrix_couples[dict[gen1]][dict[gen2]] += 1
    matrix_couples[dict[gen2]][dict[gen1]] += 1
  }
}

function load_genres(included_genres, update_brushed_ids, highlighting, chord_filtering) {

  brushed_ids = update_brushed_ids
  chord_ids = []
  bubble_ids = []
  selected_ids = []
  reset_matrix()

  if (included_genres.length == 0) included_genres = Object.keys(dict)
  
  d3v6.csv(DATASET_PATH, function(row) {
    var genres = row.genres.split("|")
    var genres_num = genres.length
    var compute_row = false
    
    for (let g=0; g<included_genres.length; g++) {
      if (genres.includes(included_genres[g])) {
        if (!selected_ids.includes(row.imdb_id)) selected_ids.push(row.imdb_id)
        compute_row = true
        chord_ids.push(row.imdb_id)
        break
      }
    }

    if ((brushed_ids.length == 0) || (brushed_ids.includes(row.imdb_id))){
      if (compute_row) {
        // row in included_generes and in brushed_ids
        compute_matrix_row(row, genres_num)
        //couples
        if (genres_num<3) compute_couples_matrix_row(row, genres_num)
        bubble_ids.push(row.imdb_id)
      }
    }

  }).then(function() {

    //console.log(matrix_couples)
    //console.log(matrix2)
    
    filtro(0)
    d3.select("#chord_arcs").remove()
    d3.select("#chord_ribbons").remove()
    createD3Chord()
   
    //update par_cor
    if (!highlighting) {
      update_PC(selected_ids)
      update_MDS(selected_ids)
    } 
    if ((chord_filtering) || (highlighting)) chord_to_bubble(brushed_ids, chord_ids, bubble_ids)
  })
}

var chord_ids_up = []
var selected_ids_up = []
var bubble_ids_up = []
/// CORREGGI EVENTUALI ERRORI E CANCELLA TESTO NEL TOOLTIP RIGUARDO AL NUMERO DI FILM
export function filter_genres(filter_genres) {

  chord_ids_up = []
  selected_ids_up = []
  bubble_ids_up = []

  if(filter_genres != null){

    d3v6.csv(DATASET_PATH, function(row) {
 
      var genres = row.genres.split("|")
      var compute_row = true
      
   
      for (let g=0; g<genres.length; g++) {
        if(!filter_genres.includes(genres[g])){
          compute_row = false
          break
        }
      }
  
      if(compute_row){
        for (let g=0; g<filter_genres.length; g++) {
          if(!genres.includes(filter_genres[g])){
            compute_row = false
            break
          }
        }
      }

      if(compute_row){

        
        
        if ((brushed_ids.length == 0) || (brushed_ids.includes(row.imdb_id))) {
          bubble_ids_up.push(row.imdb_id)
          selected_ids_up.push(row.imdb_id)
          chord_ids_up.push(row.imdb_id)
          console.log(row)
          //console.log("bubble_ids_up: ", bubble_ids_up.length)
        }
        if (!selected_ids_up.includes(row.imdb_id)){
          
          //console.log("selected_ids_up: ", selected_ids_up.length)
        }
      }
    }).then(function() {
      
    console.log("selected_ids_up_fin: ", selected_ids_up.length)
    console.log("bubble_ids_up_fin: ", bubble_ids_up.length)
    update_PC(selected_ids_up)
    update_MDS(selected_ids_up)
    if(chord_ids_up.length == 0) {chord_ids_up = null}
    chord_to_bubble(brushed_ids, chord_ids_up, bubble_ids_up)
    })

  }
  else{
    filtro(0)
    update_PC(selected_ids)
    update_MDS(selected_ids)
    chord_to_bubble(brushed_ids, chord_ids, bubble_ids)
  }

}

//////////////////////////////////////////////////////////////////////////////////////////

function createD3Chord() {
  // give this matrix to d3v6.chord(): it will calculates all the info we need to draw arc and ribbon
  const res = d3v6.chord()
  .padAngle(0.05)     // padding between entities (black arc)
  .sortSubgroups(d3v6.descending)
  (matrix2)

  // add the groups on the inner part of the circle
  svg
  .datum(res)
  .append("g")
  .attr("id", "chord_arcs")
  .attr("transform", "scale(0.38) translate(250,240)")
  .selectAll("g")
  .data(d => d.groups)
  .join("g")
  .append("path")
    .style("fill", (d,i) => colors_light[i])
    //.style("stroke", "black") //selected
    .attr("d", d3v6.arc()
      .innerRadius(200)
      .outerRadius(220)
    )

  // Add the links between groups
  svg
  .datum(res)
  .append("g")
  .attr("id", "chord_ribbons")
  .attr("transform", "scale(0.38) translate(250,240)")
  .selectAll("path")
  .data(d => d)
  .join("path")
    .attr("d", d3v6.ribbon()
      .radius(200)
    )
    .style("fill", function(d){ return colors_light[d.source.index]})
    .style("opacity", 1)
    .attr("id", function(d){return d.target.index+"_"+d.source.index})
    .style("display", function(d){ 

      if(included_genres.length == 0){return null}
      
      else{
        var to_display = false
        for (let i=0; i<included_genres.length; i=i+1) {

          if((d.source.index == dict[included_genres[i]]) || (d.target.index == dict[included_genres[i]])){ 
            
            to_display = true
            return null 
          }
        }
        if(!to_display){
          return "none"
        }
      }
    })
    .on("mouseover", function(d) {
        var s = generi_info[d.target.__data__.source.index].genere
        var t = generi_info[d.target.__data__.target.index].genere
        var movies_number = matrix_couples[d.target.__data__.source.index][d.target.__data__.target.index]
        var old_n_film = d.target.__data__.source.value
        this["style"]["stroke"] = "black";
        d3.select(this).raise()
        var tooltip_text = ""
        if (d.target.__data__.source.index != d.target.__data__.target.index) {
          tooltip_text = "<b>Main genre:</b> "+s+",<br><b>Secondary genre: </b>"+t+
            ",<br><b>N° film exclusively "+s+" and "+t+": </b><br>"+movies_number+" out of "+old_n_film+" total"
        }
        else {
          tooltip_text = "<b>Genre:</b> "+s+
            ",<br><b>N° film: </b>"+movies_number
        }
        tooltip.html(tooltip_text)
        return tooltip.style("visibility", "visible") 
      })
      .on("mousemove", function() {
        return tooltip.style("top",(event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
      })
      
      .on("mouseout", function(d) {
        this["style"]["stroke"] = null
        return tooltip.style("visibility", "hidden");
      })
      .on("click", function(d) {
        
        if(this["style"]["opacity"] == 1){
          
        d3.select("#chord_ribbons").selectAll("path").style("opacity", "0.3")
        var elem =d3.select(this)
        var id_elem = this.id.split("_");
        id_elem[0] = generi_info[parseInt(id_elem[0])].genere
        id_elem[1] = generi_info[parseInt(id_elem[1])].genere
        elem.style("opacity", "0.99")
        filter_genres(id_elem)
        }
        else{
          console.log("")
          d3.select("#chord_ribbons").selectAll("path").style("opacity", "1")
          filter_genres(null)
        }
        

      });
}

function createLabel(generi) {

  d3.select('#svg_5')
    .append("g")
      .style("top", "5%")
      .style("right", "3.5%")
      .style("width", "35%")
      .style("height", "90%")
  
    .selectAll('g')
    .data(generi)
    .enter()
    .append('text').text(function(d){return d.genere})
    .attr("id", function(d){return d.genere+"_chord"})
    .attr("transform", function(d){
      var ret = "scale(0.5) translate(450,"+(d.id+1)*28+")"
      return ret
    }).on('click', function(d){
      filter_genres(null)
      var t = d3.select("#"+d.genere+"_chord_back").attr("class")
      if (t != "chord_back darkbackground" && t!="chord_back lightbackground") {
        d3.select("#"+d.genere+"_chord_back").attr("class", function(){
          return (checkIfDarkMode()) ? ("chord_back darkbackground") : ("chord_back lightbackground")
        })
      }
      else d3.select("#"+d.genere+"_chord_back").attr("class", "chord_back_highlighted")//.style("background-color", "rgb(225, 213, 168)")

      const index = included_genres.indexOf(d.genere);
      if (index > -1) {
        included_genres.splice(index, 1);
      }
      else included_genres.push(d.genere)

      //console.log("bids: ",brushed_ids)
  
      load_genres(included_genres, brushed_ids, false, true)
    })
    
  
  d3.select("#area_5")
  .selectAll('div')
        .data( generi_info)
        .enter()
 .append('div')
 .attr("id", function(d){return d.genere+"_chord_back"})
 .attr("class", "chord_back lightbackground")
 .style("position", "absolute")
 .style("top", function(d){return (3+d.id*8.1)+"%"})
 .style("left", "70%")
 .style("z-index", "-1")
 .style("position", "absolute")
 .style("font-size", "20px")
 .style("width", "20%")
 .style("height", "5%")
 
.append('div')
.attr("id", function(d){return d.genere+"_chord"})
 .style("position", "absolute")
 .style("top", function(d){return (0)+"%"})
 .style("left", "0%")
 .style("background", function(d){return d.colore})
 .style("position", "absolute")
 .style("border", "1px solid black")
 .style("font-size", "20px")
 .style("width", "15%")
 .style("height", "90%")
 .style("opacity", "1")
 .style("z-index", "0")


  return
}

function update_PC(selected_ids) {
  var paths = d3.select(".foreground").selectAll("path")

  paths.filter(function(d) {
    return selected_ids.includes(this['id'])
  }).style("opacity", "1")

  paths.filter(function(d) {
    return !selected_ids.includes(this['id'])
  }).style("opacity", "0")
}

function update_MDS(selected_ids) {
  var cerchi = d3.select("#area_1").selectAll(".dot")
  
  cerchi.filter(function(d) {
    return selected_ids.includes(this['id'])
  }).style("display", null)
  
  cerchi.filter(function(d) {
    var color = this["style"]["fill"]
    return !selected_ids.includes(this['id'])
  }).style("display", "none")

  cerchi.style("fill",function(d) {
    var color = this["style"]["fill"]
    return color == "red"
  }) ? "red" : "rgb(66, 172, 66)"

}



//////////////////////////////////////////////////////////////////////////////////////////

load_genres(included_genres, brushed_ids, false, false)

export function parCor_to_chord(brushed_ids){
  
  load_genres(included_genres, brushed_ids, true, false)
  
}

export function chordReadCSV(ds){

  DATASET_PATH = ds
  load_genres(included_genres, brushed_ids, true, false)
  
}
