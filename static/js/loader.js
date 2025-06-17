// import { getExif } from "./exif.js";

export async function loadImage(container, imagesJSON) {

    const imageTitle = imagesJSON.title;
    const imagePath = imagesJSON.url;
    const dt = new Date(imagesJSON.taken_at);
    const year = dt.getFullYear();
    const month = dt.getMonth();
    const day = dt.getDay();
    const shutterSpeed = imagesJSON.shutter_speed;
    const aperture = imagesJSON.aperture;
    const iso = imagesJSON.iso;
    const filmSim = imagesJSON.filmSim;

    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    
    const containerElement = document.getElementById(container);

    // create div
    const unit = document.createElement('div');
    unit.classList.add('gallery-item');

    // add image
    const image = document.createElement('img');
    image.src = imagePath;
    image.alt = `${imageTitle}`;

    // add text component (title and caption)
    const text = document.createElement('div');
    text.classList.add('text');

    // add title
    const title = document.createElement('h2');
    title.textContent = imageTitle;

    // add caption/text
    const caption = document.createElement('p');
    caption.textContent = `info:`;

    // add exif data
    const exifText = document.createElement('pre');
    // const exif = await getExif(image);
    exifText.textContent = 
        `${months[month]} ${year}
        ${shutterSpeed}
        ƒ/${aperture}
        ISO ${iso}
        ${filmSim}`;

    // append all sub-text elements to text
    text.appendChild(title);
    text.appendChild(caption);
    text.appendChild(exifText);

    // append both to div unit (image before text)
    unit.appendChild(image);
    unit.appendChild(text);

    // append to gallery main div
    containerElement.appendChild(unit);
}