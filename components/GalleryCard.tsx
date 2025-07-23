import Image from "next/image"
import { PhotoAllResponse } from "@/lib/types/photo"
import { Camera, Aperture } from "lucide-react"
import Link from "next/link"


type GalleryCardProps = {
    photo: PhotoAllResponse
    idx: number
    onImageClick: (photo: PhotoAllResponse) => void
}

export default function GalleryCard( { photo, idx, onImageClick }: GalleryCardProps) {


    return (
        <div className="grid grid-cols-5 gap-4 space-y-2">         
            <div
                className="cursor-pointer col-start-2 col-span-3"
                onClick={() => onImageClick(photo)}>
                <Image
                    className="w-full h-auto"
                    width={photo.width}
                    height={photo.height}
                    quality={50}
                    loading={idx < 6 ? "eager" : "lazy"}
                    priority={idx < 6}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 762px, 762px"                
                    src={photo.secureURL}
                    alt={photo?.title || "No title given"} 
                    />
            </div>

    
            <div className="col-start-5 col-span-1 ml-3 text-[14px] font-extrabold">
                <h1 className="">{photo.title.toUpperCase()}</h1><br/>
                <div className="text-gray-400">

                <span><Camera size={16} className="inline-block align-middle mr-1 mb-0.5"/>
                    {photo.exifData?.make} {photo.exifData?.model}</span><br/>
                <span><Aperture size={16} className="inline-block align-middle mr-1 mb-0.5"/>
                    {photo.exifData?.lens}</span><br/><br/>
                <span>{photo.exifData?.shutterSpeed}s</span><br/>
                <span>f/{photo.exifData?.aperture}</span><br/>
                <span>ISO {photo.exifData?.iso}</span><br/><br/>
                <span>{photo.exifData?.dateTaken?.toLocaleDateString()}</span><br/>
                <br/>
                <Link href={`/film/${photo.fujiData?.filmMode?.replaceAll(" ", "_")}`}
                        className="hover:text-white">
                    <span>{photo.fujiData?.filmMode}</span>
                </Link>
                <br/>
                <br/>
                <span className="font-light mt-4"><i>{photo.caption}</i></span><br/>
                </div>
            </div>
        </div>
    )
}