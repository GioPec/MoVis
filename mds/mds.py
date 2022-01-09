import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
from sklearn import manifold
import time
from tqdm import tqdm

from utils import path_constants

start_time = time.time()

def jaccard(s1,s2):
    if (s1=="N" or s2=="N"): return 0
    u=set(s1.split("|")).union(set(s2.split("|")))
    i=set(s1.split("|")).intersection(set(s2.split("|")))
    return(len(i)/len(u))

def samePosition(s1,s2):
    tot=0
    for i in range( min(len(s1),len(s2))):
        if s1[i]==s2[i]:
            tot+=1
    return(tot/min(len(s1),len(s2)))

df = pd.read_csv(path_constants.DATASET_500)
df = df[['imdb_id', 'title', 'genres','connected_movies']]

g = df['genres'].values
cm = df['connected_movies'].values
ids = df['imdb_id'].values
titles = df['title'].values

dissM1=np.zeros((len(g),len(g))) #creates a zeros dissM (5000x5000)
dissM2=np.zeros((len(cm),len(cm)))
dissM3=np.zeros((len(titles),len(titles)))

for i in tqdm(range(len(g))):
    for j in range (len(g)):
        dissM1[i][j]=1-jaccard(g[i],g[j])
        dissM2[i][j]=1-jaccard(cm[i],cm[j])
        dissM2[i][j]=1-samePosition(titles[i],titles[j])

dissM = 0.1*dissM1 + 0.3*dissM2 + 0.01*dissM3

print("Finished matrix")
print("--- %s seconds ---" % (time.time() - start_time))

mds = manifold.MDS(n_components=2, max_iter=10000, eps=1e-3, dissimilarity="precomputed", random_state=0)
pos = mds.fit(dissM).embedding_

print("Finished MDS")
print("--- %s seconds ---" % (time.time() - start_time))

s = 5
plt.scatter(pos[:,0], pos[:,1], color='black',s=s, lw=0)
plt.show()

for label, x, y in zip(titles, pos[:,0], pos[:,1]):
    plt.annotate(
        label,
        xy = (x, y), xytext = (7, -5),
        textcoords = 'offset points', ha = 'right', va = 'bottom',
        bbox = dict(boxstyle = 'round,pad=0.1', fc = 'blue', alpha = 0.2)) 
plt.show()

print("Finished plot")
print("--- %s seconds ---" % (time.time() - start_time))
