"use server"

import { NextResponse } from "next/server";
import { UploadItemAPISchema } from "@/lib/validation/uploadSchema";
import { uploadPhoto } from "@/app/admin/actions/uploadPhoto";
import { del } from "@vercel/blob"
import { revalidatePath } from "next/cache";


export async function POST(request: Request) {

    try {
        const json = await request.json();
        const { title, caption, url } = UploadItemAPISchema.parse(json)


        const res = await fetch(url);
        if(!res.ok) {
            return NextResponse.json(
                { success: false, error: `Blob fetch failed (${res.status})`},
                { status: res.status }
            )
        }

        const buffer = Buffer.from(await res.arrayBuffer());

        await uploadPhoto({ title, caption, buffer })

        await del(url)
        revalidatePath("/")

        return NextResponse.json({ success: true }, {status: 200 })

    } catch (err) {
        const e = err as Error;
        console.log(e.message)
        const isValidationError = e.name === 'ZodError';
        const status = isValidationError ? 400 : 500;
        const message = e.message || 'Unknown error';

        return NextResponse.json(
            { success: false, error: message },
            { status }
        );
    }
}