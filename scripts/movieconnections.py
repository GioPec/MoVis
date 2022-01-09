import requests
from bs4 import BeautifulSoup
import csv
import pandas as pd
import re
from functools import reduce

from utils import path_constants

def sum(a, b):
    return a + "|" + b

progress = 0

in_categories = ["followedby", "remadeas", "editedinto", "spinoff", "referencedin", "featuredin", "spoofedin"]
out_categories = ["follows", "remakeof", "editedfrom", "spinofffrom", "references", "features", "spoofs"]
connection_categories = ["followed_by", "remade_as", "follows", "remake_of"]

id_info = pd.read_csv(path_constants.DATASET)
df = id_info[['imdb_id']]

with open(path_constants.FILM_CONNECTIONS, 'a') as out_file:
    csv_writer = csv.writer(out_file)
    #csv_writer.writerow(["imdb_id","in_connections","out_connections","tot_connections","connected_movies"])
    for i in df.values:

        if(progress%100==0): print(progress)
        progress+=1

        id_film = str(i[0])
        id_film = "0"*(7-len(id_film)) + id_film
        link = "https://m.imdb.com/title/tt" + id_film + "/movieconnections/"
        page = requests.get(link)
        in_count = 0
        out_count = 0
        
        if (page.status_code == 200):
            soup = BeautifulSoup(page.content, 'html.parser')
            '''
            In and out connections
            '''
            connection = soup.find("div", attrs={"class": "jumpto"})
            if (connection==None): 
                csv_writer.writerow([id_film,0,0,0,"N"])
            else:
                allowed_characters = ["abcdefghijklmnopqrstuvwxyz1234567890()-,"]
                #print(connection.text.lower().encode("ascii", "ignore").decode('UTF-8'))
                #print(re.sub(r'[^\x00-\x7F]+','', connection.text))
                connections = re.sub(r'[^abcdefghijklmnopqrstuvwxyz1234567890(,\n]+',' ', connection.text.lower())
                connections = re.sub(r'[, ]','',connections)
                connections = re.sub(r'[(]',' ',connections)
                #print(connections)
                connections_list = connections.split("\n")
                connections_list = connections_list[2:]
                for c in connections_list:
                    couple = c.split()
                    #print(couple)
                    if (couple[0] in in_categories): in_count+=int(couple[1])
                    elif (couple[0] in out_categories): out_count+=int(couple[1])
                    #else: print(couple[0])
                #print(connections_list)
                #csv_writer.writerow([id_film,in_count, out_count, in_count+out_count])
                #print([id_film,in_count, out_count, in_count+out_count])
                '''
                Connected movies
                '''
                div_list = soup.find("div", attrs={"id": "connections_content"}).find("div", attrs={"class": "list"})
                div_list = str(div_list).split("<a id")
                connectedIds = []
                for cc in connection_categories:
                    for dl in div_list:
                        if "=\""+cc+"\"" in dl:
                            res = re.findall(r'[0-9]{7}', dl)
                            connectedIds = connectedIds + res

                conn = reduce(sum,connectedIds) if (len(connectedIds)!=0) else "N"
                #print(str(connectedIds) + " " + str(len(connectedIds)) + " " + id_film)

                csv_writer.writerow([id_film,in_count, out_count, in_count+out_count, conn])

            
        else:
            if (page.status_code==404):
                csv_writer.writerow([id_film,0,0,0,[]])
            else:
                print(id_film + "FAILED!")
                csv_writer.writerow([id_film,"N","N","N","N"])

