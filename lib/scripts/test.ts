import exifr from "exifr"
import { readFileSync } from "fs"
// import { parseFujifilmMakerNote } from "../fujifilm/parse-maker-note"
// import { humanizeFujifilm } from "../fujifilm/humanize"

const IMAGE_PATH = '/Users/sanjaykumar/Pictures/Summer Solstice NYC 2025/DSCF1287.JPG'

async function test() {

    const img = readFileSync(IMAGE_PATH)
    const tags = await exifr.parse(img, { makerNote: true })

    console.log(tags)

    // const buff = Buffer.from(tags.makerNote)

    // console.log(buff.toString('utf-8', 0, 8))


    // const fujitagsRaw = await parseFujifilmMakerNote();

    // const fujiTags = await humanizeFujifilm(fujitagsRaw)

    // console.log(fujiTags)

}

test()