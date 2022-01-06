import pandas as pd
import numpy as np
import re

ds_imdb = pd.read_csv('./kaggle/dataset_imdb.csv')
ds_imdb = ds_imdb[['imdb_id', 'title', 'release_date',
       'budget',  'revenue', 'runtime',
       'vote_average', 'vote_count', 'popularity']]

ds_links = pd.read_csv('./movielens/links.csv')
ds_links = ds_links[['movielens_id', 'imdb_id', 'tmdb_id']]

ds_movies = pd.read_csv('./movielens/genres_rewritten.csv')
ds_movies = ds_movies[['movieId', 'genres']]

#ds_credits = pd.read_csv('./kaggle/credits.csv')
#ds_credits = ds_credits[['id', 'crew']]

ds_directors = pd.read_csv('./kaggle/directors.csv')
ds_directors = ds_directors[['id', 'director']]

ds = ds_imdb.join(ds_links.set_index('imdb_id'), on='imdb_id')
ds = ds.join(ds_movies.set_index('movieId'), on='movielens_id')
#ds = ds.join(ds_credits.set_index('id'), on='tmdb_id')
ds = ds.join(ds_directors.set_index('id'), on='tmdb_id')

ds = ds.dropna()
ds = ds.drop_duplicates(subset=["imdb_id"])

print(ds.head)
ds.to_csv('dataset.csv', index=False)

