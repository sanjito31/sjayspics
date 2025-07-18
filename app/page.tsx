import React from "react";
import { getPhotosHomepage } from "@/lib/db";
import { PhotoAllResponse } from "@/lib/types/photo";
import GalleryCard from "@/components/GalleryCard";
import Link from "next/link";



export default async function Home() {

  const photos: PhotoAllResponse[] | null = await (async () => {
  
    try {
      return await getPhotosHomepage();
    } catch (err) {
      console.error(err);
      return null;
    }
  })();

  
  return (
    // mx-auto items-center
    <div
      className="flex flex-col max-w-[1280px] mx-auto font-mono">
        <div className="grid grid-cols-5 gap-4">
          <Link 
            href="/"
            className="col-span-4 justify-self-end hover:text-gray-400">
              <h1 className=" text-[14px] my-5 ml-5">sanjayspics.com</h1>
          </Link>
        </div>      
    
          {!photos ? <div>Error retrieving photos</div> : photos.map((photo, idx) => (
            <div key={idx}>
              <GalleryCard photo={photo} />
            </div>
          ))}
    
    
    </div>
  );
}
