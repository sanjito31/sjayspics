import { FujifilmTags as FT, isFujifilmTagKey } from "./tags";


export async function humanizeFujifilm(
    rawFujiTags: Record<string, string | number | number[]>
): Promise<Record<string, string | number | number[]>> {

    const tags: Record<string, (string | number | number[])> = {}

    for(const [key, value] of Object.entries(rawFujiTags)) {
        if(isFujifilmTagKey(key)) {
            // const name = FT[key]["name"]
            const tagInfo = FT[key]
            const tagName = tagInfo.name

            // No tag name (?)
            if(!tagName) {
                tags["Unknown"] = "Undefined"
                continue;
            }

            // WhiteBalanceFineTune (convert value, make into string)
            if(tagName === "WhiteBalanceFineTune" && Array.isArray(value)) {
                let s = ""

                const red = value[0]/20
                let sign = ""
                if(red > 0) sign = "+"

                s += "Red " + sign + red.toString()

                const blue = value[1]/20
                sign = ""
                if(blue > 0) sign = "+"

                s += ", Blue " + sign + blue.toString();

                tags[tagName] = s
                continue;
            }

            // Leave other arrays as is
            if(Array.isArray(value)) {
                tags[tagName] = value
                continue;
            }


            const valueKeyHex = "0x" + value.toString(16)
            const valueKeyDec = value.toString()

            if(valueKeyHex in tagInfo.values) {
                const humanValue = (tagInfo.values as Record<string, string>)[valueKeyHex]
                tags[tagName] = humanValue
            } else if(valueKeyDec in tagInfo.values) {
                const humanValue = (tagInfo.values as Record<string, string>)[valueKeyDec]
                tags[tagName] = humanValue
            } else {
                tags[tagName] = value;
            }

        }

    }

    return tags
}