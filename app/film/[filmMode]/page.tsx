import prisma from "@/lib/prisma"
import FilmPageClient from "./FilmPageClient"

export default async function PhotoPage({params}: {params: Promise<{ filmMode: string }>}) {
    const { filmMode } = await params

    const film = filmMode.replaceAll("_", " ")

    const images = await prisma.photo.findMany({
        include: {
            fujiData: true,
            exifData: true,
        }, 
        where: {
            fujiData: {
                filmMode: film
            }
        }
    })


    if(images) {
        return <FilmPageClient images={images} film={film} />
    } else {
        return (
            <p>Error finding images</p>
        )
    }   
}