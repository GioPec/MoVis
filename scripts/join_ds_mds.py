import pandas as pd
import numpy as np
import re

from utils import path_constants

ds_imdb = pd.read_csv(path_constants.DATASET_250)
ds_imdb = ds_imdb[['imdb_id', 'title', 'year',
       'budget', 'actual_budget', 'revenue', 'actual_revenue', 'runtime',
       'vote_average', 'vote_count', 'popularity',
       'movielens_id','tmdb_id','genres','director',
       'in_connections','out_connections','tot_connections',
       'connected_movies']]

ds_mds = pd.read_csv(path_constants.MDS_RESULTS_250)
ds_mds = ds_mds[['id', '0', '1']]

##########################################################################################

ds = ds_imdb.join(ds_mds.set_index('id'), on='imdb_id')

print(ds.head)
ds.to_csv(path_constants.DATASET_MDS_250, index=False)

