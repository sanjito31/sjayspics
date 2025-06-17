import os
import requests
from datetime import datetime
from PIL import Image, ExifTags
from io import BytesIO
# from cloudinary import config, api
import cloudinary
import cloudinary.api
from app import app, db, Photos
from dotenv import load_dotenv

load_dotenv()

## Cloudinary vars
cloudinary.config (
    cloud_name = os.environ['CLOUDINARY_CLOUD_NAME'],
    api_key = os.environ['CLOUDINARY_API_KEY'],
    api_secret = os.environ['CLOUDINARY_API_SECRET']
)

## Get EXIF data from each image
def extract_exif(img_bytes):

    img = Image.open(BytesIO(img_bytes))
    
    raw_exif = img._getexif()
    if not raw_exif: return {}

    exif = {}
    for k, v in raw_exif.items():
        tag_name = ExifTags.TAGS.get(k, k)
        exif[tag_name] = v

    raw_ss          = exif.get("ExposureTime")
    raw_ap          = exif.get("FNumber")
    raw_iso         = exif.get("ISOSpeedRatings")
    raw_datetime    = exif.get("DateTimeOriginal")
    raw_make        = exif.get("Make")
    raw_model       = exif.get("Model")
    raw_exp_prog    = exif.get("ExposureProgram")

    return {
        'ShutterSpeed':         ("1/" + str(int(1/float(raw_ss)))) if raw_ss is not None else None,          
        'FNumber':              float(raw_ap) if raw_ap is not None else None,
        'ISOSpeedRatings':      int(raw_iso) if raw_iso is not None else None,
        'DateTimeOriginal':     datetime.strptime(raw_datetime, '%Y:%m:%d %H:%M:%S') if raw_datetime is not None else None,
        'Make':                 str(raw_make) if raw_make is not None else None,
        'Model':                str(raw_model) if raw_make is not None else None,
        'ExposureProgram':      str(raw_exp_prog) if raw_make is not None else None
    }

## Ingest images from Cloudinary
def ingest():

    resources = cloudinary\
        .api.resources_by_asset_folder("sjayspics", 
            max_results=100,
            metadata = True)["resources"]

    for r in resources:
        public_id   = r["public_id"]
        url         = r["secure_url"]

        resp = requests.get(url)
        exif = extract_exif(resp.content)

        photo = Photos.query.filter_by(public_id=public_id).first()
        if not photo:
            photo = Photos(public_id=public_id)
            db.session.add(photo)

        raw = public_id
        words = raw.split("_")[:-1]
        title = " ".join(words)

        photo.title             = title
        photo.caption           = None
        photo.url               = url

        photo.shutter_speed     = exif.get("ShutterSpeed")
        photo.aperture          = exif.get("FNumber")
        photo.iso               = exif.get("ISOSpeedRatings")
        photo.taken_at          = exif.get("DateTimeOriginal")
        photo.make              = exif.get("Make")
        photo.model             = exif.get("Model")
        photo.exposure_program  = exif.get("ExposureProgram")

    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        ingest()