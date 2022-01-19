import pandas as pd
import numpy as np
import re
from functools import reduce

from utils import path_constants

ds = pd.read_csv("./datasets/mds_first_attempt.csv")

ds['2'] = ds['2'].apply(lambda g:
    "0"*(7-len(str(g))) + str(g)
)

ds.to_csv(path_constants.MDS_500, index=False)

print(ds.head())