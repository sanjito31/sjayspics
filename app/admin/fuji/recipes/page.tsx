import { Suspense } from 'react';
import RecipesManagement from './RecipesManagement';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function RecipesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fujifilm Recipes</h1>
          <p className="text-muted-foreground">
            Manage your Fujifilm recipe collection
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/fuji/add-recipe">
            <Plus className="h-4 w-4 mr-2" />
            Add Recipe
          </Link>
        </Button>
      </div>
      
      <Suspense fallback={<div>Loading recipes...</div>}>
        <RecipesManagement />
      </Suspense>
    </div>
  );
}