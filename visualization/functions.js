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
    DATASET_PATH = (DATASET_PATH=="../datasets/DATASET_MDS_NEW.csv") ? ("../datasets/DATASET_MDS_NEW_500.csv") : ("../datasets/DATASET_MDS_NEW.csv")
    parCorReadCSV(DATASET_PATH)
    MDSreadCSV(DATASET_PATH)
    chordReadCSV(DATASET_PATH)
}

function adjustForInflaction() {
    actual = !actual
    parCorReadCSV(DATASET_PATH, actual)
}