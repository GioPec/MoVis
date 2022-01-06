import pandas as pd
import numpy as np
import re

id_info = pd.read_csv('../movies_metadata.csv')

df = id_info[['imdb_id', 'title', 'release_date',
       'budget',  'revenue', 'runtime',
       'status', 'vote_average', 'vote_count', 'popularity']]

df = df.dropna()    #45000

df = df.drop(df[
    (df.budget == '0') #8000+ 
    | (df.revenue < 1) #5000+
    | (df.runtime < 40) #5000+
    | (df.runtime > 240) #5000+
    | (df.status != "Released")
    ].index)

df = df[['imdb_id', 'title', 'release_date',
       'budget',  'revenue', 'runtime',
       'vote_average', 'vote_count', 'popularity']]

df['budget'] = df['budget'].astype(int)
df['revenue'] = df['revenue'].astype(int)
df['runtime'] = df['runtime'].astype(int)
df['vote_count'] = df['vote_count'].astype(int)
df['popularity'] = df['popularity'].astype(float)
print(df.dtypes)

df['imdb_id'] = df['imdb_id'].apply(lambda x: x[2:])
# uncomment to delete months and days
# df['release_date'] = df['release_date'].apply(lambda x: x[:4])

df.to_csv('dataset_imdb.csv', index=False)
