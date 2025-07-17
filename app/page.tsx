import React from "react";
import { getPhotosHomepage } from "@/lib/db";
import { PhotoAllResponse } from "@/lib/types/photo";
// import Image from "next/image";
import GalleryCard from "@/components/GalleryCard";



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
    <div
      className="flex flex-col items-center">
        <div className="">
          <h1>sanjay kumar photography</h1>
        </div>
        <div>
          {!photos ? <div>Error retrieving photos</div> : photos.map((photo, idx) => (
            <div key={idx}>
              <GalleryCard photo={photo} />
            </div>
          ))}
        </div>  
    </div>
  );
}
