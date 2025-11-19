import React from "react";
import { getPhotosHomepage } from "@/lib/db";
import { PhotoAllResponse } from "@/lib/types/photo";
import Link from "next/link";
import GalleryWrapper from "@/components/GalleryWrapper";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import NavMenu from "@/components/NavMenu";


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
    <>
      {photos && photos.length > 0 && (
        <>
          {photos.slice(0, 2).map((photo, idx) => {
            const optimizedUrl = optimizeCloudinaryUrl(photo.secureURL, {
              format: 'auto'
            });
            return (
              <link
                key={idx}
                rel="preload"
                as="image"
                href={optimizedUrl}
              />
            );
          })}
        </>
      )}

      <div className="flex flex-col max-w-[1280px] mx-auto font-mono">
        <div className="grid grid-cols-5 gap-4">
          {/* <div></div>
          <div className="my-auto">
            <NavMenu></NavMenu>
          </div>
          <div></div> */}

          <Link
            href="/"
            className="col-start-4 col-span-1 justify-self-end hover:text-gray-400">
            <h1 className=" text-[14px] my-5 ml-5">sanjayspics.com</h1>
          </Link>
        </div>
        {!photos ? <div>Error retrieving photos</div>
          : <GalleryWrapper photos={photos} />
        }
      </div>
    </>
  );
}
