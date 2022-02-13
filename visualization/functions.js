import{MDSreadCSV} from "./mds.js"
import{chordReadCSV} from "./chord.js"
import{parCorReadCSV} from "./par_cor.js"

var actual = false

var DATASET_PATH = "../datasets/DATASET_MDS_NEW.csv"

/* var changeDatasetCheckbox = document.getElementById("changeDatasetCheckbox")
changeDatasetCheckbox.addEventListener("click", changeDataset)

var changeDatasetCheckbox1000 = document.getElementById("changeDataset1000Checkbox")
changeDatasetCheckbox1000.addEventListener("click", changeDataset1000) */

var changeDatasetSelect = document.getElementById("changeDatasetSelect")
changeDatasetSelect.addEventListener("change", changeDataset)


var inflactionCheckbox = document.getElementById("inflactionCheckbox")
inflactionCheckbox.addEventListener("click", adjustForInflaction)

function changeDataset() {
    var selected_size = document.getElementById("changeDatasetSelect").value
    if (selected_size=="250") changeDataset250()
    else if (selected_size=="1000") changeDataset1000()
    else if (selected_size=="5000") changeDataset5000()
}

function changeDataset250() {
    DATASET_PATH = "../datasets/DATASET_MDS_250.csv"
    parCorReadCSV(DATASET_PATH)
    MDSreadCSV(DATASET_PATH)
    chordReadCSV(DATASET_PATH)
}

function changeDataset1000() {
    DATASET_PATH = "../datasets/DATASET_MDS_1000.csv"
    parCorReadCSV(DATASET_PATH)
    MDSreadCSV(DATASET_PATH)
    chordReadCSV(DATASET_PATH)
}

function changeDataset5000() {
    DATASET_PATH = "../datasets/DATASET_MDS_NEW.csv"
    parCorReadCSV(DATASET_PATH)
    MDSreadCSV(DATASET_PATH)
    chordReadCSV(DATASET_PATH)
}

function adjustForInflaction() {
    actual = !actual
    parCorReadCSV(DATASET_PATH, actual)
}

export const color_base = "rgb(105, 179, 162)"
export const color_brushed = "rgb(255, 62, 62)"
export const color_selected = "rgb(200, 200, 60)"

export const color_tooltip_light = "rgb(225, 213, 168)"
export const color_tooltip_dark = "rgb(34, 54, 52)"


