"use client"

import { uploadPhoto } from "@/app/admin/actions/uploadPhoto"
import React, { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { UploadFormSchema, UploadFormValues } from "@/lib/validation/uploadSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, X, Upload as UploadIcon } from "lucide-react"


export default function Upload() {

    const inputRef = useRef<HTMLInputElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string[]>([]);
    const { 
        control, 
        register, 
        handleSubmit, 
        formState: { errors }, 
        clearErrors,
        reset 
    } = useForm<UploadFormValues>({
        resolver: zodResolver(UploadFormSchema),
        defaultValues: { items: [] }
    })

    const { fields, append, remove } = useFieldArray({
        control, 
        name: "items",
    })

    function openFileDialog() {
        if(inputRef.current) inputRef.current.click()
    }

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
        e.target.value = "";
        clearErrors()
    }

    const onSubmit: SubmitHandler<UploadFormValues> = async (data) => {
        // console.log(data)
        setLoading(true)

        const uploads = data.items 

        const promises = uploads.map(async (upload) => {
            try {
                await uploadPhoto(upload)
            } catch(err) {
                if(err)
                    setError(e => [...e, ("Error on '" + upload.title + "': " + err?.toString())])
            }
        })
        await Promise.all(promises)
        setLoading(false)
        reset()
    }

    return(
        <div className="grid grid-cols-12 grid-rows-[75px_auto] font-mono">
            
            <form onSubmit={handleSubmit(onSubmit)}
                className="col-start-3 col-span-8  row-start-2 bg-accent p-10 rounded-2xl outline-1">
            
            <h1 className="text-3xl mb-10">
                Upload Photos</h1>
        
            {error.length !== 0 && 
                <Alert variant="destructive" className="my-5">
                    <AlertTitle>Error uploading images.</AlertTitle>
                    <AlertCircleIcon></AlertCircleIcon>
                    <AlertDescription>
                        <ul>
                            {error.map((err, id) => (
                                <li key={id}>{err}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>}

            {fields.length === 0 && (
                <div>
                <Input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="
                        hidden
                        cursor-pointer"
                    onChange={onFileChange}>
                </Input>
                <Button 
                    className="hover:cursor-pointer hover:bg-gray-50"
                    onClick={openFileDialog}>
                    <UploadIcon></UploadIcon>
                    Browse
                </Button>
                </div>
            )}

            {fields.map((field, idx) => (
                <div
                    key={field.id}
                    className="flex items-center mb-12">
                    <Image
                        src={URL.createObjectURL(field.file)}
                        width={100}
                        height={100}
                        className="object-cover mr-4 rounded-sm outline-2"
                        alt={`thumbnail of image ${idx}`}
                        />
                    
                    <div className="flex-grow">
                    
                        <Input
                            className="mb-2"
                            placeholder="Title"
                            defaultValue={field.title}
                            {...register(`items.${idx}.title` as const)}
                        />
                        {errors.items?.[idx]?.title && (
                            <p className="text-red-500">
                                {errors.items?.[idx]?.title.message}
                            </p>
                        )}
                        <Textarea 
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
                        variant="outline"
                        onClick={() => remove(idx)}
                        className="ml-12 my-auto hover:cursor-pointer"
                    > 
                        <X></X>
                    </Button>
                </div>
            ))}
            
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
                    variant="outline"
                    className="hover:cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ marginRight: 12 }}
                >
                    Add more
                </Button>

                { loading ? <Button>Uploading...</Button> 
                            : <Button variant="default" 
                                    className="hover:cursor-pointer"
                                    type="submit">Upload</Button>}
                
                </div>
            )}
            
            </form>
        </div>
    )
}