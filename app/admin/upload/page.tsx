"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { uploadPhoto } from "../actions/uploadPhoto"
import { Button } from "@/components/ui/button"
import { useState } from "react"
// import { Label } from "@/components/ui/label"
import { UploadFormSchema, UploadFormValues } from "@/lib/validation/uploadSchema"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useRef } from "react"


export default function Upload() {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string[]>([])
    const { 
        control, 
        register, 
        handleSubmit, 
        formState: { errors }, 
        reset 
    } = useForm<UploadFormValues>({
        resolver: zodResolver(UploadFormSchema),
        defaultValues: { items: [] }
    })

    const { fields, append, remove } = useFieldArray({
        control, 
        name: "items",
    })

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if(!files) return;

        Array.from(files).forEach((file) => {
            append({
                file,
                title: "",
                caption: "",
            })
        })
        // resetField("dummy");
        e.target.value = "";
    }

    const onSubmit: SubmitHandler<UploadFormValues> = (data) => {
        // console.log(data)
        setLoading(true)

        const uploads = data.items 

        uploads.forEach(async (upload) => {
            try {
                await uploadPhoto(upload)
            } catch(err) {
                if(err)
                    setError(e => [...e, ("Error on '" + upload.title + "': " + err?.toString())])
            }
        })
        setLoading(false)
        reset()
    }

    return(
        <div className="min-h-screen grid place-items-center px-4">
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
            {fields.length === 0 && (
                <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onFileChange}>
                </Input>
            )}

            {fields.map((field, idx) => (
                <div
                    key={field.id}
                    className="flex items-center, mb-12">
                    <Image
                        src={URL.createObjectURL(field.file)}
                        width={80}
                        height={80}
                        className="object-cover"
                        alt={`thumbnail of image ${idx}`}
                        />
                    
                    <div className="flex-grow">
                    
                        <Input
                            placeholder="Title"
                            defaultValue={field.title}
                            {...register(`items.${idx}.title` as const)}
                        />
                        {errors.items?.[idx]?.title && (
                            <p className="text-red-500">
                                {errors.items?.[idx]?.title.message}
                            </p>
                        )}
                        <Input
                            placeholder="Caption (optional)"
                            {...register(`items.${idx}.caption` as const)}
                            defaultValue={field.caption}
                        />
                        {errors.items?.[idx]?.caption && (
                            <p className="text-red-500">
                                {errors.items[idx].caption?.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="button"
                        onClick={() => remove(idx)}
                        className="ml-12"
                    > 
                        Remove
                    </Button>
                </div>
            ))}
            {/* Hidden file input for “Add more” */}
            <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={onFileChange}
                style={{ display: "none" }}
            />

            {fields.length > 0 && (
                <div style={{ marginTop: 16 }}>
                <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ marginRight: 12 }}
                >
                    Add more
                </Button>

                { loading ? <Button>Uploading...</Button> 
                            : <Button type="submit">Upload</Button>}
                
                </div>
            )}
            
            </form>
        </div>
    )
}