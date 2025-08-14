'use client'

import { useState } from "react"
import Image from "next/image"
import { optimizeCloudinaryUrl } from "@/lib/cloudinary"
import { PhotoAllResponse } from "@/lib/types/photo"
import Lightbox from "@/components/Lightbox"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type FilmPageClientProps = {
    images: PhotoAllResponse[]
    film: string
}

export default function FilmPageClient({ images, film }: FilmPageClientProps) {
    const [selectedImage, setSelectedImage] = useState<PhotoAllResponse | null>(null)

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12 font-mono text-[14px]">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
                
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-extrabold mb-2">Now showing: {film}</h1>
                    <p className="text-gray-400">{images.length} {images.length === 1 ? 'photo' : 'photos'}</p>
                </div>
                
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                    {images.map((image, idx) => {
                        const optimizedUrl = optimizeCloudinaryUrl(image.secureURL, {
                            format: 'auto'
                        });
                        
                        return (
                            <div 
                                key={idx}
                                className="break-inside-avoid mb-4 cursor-pointer"
                                onClick={() => setSelectedImage(image)}
                            >
                                <Image 
                                    src={optimizedUrl}
                                    width={image.width}
                                    height={image.height}
                                    alt={image.title}
                                    loading={idx < 10 ? "eager" : "lazy"}
                                    priority={idx < 10}
                                    fetchPriority={idx < 10 ? "high" : "auto"}
                                    className="w-full h-auto shadow-sm hover:shadow-lg transition-shadow animate-in fade-in zoom-in-75 duration-700"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                                />
                            </div>
                        );
                    })}
                </div>
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