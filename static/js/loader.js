import { getExif } from "./exif.js";

export async function loadImage(container, imagePath) {
    
    const containerElement = document.getElementById(container);

    // create div
    const unit = document.createElement('div');
    unit.classList.add('gallery-item');

    // add image
    const image = document.createElement('img');
    // image.src = `../images/photo${imageNum}.jpg`;
    image.src = imagePath;
    image.alt = `image ${imagePath}`;

    // add text component (title and caption)
    const text = document.createElement('div');
    text.classList.add('text');

    // add title
    const title = document.createElement('h2');
    title.textContent = `image ${imagePath}`;

    // add caption/text
    const caption = document.createElement('p');
    caption.textContent = `this is image number ${imagePath}`;

    // add exif data
    const exifText = document.createElement('pre');
    const exif = await getExif(image);
    exifText.textContent = 
        `${exif.dateTime}
        ${exif.shutterSpeed}
        ƒ/${exif.aperture}
        ISO ${exif.iso}
        ${exif.filmSim}`;

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