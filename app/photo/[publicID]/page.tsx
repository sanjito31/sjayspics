import prisma from "@/lib/prisma"
import Image from "next/image"

export default async function PhotoPage({params}: {params: Promise<{ publicID: string}>}) {
    const { publicID } = await params

    const image = await prisma.photo.findUnique({
        where: { publicID: publicID}
    })
    if(image) {

        return (
            <div>
                <Image
                    src={image.secureURL}
                    width={image.width}
                    height={image.height}
                    objectFit="true"
                    alt="an image">
                </Image>
            </div>
        )
    }   
}