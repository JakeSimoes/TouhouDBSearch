"""
This code uses the touhou-music database's TLMC links to find the cover art of an album.
It then copies the file with a name set to the album ID for quick reference.
"""



import os
import sqlite3
import shutil

failedPaths = []

def findArt(path):
    found = ""
    try:
        giveawayNames = ["cover", "front", "art"]

        imageNames = [image for image in os.listdir(path) if '.' in image]

        i = 0
        while (i < len(imageNames) and not found):
            for giveawayName in giveawayNames:
                if giveawayName in imageNames[i].lower():
                    found = imageNames[i]
                    break   
            i += 1

        if (not found):
            if (any(name[-5].isdigit() for name in imageNames)):
                
                i = 5
                while (imageNames[0][-i].isdigit()):
                    i += 1
                numbers = i-5
                
                min = 1000
                minName = ""
                for name in imageNames:
                    if int(name[-(4+numbers):-4]) < min:
                        min = int(name[-(4+numbers):-4])
                        minName = name
            
                found = minName
    except Exception as e:
        print(e)
        failedPaths.append(path)
        found = ""
    
    return found


conn = sqlite3.connect('touhou-music.db')
conn.row_factory = sqlite3.Row

page = 0

while (page+1)*30 < 19000:
    print(page)
    albums = conn.execute("SELECT * FROM albums_index LIMIT {}, {}".format(page*30, 30)).fetchall()
    # print("SELECT * FROM albums_index LIMIT {}, {}".format(page*30, (page+1)*30))
    for album in albums:
        if (album[3]):
            file = findArt("{}/{}".format("Touhou lossless music collection", album[3]))
            if (file):
                # print(str(album[0]))    
                shutil.copyfile("Touhou lossless music collection/" + album[3] + "/" + file, str(album[0]) + file[-4:], "static/covers")
    albums = ""
    page += 1

