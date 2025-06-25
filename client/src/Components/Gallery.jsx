import GalleryCard from "./GalleryCard"
import { useState, useEffect } from "react";



function Gallery({ photos }) {

    const [filmFilter, setFilmFilter] = useState("");
    const [photosShown, setPhotosShown] = useState(() => photos ?? []);

    useEffect(() => {
        if(Array.isArray(photos)) {
            setPhotosShown(photos);
        }
    }, [photos]);

    function updatePhotosShown(newFilmFilter) {
        setFilmFilter(newFilmFilter);
        setPhotosShown(p => (
            p.filter(photo => photo.film_sim === newFilmFilter)
        ))
    }

    function resetFilmFilter() {
        setFilmFilter("")
        setPhotosShown(photos)
    }

    return(
        <div id="gallery">
            { (filmFilter !== "") && 
                <div className="filter-message">
                    <p>showing: <strong>{filmFilter}</strong> only</p>
                    <p><a onClick={resetFilmFilter}><u>reset feed</u></a></p>
                </div>
            }
            {photosShown.map((photo, id) => (
                <GalleryCard
                    key={id}
                    title={photo["title"]}
                    url={photo["url"]}
                    shutter={photo["shutter_speed"]}
                    aperture={photo["aperture"]}
                    iso={photo["iso"]}
                    filmSim={photo["film_sim"]}
                    date={photo["taken_at"]}
                    setFilmFilter={updatePhotosShown}
                     />
            ))}
        </div>
    )
}
export default Gallery