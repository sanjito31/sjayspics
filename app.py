from flask import Flask, jsonify, request
import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

app = Flask(__name__, static_folder='static', static_url_path='')

#Define database
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
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
    tone_curve          = db.Column(db.String)
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
    return app.send_static_file('index.html')

@app.route("/api/images")
def getImageInfo():
    # img_dir = os.path.join(app.static_folder, 'images')

    # files = []
    # for f in os.listdir(img_dir):
    #     if f.lower().endswith('.jpg'):
    #         files.append(f)
    
    # paths = []
    # for file in files:

    #     title = os.path.splitext(file)[0].replace('_', ' ')

    #     paths.append({
    #         "src":      f"/images/{file}",
    #         "title":    title
    #     })

    # return jsonify(paths)

    photos = Photos.query.order_by(Photos.taken_at.desc()).all()
    return jsonify([
        {
            'title':        p.title,
            'caption':      p.caption,
            'shutter_speed': p.shutter_speed,
            'aperture':     p.aperture,
            'iso':          p.iso,
            'taken_at':      p.taken_at.isoformat() if p.taken_at else None,
            'url':          p.url,
            'make':         p.make,
            'model':        p.model
        }
        for p in photos
    ])


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001,debug=True)