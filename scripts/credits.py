import pandas as pd
import numpy as np
import re

from utils import path_constants

ds = pd.read_csv(path_constants.CREDITS)
ds = ds[['id', 'crew']]

ds['crew'] = ds['crew'].apply(lambda c:
    "" if (len(re.findall(r"('Director', 'name': ')([^']+)",c))==0) 
    else re.findall(r"('Director', 'name': ')([^']+)",c)[0][-1]
)
print(ds.head)
#ds.to_csv(path_constants.DIRECTORS, index=False)