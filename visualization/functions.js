import{MDSreadCSV} from "./mds.js"
import{chordReadCSV} from "./chord.js"
import{parCorReadCSV} from "./par_cor.js"

var actual = false

var DATASET_PATH = "../datasets/DATASET_MDS_NEW.csv"

var changeDatasetCheckbox = document.getElementById("changeDatasetCheckbox")
changeDatasetCheckbox.addEventListener("click", changeDataset)

var inflactionCheckbox = document.getElementById("inflactionCheckbox")
inflactionCheckbox.addEventListener("click", adjustForInflaction)

function changeDataset() {
    DATASET_PATH = (DATASET_PATH=="../datasets/DATASET_MDS_NEW.csv") ? ("../datasets/DATASET_MDS_250.csv") : ("../datasets/DATASET_MDS_NEW.csv")
    parCorReadCSV(DATASET_PATH)
    MDSreadCSV(DATASET_PATH)
    chordReadCSV(DATASET_PATH)
/*     d3.select("#svg4").selectAll("path").attr("class", function(){
    return (checkIfDarkMode()) ? ("lightstroke") : ("darkstroke")
    }) */
}

function adjustForInflaction() {
    actual = !actual
    parCorReadCSV(DATASET_PATH, actual)
}

export const color_base = "#69b3a2"
export const color_brushed = "#ff3e3e"
//export const color_selected = "rgb(155, 156, 47)"
export const color_selected = "rgb(200, 200, 60)"

export const color_tooltip_light = "rgb(225, 213, 168)"
export const color_tooltip_dark = "rgb(34, 54, 52)"


