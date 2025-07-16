import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import sharp from "sharp"
import prisma from "@/lib/prisma"
import { ExifTool } from "exiftool-vendored"
import { file as tmpFile } from "tmp-promise"
import { writeFile } from "fs/promises"


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

        // Get EXIF Tags
        const tags = await getTagsFromBuffer(buffer);
        
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
                width: tags.ImageWidth || NaN,
                height: tags.ImageHeight || NaN,
                fileSize: uploaded["bytes"] as number,
                mimeType: tags.MIMEType || "Unknown",

                publicID: uploaded["public_id"] as string,
                assetID: uploaded["asset_id"] as string,
                url: uploaded["url"] as string,
                secureURL: uploaded["secure_url"] as string,

                title: title,
            }
        })

        if(!resultDB) {
            console.log("Error adding image to database: " + filename)
            throw new Error("Error adding image to database: " + filename)
        }

        // EXIF Data

        const resultExifDB = await prisma.exifData.create({
            data: {
                photoID: resultDB.id,

                make: tags.Make,
                model: tags.Model,
                lens: tags.LensInfo,

                shutterSpeed: tags.ExposureTime,
                aperture: tags.FNumber,
                iso: tags.ISO,
                focalLength: tags.FocalLength,
                exposureComp: tags.ExposureCompensationSetting,

                dateTaken: new Date(tags.DateTimeOriginal?.toString() || Date.now()),
                orientation: tags.Orientation,
                flash: tags.Flash,
                whiteBalance: tags.ColorTemperature?.toString(),
                meteringMode: tags.MeteringMode,
                exposureMode: tags.ExposureMode
            }
        })

        if(!resultExifDB) {
            console.log("Error adding EXIF data to database: " + filename)
            throw new Error("Error adding EXIF data to database: " + filename)
        }

        // Fujifilm specific data
        if(tags.Make == "FUJIFILM") {

            const resultFujiDB = prisma.fujifilmData.create({
                data: {
                    photoID: resultDB.id,

                    filmMode:               tags.FilmMode,
                    grainEffectRoughness:   tags.GrainEffectRoughness,
                    grainEffectSize:        tags.GrainEffectSize,
                    colorChromeEffect:      tags.ColorChromeEffect,
                    colorChromeFXBlue:      tags.ColorChromeFXBlue,
                    whiteBalance:           tags.ColorTemperature?.toString(),
                    whiteBalanceFineTune:   tags.WhiteBalanceFineTune?.toString(),
                    dynamicRangeSetting:    tags.DynamicRangeSetting,
                    highlightTone:          tags.HighlightTone,
                    shadowTone:             tags.ShadowTone,
                    color:                  tags.Saturation,
                    sharpness:              tags.Sharpness,
                    noiseReduction:         tags.NoiseReduction,
                    clarity:                tags.Clarity?.toString(), 
                }
            })

            if (!resultFujiDB) throw new Error("Could not add Fujfilm EXIF tag data. " + filename)

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

export async function getTagsFromBuffer(buffer: Buffer) {

    const { path: tmpPath, cleanup } = await tmpFile({postfix: ".jpg"}) // NEED TO cleanup()

    try{
        // EXIF data extracted
        await writeFile(tmpPath, buffer)
        
        const exiftool = new ExifTool()     // NEED TO .END()
        try {
            const tags = await exiftool.read(tmpPath)
            return tags
        } finally {
            await exiftool.end()
        }
    } finally {
        await cleanup()
    }
}