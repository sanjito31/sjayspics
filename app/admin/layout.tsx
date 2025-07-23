import AdminSidebar from "@/components/AdminSidebar"
import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!session) {
    redirect("/login")
  }
  
  return (
    <div>
        <AdminSidebar>
            {children}
        </AdminSidebar>
    </div>
  )
}
