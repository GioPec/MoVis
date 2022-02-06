import pandas as pd
import numpy as np
import re

ds = pd.read_csv('./datasets/dataset.csv')
ds = ds[['imdb_id', 'title', 'release_date',
       'budget',  'revenue', 'runtime',
       'vote_average', 'vote_count', 'popularity',
       'movielens_id','tmdb_id','genres','director','in_connections',
       'out_connections','tot_connections','connected_movies']]

ds_mds = pd.read_csv('./datasets/mds_results_new.csv')
ds_mds = ds_mds[['0','1', '2']]

ds = ds.join(ds_mds.set_index('2'), on='imdb_id')

ds['imdb_id'] = ds['imdb_id'].apply(lambda g:
    "0"*(7-len(str(g))) + str(g)
)

print(ds.head)
ds.to_csv('./datasets/dataset_mds.csv', index=False)