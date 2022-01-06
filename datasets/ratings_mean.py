import pandas as pd

id_info=pd.read_csv('ratings.csv')
df = id_info[['movieId','rating']]

df.groupby('movieId', as_index=False) \
    .agg(reviews_number=('rating', 'size'), user_rating=('rating', 'mean')) \
    .to_csv('ratings_mean.csv', index=False)
