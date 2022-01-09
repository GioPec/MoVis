'''
with open(path_constants.FILM_CONNECTIONS,'r+') as file:
    for line in file:
        if (line!="\n"):
            file.write(line)
'''
import fileinput
from utils import path_constants

file = open(path_constants.FILM_CONNECTIONS,'r+')
for line in file.readlines():
    print(line)
    if line.rstrip():
        file.write(line)