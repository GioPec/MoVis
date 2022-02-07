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

        var areas = document.getElementsByClassName("area")
        for (let a of areas) {
            //if (l.hasAttribute("class", "darkfill"))
            a.setAttribute("class", "area lightborder")
        }

        document.getElementsByClassName("domain").style("stroke", "FFF");
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

        var areas = document.getElementsByClassName("area")
        for (let a of areas) {
            //if (l.hasAttribute("class", "darkfill"))
            a.setAttribute("class", "area darkborder")
        }
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