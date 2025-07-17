import type { Prisma } from "@/app/generated/prisma"

export type PhotoAllResponse = Prisma.PhotoGetPayload<{
    include: {
        exifData: true,
        fujiData: true,
    }
}>