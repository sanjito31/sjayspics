import Image from "next/image"
import { PhotoAllResponse } from "@/lib/types/photo"
import { Camera, Aperture } from "lucide-react"
import Link from "next/link"
// import { useRouter } from "next/navigation"


type GalleryCardProps = {
    photo: PhotoAllResponse
}

export default function GalleryCard( { photo }: GalleryCardProps) {


    return (
        <div className="grid grid-cols-5 gap-4 space-y-2"> {/* flex mx-auto */}
            {/* w-1/5 */}
            {/* <div className=""></div> */}
            {/* w-3/5 */}
            <Link 
                className="col-start-2 col-span-3"
                href={`/photo/${photo.publicID}`}>
                <Image
                     
                    width={photo.width}
                    height={photo.height}
                    quality={50}
                    priority={true}
                    // sizes=""                
                    src={photo.secureURL}
                    alt={photo?.title || "No title given"} 
                    />
            </Link>
            {/* flex flex-col ml-7 w-1/5 */}
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
                <span className="">{photo.caption}</span><br/>
                </div>
            </div>
        </div>
    )
}