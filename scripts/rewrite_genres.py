import pandas as pd
import numpy as np
import re
from functools import reduce

from utils import path_constants

ds = pd.read_csv(path_constants.GENRES)

def sum(a, b):
    return a + "|" + b

ds['genres'] = ds['genres'].apply(lambda g:
    [] if ("(" in g) else g.split("|")
)
ds['genres'] = ds['genres'].apply(lambda g:
    [x for x in g if x not in ['IMAX','Children','Family','Mystery','Romance','Film-Noir','Crime','War']]
)
ds['genres'] = ds['genres'].apply(lambda g:
    reduce(sum,g) if (len(g)!=0) else ""
)

print(ds.head)
#ds.to_csv(path_constants.GENRES_REWRITTEN, index=False)