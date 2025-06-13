import { loadImage } from './loader.js';

window.addEventListener('DOMContentLoaded', init);

async function init() {

    const numImages = 12;

    for(let i = 1; i <= numImages; i++) {
        await loadImage('gallery', i);

    }

}