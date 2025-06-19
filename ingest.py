import os
import requests
from datetime import datetime
from io import BytesIO
import cloudinary
import cloudinary.api
from app import app, db, Photos
from dotenv import load_dotenv
import exifread
import json

load_dotenv()

## Cloudinary vars
cloudinary.config (
    cloud_name = os.environ['CLOUDINARY_CLOUD_NAME'],
    api_key = os.environ['CLOUDINARY_API_KEY'],
    api_secret = os.environ['CLOUDINARY_API_SECRET']
)

def humanize_fuji_maker(raw_tags):

    with open("fuji_exiftags.json","r") as f:
        FUJI_TAGS = json.load(f)

    out = {}

    for k, v in raw_tags.items():
        tag_hex = str(k.split()[-1])

        info = FUJI_TAGS.get(tag_hex)
        
        if info:
            values = info["values"]
            first_key = next(iter(values), None)

            if first_key and first_key.startswith("0x"):
                val = str(hex(v.values[0]))
            else:
                val = str(int(v.values[0]))

            human_val = values.get(val, f"Unknown: {val}")
            out[ info["name"] ] = human_val

    return out

## Get EXIF data from each image
def extract_exif(img_bytes):

    img = BytesIO(img_bytes)

    tags = exifread.process_file(img, details=True, extract_thumbnail=False)

    ## load fuji human readable exif tags
    fuji_raw = { tag: tags[tag] for tag in tags if tag.startswith("MakerNote Tag 0x") }
    fuji_human = humanize_fuji_maker(fuji_raw)

    exif = {}

    ## Basic EXIF data
    exif["Make"]            = str(tags.get("Image Make"))
    exif["Model"]           = str(tags.get("Image Model"))
    dateTime                = str(tags.get("EXIF DateTimeOriginal"))
    exif["DateTime"]        = datetime.strptime(dateTime, '%Y:%m:%d %H:%M:%S') if dateTime is not None else None
    exif["ShutterSpeed"]    = str(tags.get("EXIF ExposureTime"))
    # raw_ap                  = tags.get("EXIF FNumber")
    # raw_ap_num, raw_ap_den  = str(raw_ap).split("/") if raw_ap is not None else None
    # exif["FNumber"]         = float(raw_ap_num)/float(raw_ap_den)
    exif["FNumber"]         = str(tags.get("EXIF FNumber"))
    exif["ISOSpeedRatings"] = str(tags.get("EXIF ISOSpeedRatings"))
    exif["FocalLength"]     = str(tags.get("EXIF FocalLength"))
    exif["ImageWidth"]      = str(tags.get("EXIF ExifImageWidth"))
    exif["ImageHeight"]     = str(tags.get("EXIF ExifImageLength"))

    ## Fujifilm Specific 'MakerNote' EXIF Data
    exif["Sharpness"]       = str(tags.get("MakerNote Sharpness"))
    exif["WhiteBalance"]    = str(tags.get("MakerNote WhiteBalance"))
    exif["Saturation"]      = str(tags.get("MakerNote Saturation"))
    exif["Contrast"]        = str(tags.get("MakerNote Contrast"))
    exif["WBFineTune"]      = str(tags.get("MakerNote WhiteBalanceFineTune"))
    
    for k, v in fuji_human.items():
        exif[f"{k}"] = str(v)

    return exif


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
        resp.raise_for_status()
        exif = extract_exif(resp.content)

        photo = Photos.query.filter_by(public_id=public_id).first()
        if not photo:
            photo = Photos(public_id=public_id)
            db.session.add(photo)

        title = public_id.replace("_", " ")
        # title = " ".join(words)

        photo.title                 = title
        photo.caption               = None
        photo.url                   = url

        photo.shutter_speed         = exif.get("ShutterSpeed")
        photo.aperture              = exif.get("FNumber")
        photo.iso                   = exif.get("ISOSpeedRatings")
        photo.taken_at              = exif.get("DateTime")
        photo.make                  = exif.get("Make")
        photo.model                 = exif.get("Model")
        photo.film_sim              = exif.get("FilmMode")
        photo.grain_effect          = (str(exif.get("GrainEffectRoughness")) + " " + str(exif.get("GrainEffectSize")))
        photo.color_chrome_effect   = exif.get("ColorChromeEffect")
        photo.color_chrome_blue     = exif.get("ColorChromeFXBlue")
        photo.white_bal             = exif.get("WBFineTune")
        photo.dynamic_range         = exif.get("DynamicRange")
        photo.highlight_tone        = exif.get("HighlightTone")
        photo.shadow_tone           = exif.get("ShadowTone")
        # photo.color                 = db.Column(db.String)
        photo.sharpness             = exif.get("Sharpness")
        photo.high_iso_nr           = exif.get("NoiseReductionValue")
        photo.clarity               = exif.get("Clarity")
        

    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        ingest()