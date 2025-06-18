import os
import cloudinary
import cloudinary.api
import cloudinary.uploader
from dotenv import load_dotenv
import exifread
import json
from PIL import Image
from io import BytesIO


# load env vars
load_dotenv()

# config cloudinary
cloudinary.config (
    cloud_name = os.environ['CLOUDINARY_CLOUD_NAME'],
    api_key = os.environ['CLOUDINARY_API_KEY'],
    api_secret = os.environ['CLOUDINARY_API_SECRET']
)


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

    ## Gather images and resize them
    for f in os.listdir(input_path):
        if f.lower().endswith((".jpg", ".jpeg")):
            count += 1

            # path of image to resize
            to_resize = os.path.join(input_path, f)  

            ## Check if previously uploaded (hash)
               

            # resize image and return image bytes object
            resized = resize(to_resize, 80)
            print(f"Image {count} resized")


            ## Upload
            cloudinary.uploader.upload(
                resized,
                resource_type="image",
                media_metadata=True,
                flags="keep_iptc",
                use_filename=True
            )
            print(f"Image {count} uploaded")


if __name__ == '__main__':
    upload_cloudinary("./static/images")