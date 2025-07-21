"use client"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"


export default function SignOutButton() {
    const router = useRouter();

    async function handleSignOut() {
        await authClient.signOut()
        router.push("/")
    }

    return (
        <Button type="button" onClick={handleSignOut}>
            Log Out
        </Button>
    )
}
