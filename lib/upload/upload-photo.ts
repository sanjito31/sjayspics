"use server"

import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import sharp from "sharp"
import prisma from "@/lib/prisma"
import  exifr from "exifr"
import { humanizeFujifilm } from "@/lib/fujifilm/humanize"
import { parseFujifilmMakerNote } from "@/lib/fujifilm/parse-maker-note"

const MAX_UPLOAD_SIZE = 10 * 1024* 1024 // 10MB

cloudinary.config( {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

type uploadPhotoProps = {
    title: string,
    caption: string | undefined,
    buffer: Buffer,
    filename: string,
}


export async function uploadPhoto({
    title, 
    caption, 
    buffer, 
    filename 
}: uploadPhotoProps 
) {
    
    if (!buffer)
        throw new Error("No file uploaded.")

    const public_id = title.replaceAll(" ", "_"); 

    try {

        // Get EXIF Tags
        const tags = await exifr.parse(buffer, {
            makerNote: true
        })
        
        // Resize
        const resized = await resize(buffer, MAX_UPLOAD_SIZE);

        // Upload
        const uploaded = await new Promise<UploadApiResponse | undefined>((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                    public_id: public_id,
                    auto_orientation: false,
                    asset_folder: "sjayspics",
                    metadata: {
                        original_filename: filename,
                        title: title,
                        caption: caption,
                    }
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
        const resultDB = await addToPhotoTable(uploaded) 

        // EXIF Data
        const resultExifDB = await addToEXIFTable(resultDB.id, tags)
        if(resultExifDB) {}
        
        // Fujifilm specific data
        const resultFujiDB = await addToFujifilmTable(resultDB.id, tags)
        if(!resultFujiDB) {
            console.log(title + " is not a Fujifilm image.")
        }
        
        console.log(uploaded)
        return uploaded
    
    } catch(err) {
        const e = err as Error;
        console.log(`Error in uploadPhoto() on ${title}: ` + e.message)
        throw new Error(`Error in uploadPhoto() on ${title}: ` + e.message)
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


/*
    Add a photo to the main Photo table
*/

export async function addToPhotoTable(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uploaded: any, 
    // title: string, 
    // caption: string | undefined
) {

    let format = uploaded["format"]
    if(format === "jpg" || format === "JPG") {
        format = "jpeg"
    }

    let filename = uploaded["public_id"]
    let title = uploaded["public_id"].replaceAll("_", " ")
    let caption = null
    const metadata = uploaded["metadata"]

    if(metadata) {
        for(const [key, value] of Object.entries(metadata)) {
            if(key === "original_filename") {
                filename = value as string
            } else if (key === "title") {
                title = value as string;
            } else if (key === "caption") {
                caption = value as string;
            }
        }
    }

    // Basic photo data
    const resultDB = await prisma.photo.create({
        data: {

            filename: filename,
            width: uploaded["width"] as number || NaN,
            height: uploaded["height"] as number || NaN,
            fileSize: uploaded["bytes"] as number,
            mimeType: `image/${format}`,

            publicID: uploaded["public_id"]?.toString(),
            assetID: uploaded["asset_id"]?.toString(),
            url: uploaded["url"]?.toString(),
            secureURL: uploaded["secure_url"]?.toString(),

            title: title,
            caption: caption,

            createdAt: uploaded["created_at"]
        }
    })

    if(!resultDB) {
        throw new Error("Error adding image to 'Photo' database.")
    } else {
        return resultDB
    }
}

/*
    Add a photo to the EXIF table
*/

export async function addToEXIFTable(
    photoID: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags: any,
) {

    let shutterSpeed = null 
    if(tags.ExposureTime) {
        shutterSpeed = convertDecToFracString(tags.ExposureTime)
    }

    const lens = tags.LensModel?.toString();
    // if(tags.LensInfo && Array.isArray(tags.LensInfo)) {
    //     const arr: number[] = (tags.LensInfo as number[])
    //     lens = ""

    //     // Prime lens
    //     if(arr.length === 2) {
    //         lens += `${arr[0]}mm F${}`
        

    //     // fixed zoom
    //     } else if(arr.length === 3) {


    //     // kit lens
    //     } else if (arr.length === 4) {

        
    //     // no idea
    //     } else {
    //         let lens = tags.LensModel?.toString();
    //     }
    // }

    

    const resultExifDB = await prisma.exifData.create({
        data: {
            photoID: photoID,

            make: tags.Make?.toString(),
            model: tags.Model?.toString(),
            lens: lens,

            shutterSpeed: shutterSpeed, 
            aperture: tags.FNumber as number,
            iso: tags.ISO as number,
            focalLength: tags.FocalLength?.toString(),
            exposureComp: tags.ExposureCompensation as number,

            dateTaken: new Date(tags.DateTimeOriginal || Date.now()),
            orientation: tags.Orientation?.toString(),
            flash: tags.Flash?.toString(),
            whiteBalance: tags.ColorTemperature?.toString(),
            meteringMode: tags.MeteringMode?.toString(),
            exposureMode: tags.ExposureMode?.toString(),
        }
    })

    if(!resultExifDB) {
        throw new Error("Error adding image to 'EXIF' database.")
    } else {
        return resultExifDB
    }
}

/*
    Add a photo to the Fujifilm table
*/

export async function addToFujifilmTable(
    photoID: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags: any,
) {
    const fujiBuffer = Buffer.from(tags.makerNote)

    if(fujiBuffer.toString('utf-8', 0, 8) === "FUJIFILM") {

        const fujitagsRaw = await parseFujifilmMakerNote(fujiBuffer)
        const fujiTags = await humanizeFujifilm(fujitagsRaw)

        const resultFujiDB = await prisma.fujifilmData.create({
            data: {
                photoID: photoID,

                filmMode:               fujiTags.FilmMode?.toString(),
                grainEffectRoughness:   fujiTags.GrainEffectRoughness?.toString(),
                grainEffectSize:        fujiTags.GrainEffectSize?.toString(),
                colorChromeEffect:      fujiTags.ColorChromeEffect?.toString(),
                colorChromeFXBlue:      fujiTags.ColorChromeFXBlue?.toString(),
                whiteBalance:           fujiTags.ColorTemperature?.toString(),
                whiteBalanceFineTune:   fujiTags.WhiteBalanceFineTune?.toString(),
                colorTemperature:       fujiTags.ColorTemperature?.toString(),
                dynamicRangeSetting:    fujiTags.DynamicRangeSetting?.toString(),
                developmentDynamicRange: fujiTags.DevelopmentDynamicRange?.toString(),
                highlightTone:          fujiTags.HighlightTone?.toString(),
                shadowTone:             fujiTags.ShadowTone?.toString(),
                color:                  fujiTags.Saturation?.toString(),
                sharpness:              fujiTags.Sharpness?.toString(),
                noiseReduction:         fujiTags.NoiseReductionValue?.toString(),
                clarity:                fujiTags.Clarity?.toString(), 
            }
        })
        // console.log(resultFujiDB)
        if (!resultFujiDB) {
            throw new Error("Error adding image to 'Fujifilm' database.")
        } else {
            return resultFujiDB
        }
    } else {
        return null
    }
}


function convertDecToFracString(expTime: number) {

    if(expTime >= 1) {
        return `${expTime}s`;
    }

    const reciprocal = Math.round(1 / expTime)
    return `1/${reciprocal}`
}