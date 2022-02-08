import pandas as pd
import numpy as np
import re

from utils import path_constants

"""
CREATION OF THE DOLLAR_VALUE COLUMN

ds = pd.read_csv(path_constants.INFLATION)
ds['dollar_value'] = ds['amount'].apply(lambda c:
    round(27.60/c, 2)
)
ds.to_csv(path_constants.DIRECTORS, index=False)
"""

ds = pd.read_csv(path_constants.DATASET_MDS_NEW)
#ds = ds[['imdb_id', 'title', 'year', 'budget', 'revenue']]
ds_inflation = pd.read_csv(path_constants.INFLATION)
ds_inflation = ds_inflation[['year', 'dollar_value']]

ds = ds.join(ds_inflation.set_index('year'), on='year')

'''
ds['actual_budget'] = ds.apply(lambda b:
    #round(27.60/c, 2)
    b['budget']
)
ds['actual_revenue'] = ds.apply(lambda r:
    #round(27.60/c, 2)
    r['revenue']
)
'''

# APPROXIMATION
ds['budget'] = round(ds['budget'], 2)
ds['revenue'] = round(ds['revenue'], 2)

ds['actual_budget'] = round(ds['budget'] * ds['dollar_value'], 2)
ds['actual_revenue'] = round(ds['revenue'] * ds['dollar_value'], 2)


print(ds.head)
# REORDER AND REMOVE DOLLAR_VALUE
ds = ds[['imdb_id', 'title', 'year',
       'budget', 'actual_budget', 'revenue', 'actual_revenue', 'runtime',
       'vote_average', 'vote_count', 'popularity',
       'movielens_id','tmdb_id','genres','director',
       'in_connections','out_connections','tot_connections',
       'connected_movies']]
ds.to_csv(path_constants.DATASET_MDS_NEW, index=False)