import pandas as pd
import numpy as np
import re

from utils import path_constants

ds_imdb = pd.read_csv(path_constants.DATASET)
ds_imdb = ds_imdb[['imdb_id', 'title', 'release_date',
       'budget',  'revenue', 'runtime',
       'vote_average', 'vote_count', 'popularity']]

ds_links = pd.read_csv(path_constants.LINKS)
ds_links = ds_links[['movielens_id', 'imdb_id', 'tmdb_id']]

ds_movies = pd.read_csv(path_constants.GENRES_REWRITTEN)
ds_movies = ds_movies[['movieId', 'genres']]

ds_connections = pd.read_csv(path_constants.FILM_CONNECTIONS)
ds_connections = ds_connections[['imdb_id','in_connections','out_connections','tot_connections','connected_movies']]

#ds_credits = pd.read_csv(path_constants.CREDITS)
#ds_credits = ds_credits[['id', 'crew']]

ds_directors = pd.read_csv(path_constants.DIRECTORS)
ds_directors = ds_directors[['id', 'director']]

##########################################################################################

ds = ds_imdb.join(ds_links.set_index('imdb_id'), on='imdb_id')
ds = ds.join(ds_movies.set_index('movieId'), on='movielens_id')
#ds = ds.join(ds_credits.set_index('id'), on='tmdb_id')
ds = ds.join(ds_directors.set_index('id'), on='tmdb_id')
ds = ds.join(ds_connections.set_index('imdb_id'), on='imdb_id')

ds = ds.dropna()
ds = ds.drop_duplicates(subset=["imdb_id"])

ds = ds.drop(ds[
    (ds.vote_count == 0)
    | (ds.vote_average == 0.0)
    | (ds.budget == 0)
    | (ds.revenue == 0)
    ].index)

ds['release_date'] = ds['release_date'].apply(lambda x: x[:4])
ds['budget'] = ds['budget'].apply(lambda x: x/1000000)
ds['revenue'] = ds['revenue'].apply(lambda x: x/1000000)

print(ds.head)
ds.to_csv(path_constants.DATASET, index=False)

