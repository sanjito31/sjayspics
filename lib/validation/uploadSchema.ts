import { z } from "zod"


const MAX_UPLOAD_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg"
]
    

const UploadItemSchema = z.object({
    title: z.string().min(1, "Title is required.").max(30, "Title can contain maximum 30 characters."),
    caption: z.string().optional(),
    file: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_UPLOAD_SIZE, {
            message: "Files must be 20MB or smaller."
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: `Only the following image types are allowed: 
                            ${ACCEPTED_IMAGE_TYPES.join(",")}`
        }),
})

export type UploadItem = z.infer<typeof UploadItemSchema>

export const UploadFormSchema = z.object({
    items: z
        .array(UploadItemSchema)
        .min(1, "Upload at least one image.")
})

export type UploadFormValues = z.infer<typeof UploadFormSchema>