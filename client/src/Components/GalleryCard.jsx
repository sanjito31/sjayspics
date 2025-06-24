
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

function GalleryCard( {title, url, shutter, aperture, iso, filmSim, date } ) {

    const dt = new Date(date);
    const year = dt.getFullYear();
    const month = dt.toLocaleString('en-US', { month: 'long'});
    const FNumber = aperture_convert(aperture);
 
    return(
        <div className="gallery-item">
            <img src={url} alt={title} />
            <div className="text">
                <h2>{title}</h2><br />
                <pre>
                    {month} {year}<br />
                    {shutter}<br />
                    ƒ/{FNumber}<br />
                    ISO {iso}<br />
                    {filmSim}
                </pre>
            </div>
        </div>
    )
}
export default GalleryCard
