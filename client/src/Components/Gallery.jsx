import GalleryCard from "./GalleryCard"




function Gallery({ photos }) {

    return(
        <div id="gallery">
            {photos.map((photo, id) => (
                <GalleryCard
                    key={id}
                    title={photo["title"]}
                    url={photo["url"]}
                    shutter={photo["shutter_speed"]}
                    aperture={photo["aperture"]}
                    iso={photo["iso"]}
                    filmSim={photo["film_sim"]}
                    date={photo["taken_at"]} />
            ))}
        </div>
    )
}
export default Gallery