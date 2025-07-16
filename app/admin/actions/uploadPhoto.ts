import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import sharp from "sharp"
import prisma from "@/lib/prisma"
import { ExifTool } from "exiftool-vendored"


const MAX_UPLOAD_SIZE = 10 * 1024* 1024 // 10MB

cloudinary.config( {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadPhoto(formData: FormData) {
    
    const upload = formData.get('photo') as File;
    if (!upload || !(upload instanceof File))
        throw new Error("No file uploaded.")
        
    const filename = upload.name;
    const title = filename.replace("_", " ");
    
    if(!upload) throw new Error("No file provided.")
    
    try {

        const arrayBuffer = await upload.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // EXIF data extracted
        const tags = ExifReader.load(buffer, {includeUnknown: true, expanded: true});
        const metadata = await sharp(buffer).metadata();

        // Resize
        const resized = await resize(buffer, MAX_UPLOAD_SIZE);

        
        // Upload
        const uploaded = await new Promise<UploadApiResponse | undefined>((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                    use_filename: true,
                },
                (error, uploaded) => {
                if(error) 
                    return reject(error)
                else 
                    return resolve(uploaded)
            }).end(resized);
        });

        if(!uploaded)
            throw new Error("Cloudinary upload failed.")

        /* Update Image data to database */

        // Basic photo data
        const resultDB = await prisma.photo.create({
            data: {

                filename: filename,
                width: metadata.width,
                height: metadata.height,
                fileSize: uploaded["bytes"] as number,
                mimeType: metadata.format,

                publicID: uploaded["public_id"] as string,
                assetID: uploaded["asset_id"] as string,
                url: uploaded["url"] as string,
                secureURL: uploaded["secure_url"] as string,

                title: title,

                // latitude: tags.gps?.Latitude,
                // longitude: tags.gps?.Longitude
            }
        })

        if(!resultDB) throw new Error("Error adding image to database: " + filename)

        // EXIF Data
        const exifData = tags.exif
        if(exifData) {

            const resultExifDB = await prisma.exifData.create({
                data: {
                    photoID: resultDB.id,

                    make: exifData.Make?.description,
                    model: exifData.Model?.description,
                    lens: exifData.LensModel?.description,

                    shutterSpeed: exifData.ShutterSpeedValue?.description,
                    aperture: parseFloat(exifData.ApertureValue?.description || "NaN"),
                    iso: parseInt(exifData.ISOSpeedRatings?.description || "NaN"),
                    focalLength: parseFloat(exifData.FocalLength?.description || "NaN"),
                    exposureComp: parseFloat(exifData.ExposureBiasValue?.description || "NaN"),

                    dateTaken: new Date(exifData.DateTimeOriginal?.description || "0"),
                    whiteBalance: exifData.WhiteBalance?.description
                }
            })

            if(!resultExifDB) throw new Error("Error adding EXIF data to database: " + filename)
        
        }

        // Fujifilm specific data
        const fujiDataRaw = tags['makerNotes']
        if(fujiDataRaw) {

            const fujiData = parseFujifilmEXIF()

            const resultFujiDB = prisma.fujifilmData.create({
                data: {
                    photoID: resultDB.id,

                    filmMode: fujiData.filmMode,

                }
            })



        }



    
    } catch(err) {
        console.log(err)
        return null
    }

}

export async function resize(buffer: Buffer, sizeLimit: number) {
    
    let bufferSize = buffer.length
    let quality = 100
    let resized = null

    do {
        resized = await sharp(buffer)
            .jpeg({ quality: quality })
            .toBuffer()

        quality = Math.max(0, quality - 10)
        bufferSize = resized.length

    } while(bufferSize > sizeLimit && quality > 0)

    if(bufferSize > sizeLimit || quality <= 0) 
        throw new Error("Could not resize.")
    else
        return resized;
}

export async function parseFujifilmEXIF() {

    const fuji = fujiTags
}