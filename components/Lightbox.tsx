'use client'

import Image from 'next/image'
import { PhotoAllResponse } from '@/lib/types/photo'

type LightboxProps = {
    photo: PhotoAllResponse,
    onClose: () => void
}

export default function Lightbox({ photo, onClose }: LightboxProps) {
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
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
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      ref={focusRef}
      tabIndex={0} 
      style={{ overflow: 'hidden' }}
    >
      <div className="relative max-w-full max-h-full">
        <Image
          src={photo.secureURL}
          alt={photo.title}
          width={photo.width}
          height={photo.height}
          sizes="max-width: 640px) 100vw, (max-width: 1200px) 90vw, 85vw"
          className="max-w-full max-h-full object-contain"
          quality={75}
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