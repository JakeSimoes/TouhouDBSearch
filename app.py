from flask import Flask, render_template, url_for, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
import json
import sqlite3
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///touhou-music.db'
db = SQLAlchemy(app)

class tracks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=False, nullable=False)
    track_number = db.Column(db.Integer)
    album_id = db.Column(db.Integer)
    release_circle_id = db.Column(db.Integer)
    songtrack_artist_id = db.Column(db.Integer)

    

@app.route('/', methods=['POST', 'GET'])

def index():
    if request.method == 'GET':
        pass
        return render_template('home.html')
    else:
        return render_template('home.html')
    
@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query', '')
    conn = sqlite3.connect('touhou-music.db')
    conn.row_factory = sqlite3.Row
    genres = conn.execute('SELECT * FROM genres WHERE genre LIKE ?', ('%' + query + '%',)).fetchall()
    conn.close()
    results = [{'name': genre['genre'], 'id': genre['genre']} for genre in genres]
    return jsonify(results)

@app.route('/search2', methods=['GET'])
def search2():
    query = request.args.get('query', '')
    conn = sqlite3.connect('touhou-music.db')
    conn.row_factory = sqlite3.Row
    albums = conn.execute('SELECT * FROM source_tracks WHERE name LIKE ?', ('%' + query + '%',)).fetchall()
    conn.close()
    results = [{'name': album['name'], 'id': album['id']} for album in albums]
    return jsonify(results)

@app.route('/search3', methods=['GET'])
def search3():
    query = request.args.get('query', '')
    conn = sqlite3.connect('touhou-music.db')
    conn.row_factory = sqlite3.Row
    circles = conn.execute('SELECT * FROM release_circle_index WHERE name LIKE ?', ('%' + query + '%',)).fetchall()
    conn.close()
    results = [{'name': circle['name'], 'id': circle['id']} for circle in circles]
    return jsonify(results)

@app.route('/search4', methods=['GET'])
def search4():
    query = request.args.get('query', '')
    conn = sqlite3.connect('touhou-music.db')
    conn.row_factory = sqlite3.Row
    artists = conn.execute('SELECT * FROM songtrack_artist_index WHERE name LIKE ?', ('%' + query + '%',)).fetchall()
    conn.close()
    results = [{'name': artist['name'], 'id': artist['id']} for artist in artists]
    return jsonify(results)

# @app.route('/search5', methods=['GET'])
# def search5():
#     query = request.args.get('query', '')
#     conn = sqlite3.connect('touhou-music.db')
#     conn.row_factory = sqlite3.Row
#     circles = conn.execute('SELECT * FROM release_circle_index WHERE name LIKE ?', ('%' + query + '%',)).fetchall()
#     conn.close()
#     results = [{'name': circle['name'], 'id': circle['id']} for circle in circles]
#     return jsonify(results)

@app.route('/getAlbums', methods=['GET'])
def getAlbums():
    genres = request.args.get('genres', '')
    OSTs = request.args.get('OSTs', '')
    circles = request.args.get('circles', '')
    artists = request.args.get('artists', '')
    page = request.args.get('page', '')
    songName = request.args.get('songName', '')

    if (json.loads(genres) or json.loads(OSTs) or json.loads(circles) or json.loads(artists) or songName):
        conn = sqlite3.connect('touhou-music.db')
        conn.row_factory = sqlite3.Row
        
        stringy = ""
        for genre in json.loads(genres):
            stringy += "genre LIKE '%{}%' ".format(genre) + "AND "
        stringy = stringy[:-5]
        if (not stringy):
            stringy = "true"

        stringy2 = ""
        for OST in json.loads(OSTs):
            stringy2 += "source_track_id = '{}' ".format(OST) + "OR " 
        stringy2 = stringy2[:-4]
        if (not stringy2):
            stringy2 = "true"

        stringy3 = ""
        for circle in json.loads(circles):
            stringy3 += "release_circle_id = '{}' ".format(circle) + "OR "
        stringy3 = stringy3[:-4]
        if (not stringy3):
            stringy3 = "true"

        stringy4 = ""
        for artist in json.loads(artists):
            stringy4 += "songtrack_artist_id = '{}' ".format(artist) + "OR "
        stringy4 = stringy4[:-4]
        if (not stringy4):
            stringy4 = "true"

        stringy5 = ""
        if (songName):
            stringy5 = "album_name LIKE '%{}%'".format(songName)
        else:
            stringy5 = "true"

        albums = conn.execute(
             """SELECT DISTINCT ai.*
                FROM albums_index ai
                JOIN tracks t ON ai.id = t.album_id
                JOIN track_vs_source_index tsi ON t.id = tsi.track_id
                WHERE ({})
                AND ({})
                AND ({})
                AND ({})
                AND ({})
                LIMIT {},30;
             """.format(stringy, stringy3, stringy2, stringy4, stringy5, int(page)*30)).fetchall()
        conn.close()       
        results = [{'name': album['album_name'], 'id': album['id']} for album in albums]
        
        return jsonify(results)
    else:
        return ""
    

@app.route('/albumInfo', methods=['GET'])
def albumInfo(): 
    id = request.args.get('id', '')
    conn = sqlite3.connect('touhou-music.db')
    conn.row_factory = sqlite3.Row
    album = conn.execute("SELECT * FROM albums_index WHERE id = {}".format(int(id))).fetchall()
    tracks = conn.execute("SELECT * FROM tracks WHERE album_id = {}".format(int(id))).fetchall()
    circle = conn.execute("SELECT name FROM release_circle_index WHERE id = {}".format(int(tracks[0]['release_circle_id']))).fetchall()
    artists = []
    trackResults = []
    for track in tracks:
        if (track['songtrack_artist_id'] != None):
            artists.append(conn.execute("SELECT name FROM songtrack_artist_index WHERE id = {}".format(track['songtrack_artist_id'])).fetchall()[0]['name'])
            trackResults.append(track['name'])
        else: 
            artists.append("No Data")

    conn.close()
    results = {'album': album[0]['album_name'], 'genres': album[0]['genre'], 'circle': circle[0]['name']}
    return jsonify(results, trackResults, artists)
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
