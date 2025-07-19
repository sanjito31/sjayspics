"use server"

// import { ExifTool} from "exiftool-vendored";
// import { writeFile } from "fs";
// import { file as tmpFile } from "tmp-promise"
// import fetch from 'node-fetch'; 
import { v2 as cloudinary } from "cloudinary"
import prisma from "@/lib/prisma"
import { getTagsFromBuffer } from "@/app/admin/actions/uploadPhoto"
import * as dotenv from 'dotenv'
import * as path from 'path'

const envPath = path.resolve(__dirname, '../../../.env')

dotenv.config({path: envPath})

/* Looks at cloudinary, gets all images, parses the EXIF data and fuji data, and adds it to our Prisma DB
 NO DUPLICATE ERROR CHECKING
 */

export async function syncCloudinaryToDB() {

    cloudinary.config( {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

    const res = await cloudinary.api.resources_by_asset_folder("sjayspics", {max_results: 50})
    // const res = await cloudinary.api.resource("ocean_steps")

    const uploads = res["resources"]

    for(const item of uploads) {

        console.log(item.public_id)

        try {

            const exists = await prisma.photo.findFirst({
                where: { publicID: item.public_id }
            })
            if(exists) continue;

            const filename = item.public_id

            // add to Photo DB
            // Basic photo data
            const resultDB = await prisma.photo.create({
                data: {

                    filename: filename,
                    width: item.width,
                    height: item.height,
                    fileSize: item.bytes,
                    mimeType: "image/jpeg",

                    publicID: item.public_id,
                    assetID: item.asset_id,
                    url: item.url,
                    secureURL: item.secure_url,

                    title: item.public_id.replaceAll("_", " "),
                    createdAt: new Date(item.created_at),
                }
            })

            if(!resultDB) {
                console.log("Error adding image to database: " + filename)
            }


            // get exif
            const res = await fetch(item.secure_url);
            if(!res.ok) throw new Error("Fetch failed");
            const buffer = Buffer.from(await res.arrayBuffer())

            const tags = await getTagsFromBuffer(buffer);

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

                    createdAt: new Date(item.created_at),
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
                        
                        createdAt: new Date(item.created_at),
                    }
                })

                // console.log(resultFujiDB)

                if (!resultFujiDB) throw new Error("Could not add Fujfilm EXIF tag data. " + filename)

            }
            
        } catch(err) {
            console.log(err, item.public_id)
        }
    }



}

syncCloudinaryToDB()