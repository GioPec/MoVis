import{parCor_to_chord, filter_genres} from "./chord.js"
import {color_base, color_brushed, color_selected, color_tooltip_light, color_tooltip_dark} from "./functions.js"

//var DATASET_PATH = "../datasets/DATASET_MDS_250.csv"
//var DATASET_PATH = "../datasets/dataset_fake.csv"
var DATASET_PATH = "../datasets/DATASET_MDS_NEW.csv"

function checkIfDarkMode() {
    return document.getElementById("darkModeCheckbox").checked
}

//////////DISEGNO PARALLEL////////////


var imdb_ids = null
var ids = null
var line = d3.line(),
//axis = d3.axisLeft(x),
// background,
foreground,
extents;
var dimensions;

var margin = {top: 30, right: 10, bottom: 10, left: 10},
        width = 200 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([15, width+122]).padding(.1),
y = {},
dragging = {};

function drawParallel(data, actual) {

    d3.select("#svg4").remove()

    


 

    
    var svg = d3.select("#area_4").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 270 110")
    .attr("id", "svg4")
    //.append("g")
    //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    .attr("transform", "scale(0.95) translate(-2,0)")
    //.style("background-color", "red")


    var whichBudget = (actual) ? ("actual_budget") : ("budget")
    var whichRevenue = (actual) ? ("actual_revenue") : ("revenue")

    x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
        if (
            (d == "year") 

            //|| (d == "budget") 
            //|| (d == "revenue") 
            //|| (d == "actual_budget") 
            //|| (d == "actual_revenue") 
            || (d == whichBudget)
            || (d == whichRevenue)

            || (d == "runtime")
            || (d == "vote_average")  
            || (d == "vote_count")  
            //|| (d == "popularity")  
            || (d == "in_connections")  
            || (d == "out_connections")
        ) {
            
            return y[d] = d3.scaleLinear()
            .domain(d3.extent(data, function(p) { return +p[d]; }))
            .range([104, 6]);
        }
        return false
    }));



    extents = dimensions.map(function(p) { return [0,0]; });

    // Add red foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .style("opacity", "1")
        .attr("id", function (d) { return d.imdb_id } )
        .attr("class","normal")
        .attr("for", "consider")
        .attr("d", path);
    

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        
    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .style("font-family", "sans-serif")
        .each(function(d) {  
            d3.select(this)
            .call(d3.axisLeft(y[d]))
            .attr("font-size", "4px")
        //text does not show up because previous line breaks somehow
        .append("text")
        
        //.style("text-anchor", "big")
        .attr("y", 4)
        .attr("font-size", "4px")
        //.style("fill", "#000")
        .attr("class", "darkfill")
        .text(function(d) { return d.charAt(0).toUpperCase() + d.slice(1).replace("_", " "); });
    })
    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function(d) {
            d3.select(this).call(y[d].brush = d3.brushY().extent([[-4, 0], [4,height]])
            .on("brush.uno start.uno ", brushstart)
            .on("brush.due", brush_parallel_chart_2)
            .on("end.tre", brush_parallel_chart)
            .on("end.quattro", brushend)
            
            );
            
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
    return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
    }

    function brushstart() {
        //console.log("START")
        d3.event.sourceEvent.stopPropagation();
    }

    function brushend() {
        //console.log("END")
        
    }

   

    var array = [false,false,false,false,false,false,false,false]
    // Handles a brush event, toggling the display of foreground lines.
    function brush_parallel_chart() { 
       
          
        filter_genres(null)
        var index 
        
        var test = foreground.filter(function(d) {
            
            return this["style"]["opacity"] != 0
          })
          
        var runcode=true
        for(var i=0;i<dimensions.length;++i) {
            d3.event.target==y[dimensions[i]].brush
            if(d3.event.target==y[dimensions[i]].brush) {
                if(d3.event.selection==null){
               
                    array[i]=false
                    extents[i][0]=0
                    extents[i][1]=0

                    runcode=false
                  

                    
                    if (array.indexOf(true)!=-1){

                    }else{
                        d3.select("#svg4").selectAll("path").classed("active", false).classed("normal", true)
                      
                    
                        imdb_ids=[]
                        // update chord
                        parCor_to_chord(imdb_ids)

                        //update mds
                        var area_1 = d3.select("#area_1")
                        area_1.selectAll(".dot").style("fill", color_base)
                    
                        return
                
                
                    }
                    
                    
                    // return

                    
                }else{
                    //array.push(false)
                    array[i]=true
                    runcode=true
                    index = i
                    extents[i]=d3.event.selection.map(y[dimensions[i]].invert,y[dimensions[i]]); 
                    //console.log("cisono")
                }
                
            }
        }
        
        ids = []
        imdb_ids = []

        var color_up = foreground.filter(function(d) {return true})

        color_up.classed("active", function(d) {
            ids.push(d.id)
            imdb_ids.push(d.imdb_id)
            var eliminato = false
            return dimensions.every(function(p, i) {
                //console.log("ciaoprova" + extents[i])
                


                var check_2 = extents[i][0]==0 && extents[i][1]==0
                if(check_2) return true;

                // if(runcode==false) {
                //     extents[i][0]=0
                //     extents[i][1]=0
                // }
                
            var check_1 = extents[i][1] <= d[p] && d[p] <= extents[i][0];
            
            if(!check_1 && !(eliminato)){
                eliminato = true
                ids.pop()
                imdb_ids.pop()
            }
            return check_1
            }) ? true : false;

        });
    
        color_up.classed("normal", function(d) {
            ids.push(d.id)
            var eliminato = false
            return dimensions.every(function(p, i) {
                //console.log("ciaoprova" + extents[i])
                // if(runcode==false) return false
                var check_2 = extents[i][0]==0 && extents[i][1]==0
                if(check_2) return true;
                
                
            var check_1 = extents[i][1] <= d[p] && d[p] <= extents[i][0];
            
            if(!check_1 && !(eliminato)){
                eliminato = true
                ids.pop()
            }

            return check_1
            }) ? false : true;
        });
        //////////////////////////////////////////////////////////////////////////////////////////////
        ids = []
        imdb_ids = []
        test.classed("active", function(d) {
            ids.push(d.id)
            imdb_ids.push(d.imdb_id)
            var eliminato = false
            return dimensions.every(function(p, i) {
                //console.log("ciaoprova" + extents[i])
                


                var check_2 = extents[i][0]==0 && extents[i][1]==0
                if(check_2) return true;

                // if(runcode==false) {
                //     extents[i][0]=0
                //     extents[i][1]=0
                // }
                
            var check_1 = extents[i][1] <= d[p] && d[p] <= extents[i][0];
            
            if(!check_1 && !(eliminato)){
                eliminato = true
                ids.pop()
                imdb_ids.pop()
            }
            return check_1
            }) ? true : false;

        });

        test.classed("normal", function(d) {
            ids.push(d.id)
            var eliminato = false
            return dimensions.every(function(p, i) {
                //console.log("ciaoprova" + extents[i])
                // if(runcode==false) return false
                var check_2 = extents[i][0]==0 && extents[i][1]==0
                if(check_2) return true;
                
                
            var check_1 = extents[i][1] <= d[p] && d[p] <= extents[i][0];
            
            if(!check_1 && !(eliminato)){
                eliminato = true
                ids.pop()
            }

            return check_1
            }) ? false : true;
        });

        
        d3.selectAll(".active").raise()
        //update chord
        
        parCor_to_chord(imdb_ids)

        //update mds
        var area_1 = d3.select("#area_1")
        area_1.selectAll(".dot").style("fill", function(d) {  
            for(var t=0;t<ids.length;t++){
                if(ids[t] == d.id){
                    return color_brushed
                }
            }
            return color_base
        });


    }

    function brush_parallel_chart_2() {   
        
        var index
        for(var i=0;i<dimensions.length;++i) {
            if(d3.event.target==y[dimensions[i]].brush) {
                //array[i]=false
                index = i
                extents[i]=d3.event.selection.map(y[dimensions[i]].invert,y[dimensions[i]]);
                //console.log(extents[i])
            }
            
        }
        var ids = []
        var imdb_ids = []
        


        foreground.classed("active", function(d) {
            ids.push(d.id)
            imdb_ids.push(d.imdb_id)
            var eliminato = false
            return dimensions.every(function(p, i) {
                
                var check_2 = extents[i][0]==0 && extents[i][1]==0
                if(check_2) return true;
                
            var check_1 = extents[i][1] <= d[p] && d[p] <= extents[i][0];
            
            if(!check_1 && !(eliminato)){
                eliminato = true
                ids.pop()
                imdb_ids.pop()
            }
            return check_1
            }) ? true : false;

        });
       
       
       
        foreground.classed("normal", function(d) {
            ids.push(d.id)
            var eliminato = false
            return dimensions.every(function(p, i) {
                
                var check_2 = extents[i][0]==0 && extents[i][1]==0
                if(check_2) return true;
                
            var check_1 = extents[i][1] <= d[p] && d[p] <= extents[i][0];
            
            if(!check_1 && !(eliminato)){
                eliminato = true
                ids.pop()
            }
            if(check_1){
              return check_1  
            }
            return extents[i][1] <= d[p] && d[p] <= extents[i][0];
            }) ? null : "none";
        });





        d3.selectAll(".active").raise()

        //update chord
        //parCor_to_chord(imdb_ids)

        //update mds
        /*
        var area_1 = d3.select("#area_1")
        area_1.selectAll(".dot").style("fill", function(d) {  
            for(var t=0;t<ids.length;t++){
                if(ids[t] == d.id){
                    return "red"
                }
            }
            return "rgb(66, 172, 66)"
        });
        */
    }

    d3.select("#svg4").selectAll("text").attr("class", function(){
        return (checkIfDarkMode()) ? ("lightfill") : ("darkfill")
    })
    d3.select("#svg4").selectAll("line").attr("class", function(){
        return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
    })
    d3.select("#svg4").selectAll(".domain").attr("class", function(){
        return (checkIfDarkMode()) ? ("domain lightstroke") : ("domain darkstroke")
    })

}

export function refresh_brush(){

    //console.log("refreshbrush")
    imdb_ids = []
    ids = []
    var update = d3.selectAll(".active").filter(function(d) {
        
        if(this["style"]["opacity"] != 0){
            imdb_ids.push(d.imdb_id)
            ids.push(d.id)
        }

        return this["style"]["opacity"] != 0
    })
    
        //update chord
        parCor_to_chord(imdb_ids)

        //update mds
        var area_1 = d3.select("#area_1")
        area_1.selectAll(".dot").style("fill", function(d) {  
            for(var t=0;t<ids.length;t++){
                if(ids[t] == d.id){
                    return color_brushed
                }
            }
            return color_base
        });
}

export function parCorReadCSV(ds, actual) {

    d3.csv(ds, function(error, data) {

        //var chiavi = d3.keys(data[0])
        if (error) throw error;
        var l=data.length;
        for (var i=0;i<l;i++) {
            data[i].id=i
        }
        drawParallel(data, actual)
    })
}

parCorReadCSV(DATASET_PATH, false)
    
    