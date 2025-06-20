####################################################

# This script is only meant to be run locally!!
# Uploads images from disk to cloudinary and resizes

####################################################

import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO
import json
import hashlib

REGISTRY_PATH = "/Users/sanjaykumar/repos/sjayspics/upload_registry.json"

CLOUDINARY_MAX_UPLOAD_SIZE = (10 * 1024 * 1024) # 10MB

# load env vars
load_dotenv()

# config cloudinary
cloudinary.config (
    cloud_name = os.environ['CLOUDINARY_CLOUD_NAME'],
    api_key = os.environ['CLOUDINARY_API_KEY'],
    api_secret = os.environ['CLOUDINARY_API_SECRET']
)

def load_registry(REG_PATH):
    registry = {}
    with open(REGISTRY_PATH, "r") as f:
        registry = json.load(f)
    return registry

def save_to_registry(reg, REG_PATH):
     with open(REG_PATH, "w") as f:
        json.dump(reg, f, indent=2)


def hash_image(path, chunk_size=8196):
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(chunk_size), b""):
            h.update(chunk)
    return h.hexdigest()

# resize image function
def resize(input_path, quality):

    img = Image.open(input_path)
    exif_data = img.info.get("exif")

    out = BytesIO()

    img.save(
        out,
        format="JPEG",
        quality=quality,
        optimize=True,
        progressive=True,
        exif=exif_data
    )

    out.seek(0)
    return out

def upload_cloudinary(input_path):

    count = 0
    registry = load_registry(REGISTRY_PATH)

    ## Gather images and resize them
    for f in os.listdir(input_path):
        if f.lower().endswith((".jpg", ".jpeg")):
            count += 1

            # path of image to resize
            img_path = os.path.join(input_path, f)  
            img_title, ext = os.path.splitext(f)

            ## Check if previously uploaded (hash)
            img_hash = hash_image(img_path)
            if img_hash in registry:
                ## Image has already been uplaoded, skip it
                print(f"Image {count} skipped: {img_path}")
            else:

                # resize image and return image bytes object
                quality = 80
                while quality > 0:
                    resized = resize(img_path, quality)
                    size = resized.getbuffer().nbytes

                    if size > CLOUDINARY_MAX_UPLOAD_SIZE:
                        quality -= 10
                    else:
                        break

                if quality <= 0:
                    print(f"Image {count} could not be resized: {img_path}")

                ## Upload
                res = cloudinary.uploader.upload(
                    resized,
                    asset_folder="sjayspics",
                    public_id=img_title,
                    resource_type="image"
                )

                 # Add to registry
                registry[img_hash] = res["public_id"]
                print(f"Image {count} uploaded")
        
    save_to_registry(registry, REGISTRY_PATH)


if __name__ == '__main__':
    upload_cloudinary("./static/images/nyc/")