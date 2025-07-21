"use server"

import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import sharp from "sharp"
import prisma from "@/lib/prisma"
import { ExifTool } from "exiftool-vendored"
import { file as tmpFile } from "tmp-promise"
import { writeFile } from "fs/promises"
import { UploadItem } from "@/lib/validation/uploadSchema"


const MAX_UPLOAD_SIZE = 10 * 1024* 1024 // 10MB

cloudinary.config( {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadPhoto(data: UploadItem) {
    
    // const upload = formData.get('photo') as File;
    if (!data || !(data.file instanceof File))
        throw new Error("No file uploaded.")
    console.log(data.file.name)
    // const filename = data.file;
    const title = data.title;
    const caption = data.caption;
    const filename = title?.replaceAll(" ", "_"); 

    try {

        const arrayBuffer = await data.file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Get EXIF Tags
        const tags = await getTagsFromBuffer(buffer);
        
        // Resize
        const resized = await resize(buffer, MAX_UPLOAD_SIZE);


        // Upload
        const uploaded = await new Promise<UploadApiResponse | undefined>((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                    public_id: filename,
                    auto_orientation: false,
                    asset_folder: "sjayspics",
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

                publicID: uploaded["public_id"]?.toString(),
                assetID: uploaded["asset_id"]?.toString(),
                url: uploaded["url"]?.toString(),
                secureURL: uploaded["secure_url"]?.toString(),

                title: title,
                caption: caption,
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

                make: tags.Make?.toString(),
                model: tags.Model?.toString(),
                lens: tags.LensInfo?.toString(),

                shutterSpeed: tags.ExposureTime?.toString(),
                aperture: tags.FNumber,
                iso: tags.ISO,
                focalLength: tags.FocalLength?.toString(),
                exposureComp: tags.ExposureCompensationSetting,

                dateTaken: new Date(tags.DateTimeOriginal?.toString() || Date.now()),
                orientation: tags.Orientation,
                flash: tags.Flash?.toString(),
                whiteBalance: tags.ColorTemperature?.toString(),
                meteringMode: tags.MeteringMode?.toString(),
                exposureMode: tags.ExposureMode?.toString(),
            }
        })

        if(!resultExifDB) {
            console.log("Error adding EXIF data to database: " + filename)
            throw new Error("Error adding EXIF data to database: " + filename)
        }

        // Fujifilm specific data
        if(tags.Make?.trim().toUpperCase().includes("FUJIFILM")) {

            const resultFujiDB = await prisma.fujifilmData.create({
                data: {
                    photoID: resultDB.id,

                    filmMode:               tags.FilmMode?.toString(),
                    grainEffectRoughness:   tags.GrainEffectRoughness?.toString(),
                    grainEffectSize:        tags.GrainEffectSize?.toString(),
                    colorChromeEffect:      tags.ColorChromeEffect?.toString(),
                    colorChromeFXBlue:      tags.ColorChromeFXBlue?.toString(),
                    whiteBalance:           tags.ColorTemperature?.toString(),
                    whiteBalanceFineTune:   tags.WhiteBalanceFineTune?.toString(),
                    dynamicRangeSetting:    tags.DynamicRangeSetting?.toString(),
                    highlightTone:          tags.HighlightTone?.toString(),
                    shadowTone:             tags.ShadowTone?.toString(),
                    color:                  tags.Saturation?.toString(),
                    sharpness:              tags.Sharpness?.toString(),
                    noiseReduction:         tags.NoiseReduction?.toString(),
                    clarity:                tags.Clarity?.toString(), 
                }
            })

            // console.log(resultFujiDB)

            if (!resultFujiDB) {
                console.log("Error adding Fujifilm EXIF tag data: " + filename)
                throw new Error("Error adding Fujifilm EXIF tag data:  " + filename)
            }
        }

        return uploaded
    
    } catch(err) {
        const e = err as Error;
        console.log(e)
        return e
    }

}

export async function resize(buffer: Buffer, sizeLimit: number) {
    
    let bufferSize = buffer.length
    let quality = 100
    let resized = null

    do {
        resized = await sharp(buffer)
            .rotate()
            .jpeg({ quality: quality })
            .keepMetadata()
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