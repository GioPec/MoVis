// create the svg area
const svg = d3v6.select("#area_5")
.append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 300 175")
  .classed("svg-content", true)
  //.style("border", "1px solid")
  //.style("background-color","violet")
//.attr("width", 440)
//.attr("height", 440)
/*
.append("g")
.attr("transform", "translate(20,180)")
.attr("transform", "scale(0.5)")
*/
const colors = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c",
  "#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]

const colors_light = ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462",
  "#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]

function filtro(f) {
  //console.log(matrix2)
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
  "Action": 11,
  "Adventure": 4,
  "Animation": 3,
  "Comedy": 8,
  "Documentary": 0,
  "Drama": 9,
  "Fantasy": 5,
  "Horror": 6,
  "Musical": 2,
  "Sci-Fi": 7,
  "Thriller": 10,
  "Western": 1,
}

var matrix2 = [
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
  
function load_genres() {
  d3v6.csv("../datasets/dataset.csv", function(row) {
    genres_num = row.genres.split("|").length
    //if (genres_num<1) console.log("Error! Genres<1")
    if (genres_num==1) {
      gen = row.genres.split("|")
      matrix2[dict[gen]][dict[gen]] += 1
    }
    else {
      for (let i=0; i<genres_num-1; i++) {
        for (j=i+1; j<genres_num; j++) {
          gen1 = row.genres.split("|")[i]
          gen2 = row.genres.split("|")[j]
          //console.log([dict[gen1],dict[gen2]])
          matrix2[dict[gen1]][dict[gen2]] += 1
          matrix2[dict[gen2]][dict[gen1]] += 1
        }
      }
    }
  }).then(function() {
    
    filtro(0)

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
  .attr("transform", "scale(0.38) translate(250,240)")
  .selectAll("path")
  .data(d => d)
  .join("path")
    .attr("d", d3v6.ribbon()
      .radius(200)
    )
    .style("fill", d => colors_light[d.source.index])
    //.style("stroke", "black"); // maybe?
}

//////////////////////////////////////////////////////////////////////////////////////////

load_genres()



