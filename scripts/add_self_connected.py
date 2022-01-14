import pandas as pd
import numpy as np
import re
from functools import reduce

from utils import path_constants

ds = pd.read_csv(path_constants.DATASET)

def sum(a, b):
    return a + "|" + b

ds['imdb_id'] = ds['imdb_id'].apply(lambda g:
    "0"*(7-len(str(g))) + str(g)
)

ds['connected_movies'] = ds['connected_movies'] + "|" + ds['imdb_id'].astype(dtype=str)

ds['connected_movies'] = ds['connected_movies'].apply(lambda g:
    g.replace('N|','')
)

ds.to_csv(path_constants.DATASET, index=False)

print(ds.head())