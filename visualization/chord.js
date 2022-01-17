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
  ];
}

var matrix3 = [
  [41, 0, 6, 1, 0, 0, 0, 0, 8, 9, 1, 2],
  [0, 18, 4, 3, 19, 2, 2, 4, 17, 40, 11, 34],
  [6, 4, 12, 40, 26, 33, 3, 6, 78, 77, 1, 8],
  [1, 3, 40, 13, 155, 96, 1, 35, 153, 33, 4, 43],
  [0, 19, 26, 155, 12, 230, 18, 223, 263, 196, 165, 460],
  [0, 2, 33, 96, 230, 6, 62, 53, 154, 106, 67, 146],
  [0, 2, 3, 1, 18, 62, 92, 108, 85, 84, 327, 94],
  [0, 4, 6, 35, 223, 53, 108, 15, 95, 120, 230, 333],
  [8, 17, 78, 153, 263, 154, 85, 95, 665, 511, 118, 278],
  [9, 40, 77, 33, 196, 106, 84, 120, 511, 943, 574, 407],
  [1, 11, 1, 4, 165, 67, 327, 230, 118, 574, 140, 536],
  [2, 34, 8, 43, 460, 146, 94, 333, 278, 407, 536, 81]
]


var matrix4 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 18, 4, 3, 19, 2, 2, 4, 17, 40, 11, 34],
  [0, 4, 12, 40, 26, 33, 3, 6, 78, 77, 1, 8],
  [0, 3, 40, 13, 155, 96, 1, 35, 153, 33, 4, 43],
  [0, 19, 26, 155, 12, 230, 18, 223, 263, 196, 165, 460],
  [0, 2, 33, 96, 230, 6, 62, 53, 154, 106, 67, 146],
  [0, 2, 3, 1, 18, 62, 92, 108, 85, 84, 327, 94],
  [0, 4, 6, 35, 223, 53, 108, 15, 95, 120, 230, 333],
  [0, 17, 78, 153, 263, 154, 85, 95, 665, 511, 118, 278],
  [0, 40, 77, 33, 196, 106, 84, 120, 511, 943, 574, 407],
  [0, 11, 1, 4, 165, 67, 327, 230, 118, 574, 140, 536],
  [0, 34, 8, 43, 460, 146, 94, 333, 278, 407, 536, 81]
]

var excluded_genres = []

function compute_matrix_row(row, genres_num) {
  if (genres_num==1) {
    gen = row.genres.split("|")
    matrix2[dict[gen]][dict[gen]] += 1
  }
  else {
    for (let i=0; i<genres_num-1; i++) {
      for (let j=i+1; j<genres_num; j++) {
        gen1 = row.genres.split("|")[i]
        gen2 = row.genres.split("|")[j]
        matrix2[dict[gen1]][dict[gen2]] += 1
        matrix2[dict[gen2]][dict[gen1]] += 1
      }
    }
  } 
}

function load_genres(excluded_genres) {
  reset_matrix()
  d3v6.csv("../datasets/dataset.csv", function(row) {
    genres_num = row.genres.split("|").length
    genres = row.genres.split("|")
    //if (genres_num<1) console.log("Error! Genres<1")
    var compute_row = true
    for (let g=0; g<excluded_genres.length; g++) {
      if (genres.includes(excluded_genres[g])) {
        compute_row = false
        break
      }
    }
    if (compute_row) compute_matrix_row(row, genres_num)

  }).then(function() {
    
    filtro(0)
    d3.select("#chord_arcs").remove()
    d3.select("#chord_ribbons").remove()
    createD3Chord()
  })
}

//////////////////////////////////////////////////////////////////////////////////////////

function createD3Chord() {
  // give this matrix to d3v6.chord(): it will calculates all the info we need to draw arc and ribbon
  const res = d3v6.chord()
  .padAngle(0.1)     // padding between entities (black arc)
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
    //.transition()
    //.duration(2000)
    //.delay(function(d, i) { return i / data.length * enter_duration; })
    .style("fill", d => colors_light[d.source.index])
    //.style("stroke", "black"); // maybe?
}

function createLabel(generi) {

  var labels = d3.select('#area_5')
    .append("div")
      //.style("background", "rgb(225, 213, 168)")
      .style("position", "absolute")
      .style("top", "5%")
      .style("right", "3.5%")
      .style("width", "35%")
      .style("height", "90%")

  .selectAll('div')
  .data(generi)
  .enter()
  .append('div')
    .attr('id',function(d){return d.genere})
    .attr('class','genere_info')
    .attr('for',function(d){return d.genere})
    .attr('id', function(d){return 'genere_info_' + d.id})
    .style("opacity","1")
    .style("height", "8.33%")
   
    labels.append('div')
        .attr('class','genere_square')
        .attr('id', function(d){return 'genere_square_' + d.id})
        .style("background-color", function(d){return d.colore})

    labels.append('div')
        .attr('class','genere_label')
        .style("font-size", "100%")
        .attr('id', function(d){return 'genere_label_' + d.id})
        .text(function(d){return d.genere})

    
      d3.selectAll('.genere_info')
      .on('click', function(d){
        //d3.event.target.style("opacity", ".3")
        var t = d3.select(this)
        if (t.style("opacity") == 1) {
          t.style("opacity", "0.3")
        }
        else t.style("opacity", "1")
       
        const index = excluded_genres.indexOf(t.attr("for"));
        if (index > -1) {
          excluded_genres.splice(index, 1);
        }
        else excluded_genres.push(t.attr("for"))
       
        load_genres(excluded_genres)
      })

/* TODO
    labels.append('div')
        .attr('class','number')
        .style("font-size", "100%")
        .text(function(d){return d.numerodifilm?})
        */

  return
}

//////////////////////////////////////////////////////////////////////////////////////////

load_genres(excluded_genres)



