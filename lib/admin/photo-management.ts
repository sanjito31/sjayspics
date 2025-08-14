"use server"

import prisma from "@/lib/prisma";
import { PhotoAllResponse } from "@/lib/types/photo";

export async function getAllPhotos(): Promise<PhotoAllResponse[]> {
    return prisma.photo.findMany({
        include: {
            exifData: true,
            fujiData: true,
        },
        orderBy: { createdAt: 'desc' }
    })
}

export async function getPhotoStats() {
    const [totalPhotos, publicPhotos, privatePhotos, recentPhotos] = await Promise.all([
        prisma.photo.count(),
        prisma.photo.count({ where: { isPublic: true } }),
        prisma.photo.count({ where: { isPublic: false } }),
        prisma.photo.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                }
            }
        })
    ]);

    return {
        total: totalPhotos,
        public: publicPhotos,
        private: privatePhotos,
        recent: recentPhotos
    };
}

export async function updatePhotoVisibility(photoId: string, isPublic: boolean) {
    return prisma.photo.update({
        where: { id: photoId },
        data: { isPublic }
    });
}

export async function deletePhoto(photoId: string) {
    // Delete from database (Cloudinary cleanup would be handled separately)
    return prisma.photo.delete({
        where: { id: photoId }
    });
}

export async function searchPhotos(query: string): Promise<PhotoAllResponse[]> {
    return prisma.photo.findMany({
        where: {
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { caption: { contains: query, mode: 'insensitive' } },
                { fujiData: { filmMode: { contains: query, mode: 'insensitive' } } }
            ]
        },
        include: {
            exifData: true,
            fujiData: true,
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function bulkUpdateVisibility(photoIds: string[], isPublic: boolean) {
    return prisma.photo.updateMany({
        where: {
            id: { in: photoIds }
        },
        data: { isPublic }
    });
}

export async function bulkDeletePhotos(photoIds: string[]) {
    return prisma.photo.deleteMany({
        where: {
            id: { in: photoIds }
        }
    });
}