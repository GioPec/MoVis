// create the svg area
const svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", 440)
.attr("height", 440)
.append("g")
.attr("transform", "translate(220,220)")

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
  //console.log(matrix2)
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
  [81, 460, 43, 278, 0, 407, 146, 94, 8, 333, 536, 0],
  [460, 12, 155, 263, 0, 196, 230, 18, 26, 223, 165, 0],
  [43, 155, 13, 153, 0, 33, 96, 1, 40, 35, 4, 0],
  [278, 263, 153, 665, 0, 511, 154, 85, 78, 95, 118, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [407, 196, 33, 511, 0, 943, 106, 84, 77, 120, 574, 0],
  [146, 230, 96, 154, 0, 106, 6, 62, 33, 53, 67, 0],
  [94, 18, 1, 85, 0, 84, 62, 92, 3, 108, 327, 0],
  [8, 26, 40, 78, 0, 77, 33, 3, 12, 6, 1, 0],
  [333, 223, 35, 95, 0, 120, 53, 108, 6, 15, 230, 0],
  [536, 165, 4, 118, 0, 574, 67, 327, 1, 230, 140, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]
  
function load_genres() {
  d3.csv("../dataset.csv", function(row) {
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
  // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
  const res = d3.chord()
  .padAngle(0.05)     // padding between entities (black arc)
  .sortSubgroups(d3.descending)
  (matrix2)

  // add the groups on the inner part of the circle
  svg
  .datum(res)
  .append("g")
  .selectAll("g")
  .data(d => d.groups)
  .join("g")
  .append("path")
    .style("fill", (d,i) => colors_light[i])
    .style("stroke", "black")
    .attr("d", d3.arc()
      .innerRadius(200)
      .outerRadius(210)
    )

  // Add the links between groups
  svg
  .datum(res)
  .append("g")
  .selectAll("path")
  .data(d => d)
  .join("path")
    .attr("d", d3.ribbon()
      .radius(200)
    )
    .style("fill", d => colors_light[d.source.index]) // colors depend on the source group. Change to target otherwise.
    //.style("stroke", "black"); // TODO
}

//////////////////////////////////////////////////////////////////////////////////////////

load_genres()



