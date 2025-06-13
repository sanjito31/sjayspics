// window.onload=getExif;

// function getExif() {
//     let img1 = document.getElementById("img1");
//     EXIF.getData(img1, function() {
//         var shutter = EXIF.getTag(this, "ShutterSpeedValue");
//         var aperture = EXIF.getTag(this, "FNumber");
//         var iso = EXIF.getTag(this, "ISOSpeedRatings");
//         var filmSim = EXIF.getTag(this, 0x1401);

//         var img1Tags = document.getElementById("img1-tags");
//         img1Tags.innerHTML = `${shutter} ${aperture} ${iso} ${filmSim}`;
//     });
// }

import exifr from 'https://unpkg.com/exifr/dist/full.esm.js';

window.addEventListener('DOMContentLoaded', async () => {

    const img = document.getElementById("img1");
    const output = document.getElementById("img1-tags");

    try {
        const blob = await fetch(img.src).then(r => r.blob());

        const tags = await exifr.parse(blob, {
            skip:               ['UserComment'],
            translateValues:    true,
            reviveValues:       true
        });

        let shutter = 'n/a';
        if(tags.ShutterSpeedValue != null) {
            const denom = Math.round(2 ** tags.ShutterSpeedValue);
            shutter = `1/${denom}s`;
        }

        // const raw = tags.DateTimeOriginal;
        // let dt;
        // if(raw instanceof Date) {
        //     dt = raw;
        // } else if (typeof raw === 'String') {

        // }

        const aperture  = tags.FNumber          ?? 'n/a';
        const iso       = tags.ISOSpeedRating   ?? tags.ISO ?? 'n/a';
        const filmSim   = tags.FilmMode         ?? 'n/a';
        const dateTaken = tags.DateTimeOriginal ?? 'n/a';

        output.textContent =
        `${dateTaken}
        ${shutter}
        ƒ/${aperture}
        ISO ${iso}
        ${filmSim}`;

    } catch(err) {
        output.textContent = 'Error reading EXIF: ' + err.message;
    }        
})


let file = document.getElementById("img1");
const tags = await exifr.parse(file,  {
    skip:   ['UserComment'],
    translateValues: true,
    reviveValues: true
});

var shutter = tags.shutter;
var aperture = tags.aperture;
var iso = tags.iso;
var filmSim = tags.filmSim;

var img1Tags = document.getElementById("img1-tags");
img1Tags.innerHTML = `${shutter} ${aperture} ${iso} ${filmSim}`;