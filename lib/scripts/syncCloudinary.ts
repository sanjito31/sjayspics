"use server"

import exifr from "exifr"
import { v2 as cloudinary } from "cloudinary"
import prisma from "@/lib/prisma"
import * as upload from "@/lib/upload/upload-photo"
import * as dotenv from 'dotenv'
import * as path from 'path'

const envPath = path.resolve(__dirname, '../../.env')

dotenv.config({path: envPath})

/* Looks at cloudinary, gets all images, parses the EXIF data and fuji data, and adds it to our Prisma DB
 NO DUPLICATE ERROR CHECKING
 */

export async function syncCloudinaryToDB() {

    cloudinary.config( {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
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

            // add to Photo DB
            let format = item["format"]
            if(format === "jpg" || format === "JPG") {
                format = "jpeg"
            }

            const resultDB = await upload.addToPhotoTable(item)

            // EXIF Data

            // get exif
            const res = await fetch(item.secure_url);
            if(!res.ok) throw new Error("Fetch failed");
            const buffer = Buffer.from(await res.arrayBuffer())

            const tags = await exifr.parse(buffer, {
                makerNote: true
            })

            const resultExifDB = await upload.addToEXIFTable(resultDB.id, tags)
            if(!resultExifDB) throw new Error("Error adding image to 'EXIF' database.")

            // Fujidata
            const resultFujiDB = await upload.addToFujifilmTable(resultDB.id, tags)
            if(resultFujiDB === null) console.log("Photo is not Fujifilm");
            
            console.log(item)
            
        } catch(err) {
            console.log(err, item.public_id)
        }
    }



}

syncCloudinaryToDB()