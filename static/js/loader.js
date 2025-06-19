// import { getExif } from "./exif.js";

function aperture_convert(str) {
  let raw;

  if (str.includes('/')) {
    // “71/10” → [“71”, “10”] → [71, 10]
    const [num, den] = str.split('/').map(s => parseInt(s, 10));
    raw = num / den;
  } else {
    // already a single number (might have decimals)
    raw = parseFloat(str);
  }

  // round to 1 decimal place and return a Number
  return Math.round(raw * 10) / 10;
}

export async function loadImage(container, imagesJSON) {

    const imageTitle = imagesJSON.title;
    const imagePath = imagesJSON.url;
    const dt = new Date(imagesJSON.taken_at);
    const year = dt.getFullYear();
    const month = dt.getMonth();
    const day = dt.getDay();
    const shutterSpeed = imagesJSON.shutter_speed;
    const aperture = aperture_convert(imagesJSON.aperture);
    const iso = imagesJSON.iso;
    const filmSim = imagesJSON.film_sim;

    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    
    const containerElement = document.getElementById(container);

    // create div
    const unit = document.createElement('div');
    unit.classList.add('gallery-item');
    // append to gallery main div
    containerElement.appendChild(unit);

    // add image
    const image = document.createElement('img');
    image.src = imagePath;
    image.alt = `${imageTitle}`;
    unit.appendChild(image);

    // add text component (title and caption)
    const text = document.createElement('div');
    text.classList.add('text');
    unit.appendChild(text);

    // add title
    const title = document.createElement('h2');
    title.textContent = imageTitle;
    text.appendChild(title);

    // add caption/text
    // const caption = document.createElement('p');
    // caption.textContent = `info:`;
    // text.appendChild(caption);

    // add exif data
    const exifText = document.createElement('pre');
    exifText.textContent = `${months[month]} ${year}\n${shutterSpeed}\nƒ/${aperture}\nISO ${iso}\n${filmSim}`;
    text.appendChild(exifText);

}