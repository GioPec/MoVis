import pandas as pd
import numpy as np
import re

from utils import path_constants

ds = pd.read_csv(path_constants.DATASET_MDS_NEW)
#ds = ds[['imdb_id', 'title', 'year', 'budget', 'revenue']]

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

#ds_pop = ds['popularity']
#ds = ds[ds['year']<2015]

ds = ds.nlargest(250,'popularity')

print(ds.head)
ds.to_csv(path_constants.DATASET_250, index=False)