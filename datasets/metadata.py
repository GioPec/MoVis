import requests
import csv
import pandas as pd

id_info = pd.read_csv('../movies_metadata.csv')
#df = id_info[['imdbId']]

print(id_info.keys())