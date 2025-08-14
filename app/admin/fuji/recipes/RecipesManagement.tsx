'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { getRecipes, deleteRecipe } from './actions';
import EditRecipeDialog from './EditRecipeDialog';
import ViewRecipeDialog from './ViewRecipeDialog';

type Recipe = {
  id: string;
  recipeName: string;
  filmSim: string;
  colorTemperature: string;
  developmentDynamicRange: string;
  whiteBalanceFineTune: string;
  noiseReduction: string;
  highlightTone: string;
  shadowTone: string;
  color: string;
  sharpness: string;
  clarity: string;
  colorChromeEffect: string;
  colorChromeFXBlue: string;
  grainEffectSize: string;
  grainEffectRoughness: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function RecipesManagement() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  const loadRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleDelete = async (id: string, recipeName: string) => {
    try {
      await deleteRecipe(id);
      setRecipes(recipes.filter(recipe => recipe.id !== id));
      toast.success(`Recipe "${recipeName}" deleted successfully`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to delete recipe');
    }
  };

  const handleEditComplete = () => {
    setEditingRecipe(null);
    loadRecipes();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first Fujifilm recipe.</p>
            <Button asChild>
              <a href="/admin/fuji/add-recipe">Create Recipe</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{recipe.recipeName}</CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="mr-2">
                  {recipe.filmSim}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">White Balance:</span>
                  <span>{recipe.colorTemperature}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dynamic Range:</span>
                  <span>{recipe.developmentDynamicRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Highlights:</span>
                  <span>{recipe.highlightTone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shadows:</span>
                  <span>{recipe.shadowTone}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setViewingRecipe(recipe)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingRecipe(recipe)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{recipe.recipeName}&quot;? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(recipe.id, recipe.recipeName)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingRecipe && (
        <EditRecipeDialog
          recipe={editingRecipe}
          onClose={() => setEditingRecipe(null)}
          onComplete={handleEditComplete}
        />
      )}

      {viewingRecipe && (
        <ViewRecipeDialog
          recipe={viewingRecipe}
          onClose={() => setViewingRecipe(null)}
        />
      )}
    </>
  );
}