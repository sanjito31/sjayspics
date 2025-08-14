import AddRecipeForm from "./AddRecipeForm";

export default function AddRecipePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Fujifilm Recipe</h1>
      </div>
      
      <div className="max-w-2xl">
        <p className="text-muted-foreground mb-6">
          Create a new Fujifilm recipe with custom settings for your photography workflow.
        </p>
        <AddRecipeForm />
      </div>
    </div>
  );
}