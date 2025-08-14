
import { getAllPhotos, getPhotoStats } from "@/lib/admin/photo-management";
import PhotoManagementClient from "./PhotoManagementClient";

export default async function Dashboard() {
  const [photos, stats] = await Promise.all([
    getAllPhotos(),
    getPhotoStats()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Photo Management Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card text-card-foreground p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Total Photos</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Public Photos</h3>
          <p className="text-2xl font-bold text-green-600">{stats.public}</p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Private Photos</h3>
          <p className="text-2xl font-bold text-red-600">{stats.private}</p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Recent (7 days)</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.recent}</p>
        </div>
      </div>

      <PhotoManagementClient photos={photos} />
    </div>
  )
}