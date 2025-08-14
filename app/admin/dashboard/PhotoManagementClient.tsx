'use client'

import { useState, useMemo } from 'react';
import { PhotoAllResponse } from '@/lib/types/photo';
import Image from 'next/image';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Eye, 
  EyeOff, 
  Trash2, 
  CheckSquare, 
  Square,
  Filter,
  Calendar,
  Camera
} from 'lucide-react';
import { 
  updatePhotoVisibility, 
  deletePhoto, 
  searchPhotos,
  bulkUpdateVisibility,
  bulkDeletePhotos 
} from '@/lib/admin/photo-management';
import { toast } from 'sonner';

type PhotoManagementClientProps = {
  photos: PhotoAllResponse[]
}

export default function PhotoManagementClient({ photos: initialPhotos }: PhotoManagementClientProps) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<'all' | 'public' | 'private'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Filter and search photos
  const filteredPhotos = useMemo(() => {
    let filtered = photos;

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(photo => 
        filterStatus === 'public' ? photo.isPublic : !photo.isPublic
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(photo =>
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.fujiData?.filmMode?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [photos, filterStatus, searchQuery]);

  const handleSelectPhoto = (photoId: string) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPhotos.size === filteredPhotos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(filteredPhotos.map(p => p.id)));
    }
  };

  const handleToggleVisibility = async (photoId: string, currentStatus: boolean) => {
    setIsLoading(true);
    try {
      await updatePhotoVisibility(photoId, !currentStatus);
      setPhotos(prev => prev.map(photo => 
        photo.id === photoId ? { ...photo, isPublic: !currentStatus } : photo
      ));
      toast.success(`Photo ${!currentStatus ? 'made public' : 'made private'}`);
    } catch (error) {
      toast.error('Failed to update photo visibility');
    }
    setIsLoading(false);
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    
    setIsLoading(true);
    try {
      await deletePhoto(photoId);
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
      setSelectedPhotos(prev => {
        const newSet = new Set(prev);
        newSet.delete(photoId);
        return newSet;
      });
      toast.success('Photo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete photo');
    }
    setIsLoading(false);
  };

  const handleBulkVisibilityToggle = async (makePublic: boolean) => {
    if (selectedPhotos.size === 0) return;

    setIsLoading(true);
    try {
      await bulkUpdateVisibility(Array.from(selectedPhotos), makePublic);
      setPhotos(prev => prev.map(photo => 
        selectedPhotos.has(photo.id) ? { ...photo, isPublic: makePublic } : photo
      ));
      setSelectedPhotos(new Set());
      toast.success(`${selectedPhotos.size} photos updated`);
    } catch (error) {
      toast.error('Failed to update photos');
    }
    setIsLoading(false);
  };

  const handleBulkDelete = async () => {
    if (selectedPhotos.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedPhotos.size} photos?`)) return;

    setIsLoading(true);
    try {
      await bulkDeletePhotos(Array.from(selectedPhotos));
      setPhotos(prev => prev.filter(photo => !selectedPhotos.has(photo.id)));
      setSelectedPhotos(new Set());
      toast.success(`${selectedPhotos.size} photos deleted`);
    } catch (error) {
      toast.error('Failed to delete photos');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'public' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('public')}
          >
            Public
          </Button>
          <Button
            variant={filterStatus === 'private' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('private')}
          >
            Private
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPhotos.size > 0 && (
        <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">
            {selectedPhotos.size} photo{selectedPhotos.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkVisibilityToggle(true)}
              disabled={isLoading}
            >
              <Eye className="h-4 w-4 mr-1" />
              Make Public
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkVisibilityToggle(false)}
              disabled={isLoading}
            >
              <EyeOff className="h-4 w-4 mr-1" />
              Make Private
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Select All */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={filteredPhotos.length > 0 && selectedPhotos.size === filteredPhotos.length}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm text-muted-foreground">
          Select all {filteredPhotos.length} photos
        </span>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPhotos.map((photo) => {
          const optimizedUrl = optimizeCloudinaryUrl(photo.secureURL, {
            format: 'auto'
          });

          return (
            <div key={photo.id} className="group relative bg-card rounded-lg overflow-hidden border">
              {/* Selection Checkbox */}
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedPhotos.has(photo.id)}
                  onCheckedChange={() => handleSelectPhoto(photo.id)}
                  className="bg-white/80 border-white"
                />
              </div>

              {/* Status Badge */}
              <div className="absolute top-2 right-2 z-10">
                <Badge variant={photo.isPublic ? "default" : "secondary"}>
                  {photo.isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>

              {/* Image */}
              <div className="aspect-square relative">
                <Image
                  src={optimizedUrl}
                  alt={photo.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Photo Info */}
              <div className="p-3 space-y-2">
                <h3 className="font-medium text-sm truncate">{photo.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {photo.caption || 'No caption'}
                </p>
                
                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{photo.createdAt.toLocaleDateString()}</span>
                  {photo.fujiData?.filmMode && (
                    <>
                      <Camera className="h-3 w-3" />
                      <span className="truncate">{photo.fujiData.filmMode}</span>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleVisibility(photo.id, photo.isPublic)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {photo.isPublic ? (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Show
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeletePhoto(photo.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No photos found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}