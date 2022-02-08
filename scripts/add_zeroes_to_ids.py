import pandas as pd
import numpy as np
import re
from functools import reduce

from utils import path_constants

ds = pd.read_csv(path_constants.MDS)

ds['2'] = ds['2'].apply(lambda g:
    "0"*(7-len(str(g))) + str(g)
)

#ds.to_csv(path_constants.MDS_RESULTS_NEW, index=False)
print(ds.head())