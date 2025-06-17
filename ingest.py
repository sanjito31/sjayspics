import os
import requests
from datetime import datetime
from PIL import Image, ExifTags
from io import BytesIO
from cloudinary import config, api
from app import app, db, Photos
from dotenv import load_dotenv

load_dotenv()

## Cloudinary vars
config(
    cloud_name = os.environ['CLOUDINARY_CLOUD_NAME'],
    api_key = os.environ['CLOUDINARY_API_KEY'],
    api_secret = os.environ['CLOUDINARY_API_SECRET']
)


## Get EXIF data from each image
def extract_exif(img_bytes):

    img = Image.open(BytesIO(img_bytes))
    exif = {
        ExifTags.TAGS.get(k): v
        for k, v in img._getexif().items()
        if k in ExifTags.TAGS
    }

    return {
        'shutter_speed':    exif.get('ShutterSpeedValue'),
        'aperture':         exif.get('FNumber'),
        'iso':              exif.get('ISOSpeedRating'),
        'taken_at':         datetime.strptime(
                                exif.get('DateTimeOriginal'),
                                '%Y:%m:%d %H:%M:%S'
                            ) if exif.get('DateTimeOriginal') else None
    }



## Ingest images from Cloudinary
def ingest():
    resources = api.resources(
        type='upload',
        resource_type='image',
        # prefix='/sjayspics/',
        max_results=100
    )['resources']

    for r in resources:
        print("resources ok")
        public_id   = r['public_id']
        url         = r['secure_url']
        thumb_url   = r['eager'][0]['secure_url'] if r.get('eager') else None

        resp = requests.get(url)
        ex = extract_exif(resp.content)

        photo = Photos.query.filter_by(public_id=public_id).first()
        if not photo:
            photo = Photos(public_id=public_id)
            db.session.add(photo)

        photo.title         = public_id.split('/')[-1].replace('_', ' ')
        photo.caption       = None
        photo.shutter_speed = str(ex['shutter_speed'])
        photo.aperture      = str(ex['aperture'])
        photo.iso           = str(ex['iso'])
        photo.taken_at      = ex['taken_at']
        photo.url           = url
        photo.thumb_url     = thumb_url

    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        ingest()