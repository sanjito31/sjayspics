
const START_OFFSET = 14;
const ENTRY_COUNT_OFFSET = 12;
const ENTRY_COUNT_SIZE = 2;

const ENTRY_SIZE = 12;

// const TAG_ID_SIZE = 2;
// const TYPE_SIZE = 2;
// const COUNT_SIZE = 4;
const VALUE_OFFSET_SIZE = 4;

// offsets from beginning of entry of 12 bytes long
const TAG_ID_OFFSET = 0         // 2 bytes (bytes 0-1)
const TYPE_SIZE_OFFSET = 2      // 2 bytes (bytes 2-3)
const COUNT_OFFSET = 4          // 4 bytes (bytes 4-7)
const VALUE_OFFSET = 8          // 4 bytes (bytes 8-11)

// Sizes for common types
const BYTE_SIZE = 1
const CHAR_SIZE = 1
const SHORT_SIZE = 2
const LONG_SIZE = 4
const FLOAT_SIZE = 4
const DOUBLE_SIZE = 8


/*
 *  @input
 *  bytes: Buffer 
 *      a Buffer object that is only the maker note portion
 *      of the tags returned by exifr.parse
 *      const tags = await exifr.parse(image, { makerNote: true })
 *      const buffer = Buffer.from(tags.makerNote)
 *      const result = parseFujifilmMakerNote(buffer)
 *      * Done this way since tags.makerNote is type: any :/
 *
 */
export async function parseFujifilmMakerNote(
    bytes: Buffer
): Promise<Record<string, (string | number[])>> {

    const data: Record<string, (string | number[])> = {}
    const entries = bytes.readUIntLE(ENTRY_COUNT_OFFSET, ENTRY_COUNT_SIZE)

    for(let i = 0; i < entries; i++) {

        // Entry index 
        const index = START_OFFSET + (ENTRY_SIZE * i)

        // Tag Name
        const tag: string = "0x" + bytes.readUint16LE(index + TAG_ID_OFFSET).toString(16);
        
        // Type value (short, long, chars, etc)
        const typeValueRaw = bytes.readUint16LE(index + TYPE_SIZE_OFFSET);
        
        // Count of those ^ elements
        const countValue = bytes.readUint32LE(index + COUNT_OFFSET);

        
        const tagValue = await parseValueIFD(bytes, index, typeValueRaw, countValue)

        data[tag] = tagValue

    }
    return data
}


async function parseValueIFD(
    bytes: Buffer,          // Buffer to read from
    index: number,          // from which entry to start on
    type: number,           // the type of data to read
    count: number,          // the number of elements to read 
): Promise<string | number[]> {

    // The function we'll use based on type
    let readerFn: (offset: number) => number;

    // The number of bytes each element is based on type
    let size: number;

    switch(type) {
        // unsigned byte: Uint8 (1 byte)
        case 1:
            readerFn = bytes.readUint8.bind(bytes)
            size = BYTE_SIZE
            break;
        // String as chars: unsigned int8 (1 byte each)
        case 2: 
            // text decoder thing
            readerFn = bytes.readUint8.bind(bytes)
            size = CHAR_SIZE
            break;
        // unsigned short (2 bytes)
        case 3: 
            readerFn = bytes.readUint16LE.bind(bytes)
            size = SHORT_SIZE
            break;
        // unsigned long (4 bytes)
        case 4: 
            readerFn = bytes.readUint32LE.bind(bytes)
            size = LONG_SIZE
            break;
        // unsigned rational (8 bytes, parsed as an array of 2 longs)
        case 5:
            // requires special parsing
            readerFn = bytes.readUint32LE.bind(bytes)
            size = LONG_SIZE
            count *= 2
            break;
        // signed byte (1 byte)
        case 6: 
            readerFn = bytes.readInt8.bind(bytes)
            size = BYTE_SIZE
            break;
        // undefined
        case 7:
            return "Undefined"
        // signed short (2 bytes)
        case 8: 
            readerFn = bytes.readInt16LE.bind(bytes)
            size = SHORT_SIZE
            break;
        // signed long (4 bytes)
        case 9:
            readerFn = bytes.readInt32LE.bind(bytes)
            size = LONG_SIZE
            break;
        // signed rational (8 bytes, parsed as an array of 2 longs)
        case 10:
            // requires special parsing
            readerFn = bytes.readInt32LE.bind(bytes)
            count *= 2
            size = LONG_SIZE;
            break;
        // single float (4 bytes)
        case 11:
            readerFn = bytes.readFloatLE.bind(bytes)
            size = FLOAT_SIZE
            break;
        // double float (8 bytes)
        case 12:
            readerFn = bytes.readDoubleLE.bind(bytes)
            size = DOUBLE_SIZE
            break;
        default:
            // default treat as bytes
            size = BYTE_SIZE
            readerFn = bytes.readUint8.bind(bytes)
            break;
    }
    
    const numBytes = size * count
    // https://www.media.mit.edu/pia/Research/deepview/exif.html
    let start = index + VALUE_OFFSET        // Value default location
    if(numBytes > VALUE_OFFSET_SIZE) {
        start = bytes.readUint32LE(start)   // Value given offset location
    }

    // Return String as string
    if(type === 2) {
        return bytes.toString('utf-8', start, start + count)
    }

    // Gather values
    const arr: number[] = []
    for(let i = 0; i < count; i++) {
        arr.push(readerFn(start + (i * size)))
    }

    // Process Rational and return as string
    if((type === 5 || type === 10) && arr.length >= 2) {
        //processing for rationals
        const denominator = arr.pop() as number
        const numerator = arr.pop() as number

        if (denominator !== 0) {
            arr.push(numerator / denominator)
        } else {
            arr.push(0)
        }
    }
    // Return everything as string
    // } else {
        // everything else
    return arr
    // }
}