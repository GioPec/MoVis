import pandas as pd
import numpy as np
import re
from functools import reduce

ds = pd.read_csv('./movielens/genres.csv')

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
ds.to_csv('genres_rewritten.csv', index=False)