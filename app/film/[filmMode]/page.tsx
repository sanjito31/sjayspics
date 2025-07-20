import prisma from "@/lib/prisma"
import Image from "next/image"

export default async function PhotoPage({params}: {params: Promise<{ filmMode: string }>}) {
    const { filmMode } = await params

    const film = filmMode.replaceAll("_", " ")

    const images = await prisma.photo.findMany({
        include: {
            fujiData: true,
        }, 
        where: {
            fujiData: {
                filmMode: film
            }
        }
    })

    function getLowResLink(publicID: string, width: number) {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME
        return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width}/${publicID}.jpg`
    }

    if(images) {

        

        return (
            // <p>{film}</p>
            <div className="flex flex-col w-2/3 mx-auto mt-12 font-mono text-[14px]">
                <h2>Now showing: <strong>{film}</strong></h2>
                {/* <div className="flex">
                    <h2 className="font-[500] mr-1">Now showing:</h2>
                    <h2 className="font-extrabold">{film}</h2>
                </div> */}
                <div className="grid grid-cols-5 gap-1 mt-2">
                    {images.map((image, idx) => (
                        <Image 
                            key={idx}
                            src={getLowResLink(image.publicID, 500)}
                            width={500}
                            height={image.height/(image.width/500)}
                            alt={image.title} 
                            quality={25}/>
                    ))}

                </div>
            </div>
        )
    } else {
        return (
            <p>Error finding images</p>
        )
    }   
}