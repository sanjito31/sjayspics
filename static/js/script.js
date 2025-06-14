import { loadImage } from './loader.js';

window.addEventListener('DOMContentLoaded', init);

async function init() {

    // const numImages = 12;

    try {
        console.log("attemping to fetch images");
        const res = await fetch('/api/images');
        console.log('fetch status:', res.status, res.statusText);

        if(!res.ok) {
            throw new Error(`HTTP ${res.status} – ${res.statusText}`);
        }

        const paths = await res.json();

        for (const path of paths) {
            console.log(path);
            await loadImage('gallery', path);
        }
        console.log("after paths");

    // for(let i = 1; i <= numImages; i++) {
    //     await loadImage('gallery', i);

    // }

    } catch(err) {
        console.error('Failed to load image list:', err);
    }

}