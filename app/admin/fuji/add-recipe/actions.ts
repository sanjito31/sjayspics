'use server'

import prisma from "@/lib/prisma";
// import { redirect } from "next/navigation";

export async function createRecipe(data: Record<string, string>) {
  try {
    const recipe = await prisma.fujifilmRecipes.create({
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
    console.error('Error creating recipe:', error);
    throw new Error('Failed to create recipe');
  }
}