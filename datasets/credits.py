import pandas as pd
import numpy as np
import re

ds = pd.read_csv('./kaggle/credits.csv')
ds = ds[['id', 'crew']]

ds['crew'] = ds['crew'].apply(lambda c:
    "" if (len(re.findall(r"('Director', 'name': ')([^']+)",c))==0) 
    else re.findall(r"('Director', 'name': ')([^']+)",c)[0][-1]
)
print(ds.head)
ds.to_csv('directors.csv', index=False)