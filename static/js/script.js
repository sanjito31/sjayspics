import { loadImage } from './loader.js';

window.addEventListener('DOMContentLoaded', init);

async function init() {

    try {
        console.log("attemping to fetch images");
        const res = await fetch('/api/images.json');
        console.log('fetch status:', res.status, res.statusText);

        if(!res.ok) {
            throw new Error(`HTTP ${res.status} – ${res.statusText}`);
        }

        const paths = await res.json();

        for (const p of paths) {
            console.log(p);
            await loadImage('gallery', p);
        }

    } catch(err) {
        console.error('Failed to load image list:', err);
    }

}