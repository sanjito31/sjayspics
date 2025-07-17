import Image from "next/image"
import { PhotoAllResponse } from "@/lib/types/photo"


type GalleryCardProps = {
    photo: PhotoAllResponse
}




export default function GalleryCard( { photo}: GalleryCardProps) {
    return (
        <div 
            className="flex">
        
            <Image
                width={600}
                height={600}
                src={photo.secureURL}
                alt={photo?.title || "No title given"} />
            
            <div>
                <h1>{photo.title}</h1><br/>
                <p>{photo.caption}</p><br/>
                <p>{photo.exifData?.shutterSpeed}s</p><br/>
                <p>f/{photo.exifData?.aperture}</p><br/>
                <p>ISO {photo.exifData?.iso}</p><br/>
                <p>{photo.exifData?.dateTaken?.toLocaleDateString("en-us")}</p><br/>
                <p>{photo.exifData?.make} {photo.exifData?.model}</p><br/>
                <p>{photo.fujiData?.filmMode}</p>
            </div>
        </div>
    )
}