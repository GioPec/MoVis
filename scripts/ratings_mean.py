import pandas as pd

from utils import path_constants

id_info=pd.read_csv(path_constants.RATINGS)
df = id_info[['movieId','rating']]

df.groupby('movieId', as_index=False) \
    .agg(reviews_number=('rating', 'size'), user_rating=('rating', 'mean')) \
    .to_csv(path_constants.RATINGS_MEAN, index=False)
