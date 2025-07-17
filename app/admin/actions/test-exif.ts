// import ExifReader from "exifreader"
// import { fujiTags } from "./fuji_exiftags"
// import { ExifTool } from "exiftool-vendored"
import { readFileSync, writeFileSync } from "fs"
import { file as tmpFile } from "tmp-promise"
import sharp from "sharp"



const imagePath = '/Users/sanjaykumar/Pictures/Florida March 2025/JPEGs/DSCF0902.JPG'

async function testExif() {

    const { path: tmpPath } = await tmpFile({postfix: ".jpg"})

    try{

        const buffer = await readFileSync(imagePath)

        const resized = await sharp(buffer)
                    .rotate()
                    .jpeg({ quality: 50 })
                    .toBuffer()


        writeFileSync(tmpPath, resized)

        console.log(tmpPath)

        
        
    } catch(err) {
        console.log(err)
        
    }
}

testExif()



// const buffer = readFileSync('/Users/sanjaykumar/Pictures/Florida March 2025/JPEGs/DSCF0915.JPG')
        // const tags = ExifReader.load(buffer, { includeUnknown: true})
        // // const exifData = tags.MakerNote
        // // const fuji = exifData['value']

        // // Inspect the structure
        // console.log(tags.MakerNote)

        // console.log('Available keys:', Object.keys(exifData));
        // console.log('MakerNote structure:', exifData['makerNotes']);
    
        // // Test your parser
        // if (exifData['MakerNote']) {
        // // const parsed = parseFujifilmMakerNote(exifData['MakerNote'], fujiTags);
        // console.log('Parsed Fuji settings:', parsed);
        // }


        // const exiftool = new ExifTool()
        // const tags = await exiftool.read(tmpPath)

        // console.log(tags.Model)
        // console.log(tags.GPSDestLatitude)
        // console.log(tags.SharpnessRange)
        // console.log(tags.WhiteBalanceFineTune?.toString())
        // console.log(tags.DynamicRangeSetting)
        // console.log(tags.Saturation)
        // console.log(tags.FileName)
        // console.log(tags.FilmMode)

        // await cleanup()
        // await exiftool.end()