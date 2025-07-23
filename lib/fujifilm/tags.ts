export type FujifilmTagKey = keyof typeof FujifilmTags

export function isFujifilmTagKey(key: string): key is FujifilmTagKey {
    return key in FujifilmTags;
}

export const FujifilmTags = {
    "0x0000": {
        "name": "Version",
        "values": {}
    },
    "0x0010": {
        "name": "InternalSerialNumber",
        "values": {}
    },
    "0x1000": {
        "name": "Quality",
        "values": {}
    },
    "0x1001": {
        "name": "Sharpness",
        "values": {
            "0x0": "-4 (softest)",
            "0x1": "-3 (very soft)",
            "0x2": "-2 (soft)",
            "0x3": "0 (normal)",
            "0x4": "+2 (hard)",
            "0x5": "+3 (very hard)",
            "0x6": "+4 (hardest)",
            "0x82": "-1 (medium soft)",
            "0x84": "+1 (medium hard)",
            "0x8000": "Film Simulation",
            "0xffff": "n/a"
        }
    },
    "0x1002": {
        "name": "WhiteBalance",
        "values": {
            "0x0": "Auto",
            "0x1": "Auto (white priority)",
            "0x2": "Auto (ambiance priority)",
            "0x100": "Daylight",
            "0x200": "Cloudy",
            "0x300": "Daylight Fluorescent",
            "0x301": "Day White Fluorescent",
            "0x302": "White Fluorescent",
            "0x303": "Warm White Fluorescent",
            "0x304": "Living Room Warm White Fluorescent",
            "0x400": "Incandescent",
            "0x500": "Flash",
            "0x600": "Underwater",
            "0xf00": "Custom",
            "0xf01": "Custom2",
            "0xf02": "Custom3",
            "0xf03": "Custom4",
            "0xf04": "Custom5",
            "0xff0": "Kelvin"
        }
    },
    "0x1003": {
        "name": "Saturation",
        "values": {
            "0x0": "0 (normal)",
            "0x80": "+1 (medium high)",
            "0xc0": "+3 (very high)",
            "0xe0": "+4 (highest)",
            "0x100": "+2 (high)",
            "0x180": "-1 (medium low)",
            "0x200": "Low",
            "0x300": "None (B&W)",
            "0x301": "B&W Red Filter",
            "0x302": "B&W Yellow Filter",
            "0x303": "B&W Green Filter",
            "0x310": "B&W Sepia",
            "0x400": "-2 (low)",
            "0x4c0": "-3 (very low)",
            "0x4e0": "-4 (lowest)",
            "0x500": "Acros",
            "0x501": "Acros Red Filter",
            "0x502": "Acros Yellow Filter",
            "0x503": "Acros Green Filter",
            "0x8000": "Film Simulation"
        }
    },
    "0x1004": {
        "name": "Contrast",
        "values": {
            "0x0": "Normal",
            "0x80": "Medium High",
            "0x100": "High",
            "0x180": "Medium Low",
            "0x200": "Low",
            "0x8000": "Film Simulation"
        }
    },
    "0x1005": {
        "name": "ColorTemperature",
        "values": {}
    },
    "0x1006": {
        "name": "Contrast",
        "values": {
            "0x0": "Normal",
            "0x100": "High",
            "0x300": "Low"
        }
    },
    "0x100A": {
        "name": "WhiteBalanceFineTune",
        "values": {}
    },
    "0x100B": {
        "name": "NoiseReduction",
        "values": {
            "0x40": "Low",
            "0x80": "Normal",
            "0x100": "n/a"
        }
    },
    "0x100E": {
        "name": "NoiseReductionValue",
        "values": {
            "0x0": "0 (normal)",
            "0x100": "+2 (strong)",
            "0x180": "+1 (medium strong)",
            "0x1c0": "+3 (very strong)",
            "0x1e0": "+4 (strongest)",
            "0x200": "-2 (weak)",
            "0x280": "-1 (medium weak)",
            "0x2c0": "-3 (very weak)",
            "0x2e0": "-4 (weakest)"
        }
    },
    "0x100F": {
        "name": "Clarity",
        "values": {
            "-5000": "-5",
            "-4000": "-4",
            "-3000": "-3",
            "-2000": "-2",
            "-1000": "-1",
            "0": "0",
            "1000": "1",
            "2000": "2",
            "3000": "3",
            "4000": "4",
            "5000": "5"
        }
    },
    "0x1010": {
        "name": "FujiFlashMode",
        "values": {
            "0x0": "Auto",
            "0x1": "On",
            "0x2": "Off",
            "0x3": "Red-eye reduction",
            "0x4": "External",
            "0x10": "Commander",
            "0x8000": "Not Attached",
            "0x8120": "TTL",
            "0x8320": "TTL Auto - Did not fire",
            "0x9840": "Manual",
            "0x9860": "Flash Commander",
            "0x9880": "Multi-flash",
            "0xa920": "1st Curtain (front)",
            "0xaa20": "TTL Slow - 1st Curtain (front)",
            "0xab20": "TTL Auto - 1st Curtain (front)",
            "0xad20": "TTL - Red-eye Flash - 1st Curtain (front)",
            "0xae20": "TTL Slow - Red-eye Flash - 1st Curtain (front)",
            "0xaf20": "TTL Auto - Red-eye Flash - 1st Curtain (front)",
            "0xc920": "2nd Curtain (rear)",
            "0xca20": "TTL Slow - 2nd Curtain (rear)",
            "0xcb20": "TTL Auto - 2nd Curtain (rear)",
            "0xcd20": "TTL - Red-eye Flash - 2nd Curtain (rear)",
            "0xce20": "TTL Slow - Red-eye Flash - 2nd Curtain (rear)",
            "0xcf20": "TTL Auto - Red-eye Flash - 2nd Curtain (rear)",
            "0xe920": "High Speed Sync (HSS)"
        }
    },
    "0x1011": {
        "name": "FlashExposureComp",
        "values": {}
    },
    "0x1020": {
        "name": "Macro",
        "values": {
            "0": "Off",
            "1": "On"
        }
    },
    "0x1021": {
        "name": "FocusMode",
        "values": {
            "0": "Auto",
            "1": "Manual",
            "65535": "Movie"
        }
    },
    "0x1022": {
        "name": "AFMode",
        "values": {
            "0": "No",
            "1": "Single Point",
            "256": "Zone",
            "512": "Wide/Tracking"
        }
    },
    "0x1023": {
        "name": "FocusPixel",
        "values": {}
    },
    "0x102B": {
        "name": "PrioritySettings",
        "values": {}
    },
    "0x102D": {
        "name": "FocusSettings",
        "values": {}
    },
    "0x1034": {
        "name": "EXRMode",
        "values": {
            "0x100": "HR",
            "0x200": "SN",
            "0x300": "DR"
        }
    },
    "0x1040": {
        "name": "ShadowTone",
        "values": {
            "-64": "+4 (hardest)",
            "-48": "+3 (very hard)",
            "-32": "+2 (hard)",
            "-16": "+1 (medium hard)",
            "-8": "+0.5 (light hard)",
            "0": "0 (normal)",
            "8": "-0.5 (light soft)",
            "16": "-1 (medium soft)",
            "32": "-2 (soft)"
        }
    },
    "0x1041": {
        "name": "HighlightTone",
        "values": {
            "-64": "+4 (hardest)",
            "-48": "+3 (very hard)",
            "-32": "+2 (hard)",
            "-16": "+1 (medium hard)",
            "-8": "+0.5 (light hard)",
            "0": "0 (normal)",
            "8": "-0.5 (light soft)",
            "16": "-1 (medium soft)",
            "32": "-2 (soft)"
        }
    },
    "0x1047": {
        "name": "GrainEffectRoughness",
        "values": {
            "0": "Off",
            "32": "Weak",
            "64": "Strong"
        }
    },
    "0x1048": {
        "name": "ColorChromeEffect",
        "values": {
            "0": "Off",
            "32": "Weak",
            "64": "Strong"
        }
    },
    "0x104C": {
        "name": "GrainEffectSize",
        "values": {
            "0": "Off",
            "16": "Small",
            "32": "Large"
        }
    },
    "0x104E": {
        "name": "ColorChromeFXBlue",
        "values": {
            "0": "Off",
            "32": "Weak",
            "64": "Strong"
        }
    },
    "0x1201": {
        "name": "AdvancedFilter",
        "values": {
            "0x10000": "Pop Color",
            "0x20000": "Hi Key",
            "0x30000": "Toy Camera",
            "0x40000": "Miniature",
            "0x50000": "Dynamic Tone",
            "0x60001": "Partial Color Red",
            "0x60002": "Partial Color Yellow",
            "0x60003": "Partial Color Green",
            "0x60004": "Partial Color Blue",
            "0x60005": "Partial Color Orange",
            "0x60006": "Partial Color Purple",
            "0x70000": "Soft Focus",
            "0x90000": "Low Key",
            "0x100000": "Light Leak"
        }
    },
    "0x1210": {
        "name": "ColorMode",
        "values": {
            "0x0": "Standard",
            "0x10": "Chrome",
            "0x30": "B & W"
        }
    },
    "0x1300": {
        "name": "BlurWarning",
        "values": {
            "0": "None",
            "1": "Blur Warning"
        }
    },
    "0x1301": {
        "name": "FocusWarning",
        "values": {
            "0": "Good",
            "1": "Out of focus"
        }
    },
    "0x1302": {
        "name": "ExposureWarning",
        "values": {
            "0": "Good",
            "1": "Bad exposure"
        }
    },
    "0x1400": {
        "name": "DynamicRange",
        "values": {
            "1": "Standard",
            "3": "Wide"
        }
    },
    "0x1401": {
        "name": "FilmMode",
        "values": {
            "0x0": "F0/Standard (Provia)",
            "0x100": "F1/Studio Portrait",
            "0x110": "F1a/Studio Portrait Enhanced Saturation",
            "0x120": "F1b/Studio Portrait Smooth Skin Tone (Astia)",
            "0x130": "F1c/Studio Portrait Increased Sharpness",
            "0x200": "F2/Fujichrome (Velvia)",
            "0x300": "F3/Studio Portrait Ex",
            "0x400": "F4/Velvia",
            "0x500": "Pro Neg. Std",
            "0x501": "Pro Neg. Hi",
            "0x600": "Classic Chrome",
            "0x700": "Eterna",
            "0x800": "Classic Negative",
            "0x900": "Bleach Bypass",
            "0xa00": "Nostalgic Neg",
            "0xb00": "Reala ACE"
        }
    },
    "0x1402": {
        "name": "DynamicRangeSetting",
        "values": {
            "0x0": "Auto",
            "0x1": "Manual",
            "0x100": "Standard (100%)",
            "0x200": "Wide1 (230%)",
            "0x201": "Wide2 (400%)",
            "0x8000": "Film Simulation"
        }
    },
    "0x1403": {
        "name": "DevelopmentDynamicRange",
        "values": {}
    },
    "0x1443": {
        "name": "DRangePriority",
        "values": {
            "0": "Auto",
            "1": "Fixed"
        }
    },
    "0x1444": {
        "name": "DRangePriorityAuto",
        "values": {
            "1": "Weak",
            "2": "Strong",
            "3": "Plus"
        }
    },
    "0x1445": {
        "name": "DRangePriorityFixed",
        "values": {
            "1": "Weak",
            "2": "Strong"
        }
    }
} as const;


