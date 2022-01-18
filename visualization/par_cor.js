
    //////////DISEGNO PARALLEL////////////

    function drawParallel(data){

    var margin = {top: 30, right: 10, bottom: 10, left: 10},
        width = 200 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([15, width+122]).padding(.1),
        y = {},
        dragging = {};


    var line = d3.line(),
        //axis = d3.axisLeft(x),
        background,
        foreground,
        extents;

    
    var svg = d3.select("#area_4").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 270 110")
    //.append("g")
    //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    .attr("transform", "scale(0.95) translate(-2,0)")
    //.style("background-color", "red")
        


    // Extract the list of dimensions and create a scale for eac/cars[0] contains the header elements,h.
        // then for all elements in the header
        //different than "name" it creates and y axis in a dictionary by variable name
    x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
        //if ((d == "a1") || (d == "a2") || (d == "a3")  || (d == "a4")  || (d == "a5")  || (d == "a6")  || (d == "a7")  || (d == "a8")) {
        if ((d == "budget") || (d == "revenue") || (d == "runtime")  || 
        (d == "vote_average")  || (d == "vote_count")  || (d == "popularity")  || (d == "in_connections")  || (d == "out_connections")) {
            return y[d] = d3.scaleLinear()
            .domain(d3.extent(data, function(p) { 
                return +p[d]; }))
            .range([104, 6]);
        }
        return false
    }));

    extents = dimensions.map(function(p) { return [0,0]; });

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("class","backpath")
        .attr("d", path);

    // Add red foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("id", function (d) { return d.imdb_id } )
        .attr("class","normal")
        .attr("d", path);

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        /*
        .call(d3.drag()
            .subject(function(d) { return {x: x(d)}; })
            .on("start", function(d) {
            dragging[d] = x(d);
            background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
            dragging[d] = Math.min(width, Math.max(0, d3.event.x));
            foreground.attr("d", path);
            dimensions.sort(function(a, b) { return position(a) - position(b); });
            x.domain(dimensions);
            g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("end", function(d) {
            delete dragging[d];
            transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
            transition(foreground).attr("d", path);
            background
                .attr("d", path)
                .transition()
                .delay(500)
                .duration(0)
                .attr("visibility", null);
            }));*/
    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .style("font-family", "sans-serif")
        .each(function(d) {  d3.select(this).call(d3.axisLeft(y[d]));})
        //text does not show up because previous line breaks somehow
        .append("text")
        
        //.style("text-anchor", "big")
        .attr("y", 4)
        .style("font-size", "4px")
        .text(function(d) { return d; });
            
    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function(d) {
            d3.select(this).call(y[d].brush = d3.brushY().extent([[-8, 0], [8,height]]).on("brush start", brushstart).on("brush", brush_parallel_chart));
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
    d3.event.sourceEvent.stopPropagation();
    }


    // Handles a brush event, toggling the display of foreground lines.
    function brush_parallel_chart() {    
        var index = -1
        for(var i=0;i<dimensions.length;++i) {
            if(d3.event.target==y[dimensions[i]].brush) {
                index = i
                extents[i]=d3.event.selection.map(y[dimensions[i]].invert,y[dimensions[i]]);
                //console.log(extents[i])
            }
        }
        ids = []
        foreground.classed("active", function(d) {
            ids.push(d.id)
            eliminato = false
            return dimensions.every(function(p, i) {
                
                check_2 = extents[i][0]==0 && extents[i][1]==0
                if(check_2) return true;
                
            check_1 = extents[i][1] <= d[p] && d[p] <= extents[i][0];
            
            if(!check_1 && !(eliminato)){
                eliminato = true
                ids.pop()
            }
            return check_1
            }) ? true : false;
        });
        foreground.classed("normal", function(d) {
            ids.push(d.id)
            eliminato = false
            return dimensions.every(function(p, i) {
                
                check_2 = extents[i][0]==0 && extents[i][1]==0
                if(check_2) return true;
                
            check_1 = extents[i][1] <= d[p] && d[p] <= extents[i][0];
            
            if(!check_1 && !(eliminato)){
                eliminato = true
                ids.pop()
            }
            return check_1
            }) ? false : true;
        });
        //foreground.raise()


        var area_1 = d3.select("#area_1")
        area_1.selectAll(".dot").style("fill", function(d) {  
            for(t=0;t<ids.length;t++){
                if(ids[t] == d.id){
                    return "red"
                }
            }
            return "rgb(66, 172, 66)"
        });
    }
}

d3.csv("../datasets/dataset_500.csv", function(error, data) {

    chiavi= d3.keys(data[0])
    if (error) throw error;
      var l=data.length;
      for (i=0;i<l;i++) {
        data[i].id=i
      }
      drawParallel(data)
})
    
    