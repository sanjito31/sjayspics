"use server"

import { auth } from "./auth"
import { headers } from "next/headers"

export async function signUp(name: string, email: string, password: string) {
  
    await auth.api.signUpEmail({
        body: {
            name: name,
            email: email,
            password: password
        }
    })

}

export async function signIn(email: string, password: string) {

    try {
        await auth.api.signInEmail({
            body: {
                email: email,
                password: password
            },
            headers: await headers(),
        })

        return {
            success: true,
            message: "Signed in successfully."
        }

    } catch(err) {
        const e = err as Error;
        return {
            success: false,
            message: e.message || "An unknown error occured." 
        }

    } 
}