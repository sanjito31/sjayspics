'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PhotoAllResponse } from '@/lib/types/photo'

type LightboxProps = {
    photo: PhotoAllResponse,
    onClose: () => void
}

export default function Lightbox({ photo, onClose }: LightboxProps) {
    const [isLoading, setIsLoading] = useState(true);
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            onClose()
        }
    }

    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const focusRef = (element: HTMLDivElement | null) => {
        if (element) {
            element.focus()
        }
    }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-95 z-50"
      onClick={handleBackgroundClick}
      onKeyDown={handleKeyDown}
      ref={focusRef}
      tabIndex={0} 
      style={{ overflow: 'hidden' }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4" onClick={handleBackgroundClick}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin"></div>
            </div>
          </div>
        )}
        <Image
          src={photo.secureURL}
          alt={photo.title}
          width={photo.width}
          height={photo.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 90vw, 85vw"
          className="max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] object-contain"
          quality={90}
          onLoad={() => setIsLoading(false)}
          onClick={(e) => e.stopPropagation()}
        />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 font-light"
          aria-label="Close lightbox"
        >
          ×
        </button>
      </div>
    </div>
  )
}