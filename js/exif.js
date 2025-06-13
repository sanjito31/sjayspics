import { parse } from 'https://unpkg.com/exifr/dist/full.esm.js';

export async function getExif(img) {

    try {
        const blob = await fetch(img.src).then(r => r.blob());

        const tags = await parse(blob, {
            skip:               ['UserComment'],
            translateValues:    true,
            reviveValues:       true
        });

        let shutter = 'n/a';
        if(tags.ShutterSpeedValue != null) {
            const denom = Math.round(2 ** tags.ShutterSpeedValue);
            shutter = `1/${denom}s`;
        }

        return {
            shutterSpeed:       shutter,
            aperture:           tags.FNumber          ?? 'n/a',
            iso:                tags.ISOSpeedRating   ?? tags.ISO ?? 'n/a',
            filmSim:            tags.FilmMode         ?? 'n/a',
            make:               tags.Make,
            model:              tags.Model,
            dateTime:           tags.DateTimeOriginal ?? 'n/a'
        };
        
    } catch(err) {
        console.error('Error reading EXIF: ', err);
        return {};
    } 
}