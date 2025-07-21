import AdminSidebar from "@/components/AdminSidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <AdminSidebar>
            {children}
        </AdminSidebar>
    </div>
  )
}
