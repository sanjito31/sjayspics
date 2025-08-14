'use server'

import prisma from "@/lib/prisma";

export async function getRecipes() {
  try {
    const recipes = await prisma.fujifilmRecipes.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw new Error('Failed to fetch recipes');
  }
}

export async function deleteRecipe(id: string) {
  try {
    await prisma.fujifilmRecipes.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw new Error('Failed to delete recipe');
  }
}

export async function updateRecipe(id: string, data: Record<string, string>) {
  try {
    const recipe = await prisma.fujifilmRecipes.update({
      where: { id },
      data: {
        recipeName: data.recipeName,
        filmSim: data.filmSim,
        colorTemperature: data.colorTemperature || 'auto',
        developmentDynamicRange: data.developmentDynamicRange || '',
        whiteBalanceFineTune: data.whiteBalanceFineTune || '',
        noiseReduction: data.noiseReduction || '',
        highlightTone: data.highlightTone || '',
        shadowTone: data.shadowTone || '',
        color: data.color || '',
        sharpness: data.sharpness || '',
        clarity: data.clarity || '',
        colorChromeEffect: data.colorChromeEffect || '',
        colorChromeFXBlue: data.colorChromeFXBlue || '',
        grainEffectSize: data.grainEffectSize || '',
        grainEffectRoughness: data.grainEffectRoughness || ''
      }
    });

    return { success: true, recipe };
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw new Error('Failed to update recipe');
  }
}