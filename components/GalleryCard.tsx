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
        <div className="md:grid md:grid-cols-5 md:gap-4 space-y-2">         
            <div
                className="cursor-pointer md:col-start-2 md:col-span-3 px-4 md:px-0"
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

            <div className="md:col-start-5 md:col-span-1 md:ml-3 text-[14px] font-extrabold px-4 md:px-0">
                <div className="grid grid-cols-2 gap-4 md:block">
                    <div>
                        <h1 className="">{photo.title.toUpperCase()}</h1>
                        <span className="font-light block"><i>{photo.caption}</i></span>
                        <div className="text-gray-400">
                            <span><Camera size={16} className="inline-block align-middle mr-1 mb-0.5"/>
                                {photo.exifData?.make} {photo.exifData?.model}</span><br/>
                            <span><Aperture size={16} className="inline-block align-middle mr-1 mb-0.5"/>
                                {photo.exifData?.lens}</span>
                        </div>
                    </div>
                    
                    <div className="text-gray-400">
                        <span>{photo.exifData?.shutterSpeed}s</span><br/>
                        <span>f/{photo.exifData?.aperture}</span><br/>
                        <span>ISO {photo.exifData?.iso}</span><br/><br/>
                        <span>{photo.exifData?.dateTaken?.toLocaleDateString()}</span><br/>
                        <br/>
                        <Link href={`/film/${photo.fujiData?.filmMode?.replaceAll(" ", "_")}`}
                                className="hover:text-white">
                            <span>{photo.fujiData?.filmMode}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}