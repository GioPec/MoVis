export function darkMode() {
    var isDarkChecked = document.getElementById("darkModeCheckbox").checked
    if (isDarkChecked) {


        

        document.getElementById('body').setAttribute("class", "dark")

        var domains = document.getElementsByClassName("domain")
        for (let p of domains) {
            p.setAttribute("class", "domain lightstroke")
        }

        var lines = document.getElementsByTagName("line")
        for (let l of lines) {
            //if (l.hasAttribute("class", "darkfill"))
            l.setAttribute("class", "lightstroke")
        }

        var texts = document.getElementsByTagName("text")
        for (let t of texts) {
            //if (l.hasAttribute("class", "darkfill"))
            t.setAttribute("class", "lightfill")
        }

        d3.select("#area_1").style("border", "1px solid rgb(200,200,200)")
        d3.select("#area_2").style("border", "1px solid rgb(200,200,200)")
        d3.select("#area_3").style("border", "1px solid rgb(200,200,200)")
        d3.select("#area_4").style("border", "1px solid rgb(200,200,200)")
        d3.select("#area_5").style("border", "1px solid rgb(200,200,200)")

        var cb = document.getElementsByClassName("chord_back")
        for (let c of cb) {
            //if (l.hasAttribute("class", "darkfill"))
            c.setAttribute("class", "chord_back darkbackground")
        }

        d3.select(".area_3_g_x").selectAll("path").attr("class", function(){
          return (isDarkChecked) ? ("lightstroke") : ("darkstroke")
        })
        d3.select(".area_3_g_y").selectAll("path").attr("class", function(){
          return (isDarkChecked) ? ("lightstroke") : ("darkstroke")
        })

        d3.select("#svg_2").selectAll("path").attr("class", function(){
          return (isDarkChecked) ? ("lightstroke") : ("darkstroke")
        })
        d3.select("#svg1").selectAll("path").attr("class", function(){
          return (isDarkChecked) ? ("lightstroke") : ("darkstroke")
        })

        //document.getElementsByClassName("domain").style("stroke", "FFF");
        
        d3.selectAll(".bubble").attr("class", " bubble lightstroke")
    }

    else {
        //document.getElementById('body').removeAttribute("class", "dark")
        document.getElementById("body").setAttribute("class", "light")

        var domains = document.getElementsByClassName("domain")
        for (let p of domains) {
            p.setAttribute("class", "domain darkstroke")
        }

        var lines = document.getElementsByTagName("line")
        for (let l of lines) {
            //if (l.hasAttribute("class", "darkfill"))
            l.setAttribute("class", "darkstroke")
        }

        var texts = document.getElementsByTagName("text")
        for (let t of texts) {
            //if (l.hasAttribute("class", "darkfill"))
            t.setAttribute("class", "darkfill")
        }

        d3.select("#area_1").style("border", "1px solid black")
        d3.select("#area_2").style("border", "1px solid black")
        d3.select("#area_3").style("border", "1px solid black")
        d3.select("#area_4").style("border", "1px solid black")
        d3.select("#area_5").style("border", "1px solid black")

        var cb = document.getElementsByClassName("chord_back")
        for (let c of cb) {
            //if (l.hasAttribute("class", "darkfill"))
            c.setAttribute("class", "chord_back lightbackground")
        }

        d3.select(".area_3_g_x").selectAll("path").attr("class", function(){
          return (isDarkChecked) ? ("lightstroke") : ("darkstroke")
        })
        d3.select(".area_3_g_y").selectAll("path").attr("class", function(){
          return (isDarkChecked) ? ("lightstroke") : ("darkstroke")
        })

        d3.select("#svg_2").selectAll("path").attr("class", function(){
          return (isDarkChecked) ? ("lightstroke") : ("darkstroke")
        })
        d3.select("#svg1").selectAll("path").attr("class", function(){
          return (isDarkChecked) ? ("lightstroke") : ("darkstroke")
        })

        d3.selectAll(".bubble").attr("class", " bubble darkstroke")
    }
}

var c = document.getElementById("darkModeCheckbox")
c.addEventListener("click", darkMode)

/*

.dark {
    background-color: rgb(30, 30, 30);
    //stroke: rgb(200, 200, 200);
    color: rgb(200, 200, 200);
    fill: rgb(200, 200, 200);
    border-color: rgb(200, 200, 200);
  }
  
  .dark text {
    background-color: rgb(30, 30, 30);
    //stroke: rgb(200, 200, 200);
    color: rgb(200, 200, 200);
    fill: rgb(200, 200, 200);
    //border-color: rgb(200, 200, 200);
  }
  
  .dark svg {
    //background-color: rgb(30, 30, 30);
    //stroke: rgb(200, 200, 200);
    color: rgb(200, 200, 200);
  }
  
  .dark g {
    //background-color: rgb(30, 30, 30);
    //stroke: rgb(200, 200, 200);
    color: rgb(200, 200, 200);
  }
  
  .dark label {
    //background-color: rgb(30, 30, 30);
    //stroke: rgb(200, 200, 200);
    color: rgb(200, 200, 200);
  }
  
  .dark rect {
    background-color: rgb(30, 30, 30);
    //stroke: rgb(200, 200, 200);
    color: rgb(200, 200, 200);
  }
  
  .dark line {
    background-color: rgb(30, 30, 30);
    stroke: rgb(200, 200, 200);
    color: rgb(200, 200, 200);
  }
  
  //.dark path {
    background-color: rgb(30, 30, 30);
    stroke: rgb(200, 200, 200);
    color: rgb(200, 200, 200);
  }
  
  .dark svg {
    background-color: rgb(30, 30, 30);
    //stroke: rgb(200, 200, 200);
    color: rgb(200, 200, 200);
  } 
  
*/ 