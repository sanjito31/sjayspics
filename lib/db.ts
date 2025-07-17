"use server"

import prisma from "@/lib/prisma";
import { PhotoAllResponse } from "./types/photo";

export async function getPhotosHomepage(): Promise<PhotoAllResponse[]> {
    
    return prisma.photo.findMany({
        where: {
            fujiData: {
                isNot: null,
            },
            isPublic: true,
        },
        include: {
            exifData: true,
            fujiData: true,
        },
        orderBy: { createdAt: 'desc' }
    })

}

