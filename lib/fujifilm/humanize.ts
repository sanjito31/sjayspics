import { FujifilmTags as FT, isFujifilmTagKey } from "./tags";

export interface KnownFujiTags {
    Version?: string | number | number[];
    InternalSerialNumber?: string | number | number[];
    Quality?: string | number | number[];
    Sharpness?: string | number | number[];
    WhiteBalance?: string | number | number[];
    Saturation?: string | number | number[];
    Contrast?: string | number | number[];
    ColorTemperature?: string | number | number[];
    WhiteBalanceFineTune?: string | number | number[];
    NoiseReduction?: string | number | number[];
    NoiseReductionValue?: string | number | number[];
    Clarity?: string | number | number[];
    FujiFlashMode?: string | number | number[];
    FlashExposureComp?: string | number | number[];
    Macro?: string | number | number[];
    FocusMode?: string | number | number[];
    AFMode?: string | number | number[];
    FocusPixel?: string | number | number[];
    PrioritySettings?: string | number | number[];
    FocusSettings?: string | number | number[];
    EXRMode?: string | number | number[];
    ShadowTone?: string | number | number[];
    HighlightTone?: string | number | number[];
    GrainEffectRoughness?: string | number | number[];
    ColorChromeEffect?: string | number | number[];
    GrainEffectSize?: string | number | number[];
    ColorChromeFXBlue?: string | number | number[];
    AdvancedFilter?: string | number | number[];
    ColorMode?: string | number | number[];
    BlurWarning?: string | number | number[];
    FocusWarning?: string | number | number[];
    ExposureWarning?: string | number | number[];
    DynamicRange?: string | number | number[];
    FilmMode?: string | number | number[];
    DynamicRangeSetting?: string | number | number[];
    DevelopmentDynamicRange?: string | number | number[];
    DRangePriority?: string | number | number[];
    DRangePriorityAuto?: string | number | number[];
    DRangePriorityFixed?: string | number | number[];
    Unknown?: undefined;
}


export async function humanizeFujifilm(
    rawFujiTags: Record<string, string | number | number[]>
): Promise<KnownFujiTags> {

    const tags: KnownFujiTags = {}

    for(const [key, value] of Object.entries(rawFujiTags)) {
        if(isFujifilmTagKey(key)) {
            // const name = FT[key]["name"]
            const tagInfo = FT[key]
            const tagName = tagInfo.name

            // No tag name (?)
            if(!tagName) {
                tags["Unknown"] = undefined
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