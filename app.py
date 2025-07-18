from flask import Flask, jsonify, send_from_directory
import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import pathlib

load_dotenv()

BASE_DIR = os.path.dirname(__file__)
BUILD_DIR = os.path.join(BASE_DIR, "client", "build")

app = Flask(
    __name__, 
    static_folder=BUILD_DIR, 
    static_url_path=""
)
CORS(app)

db_url = os.getenv("DATABASE_URL")

# if it starts with the old `postgres://`, replace with `postgresql://`
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

#Define database
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Photos(db.Model):
    __tablename__       = 'photos'
    id                  = db.Column(db.Integer, primary_key=True)
    public_id           = db.Column(db.String, unique=True, nullable=False)
    title               = db.Column(db.String, nullable=False)
    caption             = db.Column(db.String)
    make                = db.Column(db.String)
    model               = db.Column(db.String)
    shutter_speed       = db.Column(db.String)
    aperture            = db.Column(db.String)
    iso                 = db.Column(db.String)
    exposure_program    = db.Column(db.String)
    film_sim            = db.Column(db.String)
    grain_effect        = db.Column(db.String)
    color_chrome_effect = db.Column(db.String)
    color_chrome_blue   = db.Column(db.String)
    white_bal           = db.Column(db.String)
    dynamic_range       = db.Column(db.String)
    highlight_tone      = db.Column(db.String)
    shadow_tone         = db.Column(db.String)
    color               = db.Column(db.String)
    sharpness           = db.Column(db.String)
    high_iso_nr         = db.Column(db.String)
    clarity             = db.Column(db.String)
    exp_comp            = db.Column(db.String)
    taken_at            = db.Column(db.DateTime)
    url                 = db.Column(db.String, nullable=False)
    thumb_url           = db.Column(db.String)
    created_at          = db.Column(db.DateTime, server_default=db.func.now())


@app.route("/")
def index():
    # return app.send_static_file('index.html')
    return send_from_directory(BUILD_DIR, "index.html")

@app.route("/api/images.json")
def getImageInfo():

    photos = Photos.query \
        .filter( Photos.make.isnot(None) ) \
        .order_by( Photos.created_at.desc() ) \
        .all()
    
    return jsonify([
        {
            'title':            p.title,
            'caption':          p.caption,
            'shutter_speed':    p.shutter_speed,
            'aperture':         p.aperture,
            'iso':              p.iso,
            'taken_at':         p.taken_at.isoformat() if p.taken_at else None,
            'url':              p.url,
            'make':             p.make,
            'model':            p.model,
            'film_sim':         p.film_sim,
            'grain_effect':     p.grain_effect,
            'color_chrome_effect':  p.color_chrome_effect,
            'color_chrome_blue':p.color_chrome_blue,
            'white_bal':        p.white_bal,
            'dynamic_range':    p.dynamic_range,
            'highlight_tone':   p.highlight_tone,
            'shadow_tone':      p.shadow_tone,
            'sharpness':        p.sharpness,
            'high_iso_nr':      p.high_iso_nr,
            'clarity':          p.clarity
        }
        for p in photos
    ])


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001,debug=True)