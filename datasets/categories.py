from numpy.core.einsumfunc import _compute_size_by_dict
import pandas as pd

id_info = pd.read_csv('movielens/genres.csv')
df = id_info[['genres']]

categories = df.values.tolist()
d = {}
for c in categories:
    row = c[0].split("|")
    for r in row:
        l = len(row)
        pippo = 0
        if (l==1):
            pippo = 1
        keys = d.keys()
        if r in keys:
            d[r][0]+=1
            d[r][1]+=pippo
        else: d[r]=[1,pippo]

print(d)

'''
Animation
Fantasy
  Comedy
  dramatic comedies
  Drama
Action/adventure
Horror/thriller
Sci-Fi
Musical
Western

Documentary
(no genres listed)
Other
'''