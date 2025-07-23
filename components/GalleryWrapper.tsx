"use client"

import { useState } from "react"
import { PhotoAllResponse } from "@/lib/types/photo";
import Lightbox from "./Lightbox";
import GalleryCard from "./GalleryCard";

type GalleryWrapperProps = {
    photos: PhotoAllResponse[]
}

export default function GalleryWrapper({ photos }: GalleryWrapperProps) {
    const [selectedImage, setSelectedImage] = useState<PhotoAllResponse | null>(null)

    return (
        <>
            <div>
                {photos.map((photo, idx) => (
                    <div key={idx}>
                        <GalleryCard 
                            photo={photo} 
                            idx={idx} 
                            onImageClick={setSelectedImage}
                        />
                    </div>
                ))}
            </div>
            
            {selectedImage && (
                <Lightbox
                    photo={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}

        </>        
    )
}