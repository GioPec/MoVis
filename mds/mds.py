import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
from sklearn import manifold
import time
from tqdm import tqdm

from utils import path_constants

start_time = time.time()

def sameDirector(s1,s2):
    if (s1==s2): return 1
    return 0

def jaccard(s1,s2):
    if (s1=="N" or s2=="N"): return 0
    u=set(s1.split("|")).union(set(s2.split("|")))
    i=set(s1.split("|")).intersection(set(s2.split("|")))
    return(len(i)/len(u))

def euclideanDistance(s1,s2):
    s1=float(s1)
    s2=float(s2)
    return abs(s1-s2)**2

def samePosition(s1,s2):
    tot=0
    for i in range( min(len(s1),len(s2))):
        if s1[i]==s2[i]:
            tot+=1
    return(tot/min(len(s1),len(s2)))

df_all = pd.read_csv(path_constants.DATASET)
df = df_all[['imdb_id', 'title', 'genres','connected_movies', 'director']]
dfn = df_all[['release_date','budget','revenue','runtime','vote_average','vote_count','popularity',
    'in_connections','out_connections','tot_connections']]

imdb_id = df['imdb_id'].values
titles = df['title'].values
genres = df['genres'].values
connected_movies = df['connected_movies'].values
director = df['director'].values

dfn['release_date'] = dfn['release_date'].apply(lambda g:
    g[:4]
)
release_date = dfn['release_date'].values
budget = dfn['budget'].values
revenue = dfn['revenue'].values
runtime = dfn['runtime'].values
vote_average = dfn['vote_average'].values
vote_count = dfn['vote_count'].values
popularity = dfn['popularity'].values
in_connections = dfn['in_connections'].values
out_connections = dfn['out_connections'].values
tot_connections = dfn['tot_connections'].values

##########################################################################################

#create zeros dissM (5000x5000)
dissM_genres = np.zeros((len(imdb_id),len(imdb_id)))
dissM_connectedmovies = np.zeros((len(imdb_id),len(imdb_id)))
dissM_titles = np.zeros((len(imdb_id),len(imdb_id)))
dissM_directors = np.zeros((len(imdb_id),len(imdb_id)))
dissM_release_date = np.zeros((len(imdb_id),len(imdb_id)))
dissM_budget = np.zeros((len(imdb_id),len(imdb_id)))
dissM_revenue = np.zeros((len(imdb_id),len(imdb_id)))
dissM_runtime = np.zeros((len(imdb_id),len(imdb_id)))
dissM_vote_average = np.zeros((len(imdb_id),len(imdb_id)))
dissM_vote_count = np.zeros((len(imdb_id),len(imdb_id)))
dissM_popularity = np.zeros((len(imdb_id),len(imdb_id)))
dissM_in_connections = np.zeros((len(imdb_id),len(imdb_id)))
dissM_out_connections = np.zeros((len(imdb_id),len(imdb_id)))
dissM_tot_connections = np.zeros((len(imdb_id),len(imdb_id)))

for i in tqdm(range(len(imdb_id))):
    for j in range (len(imdb_id)):
        dissM_genres[i][j] = 1-jaccard(genres[i],genres[j])
        dissM_connectedmovies[i][j] = 1-jaccard(connected_movies[i],connected_movies[j])
        dissM_titles[i][j] = 1-samePosition(titles[i],titles[j])
        dissM_directors[i][j] = 1-sameDirector(director[i],director[j])

        dissM_release_date[i][j] = euclideanDistance(release_date[i], release_date[j])
        dissM_budget[i][j] = euclideanDistance(budget[i], budget[j])
        dissM_revenue[i][j] = euclideanDistance(revenue[i], revenue[j])
        dissM_runtime[i][j] = euclideanDistance(runtime[i], runtime[j])
        dissM_vote_average[i][j] = euclideanDistance(vote_average[i], vote_average[j])
        dissM_vote_count[i][j] = euclideanDistance(vote_count[i], vote_count[j])
        dissM_popularity[i][j] = euclideanDistance(popularity[i], popularity[j])
        dissM_in_connections[i][j] = euclideanDistance(in_connections[i], in_connections[j])
        dissM_out_connections[i][j] = euclideanDistance(out_connections[i], out_connections[j])
        dissM_tot_connections[i][j] = euclideanDistance(tot_connections[i], tot_connections[j])

#dissM = dissM_directors#0.1*dissM_genres + 0.3*dissM_connectedmovies + 0.01*dissM_titles
dissM = 0.00001*dissM_popularity

print("Finished matrix")
print("--- %s seconds ---" % (time.time() - start_time))

mds = manifold.MDS(n_components=2, max_iter=100, eps=1e-3, dissimilarity="precomputed", random_state=0)
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
