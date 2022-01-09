import requests
import csv
import pandas as pd

from utils import path_constants

id_info = pd.read_csv(path_constants.MOVIES_METADATA)
#df = id_info[['imdbId']]

print(id_info.keys())