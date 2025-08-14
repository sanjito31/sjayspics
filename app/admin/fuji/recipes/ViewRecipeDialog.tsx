'use client'

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface ViewRecipeDialogProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function ViewRecipeDialog({ recipe, onClose }: ViewRecipeDialogProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const settingsSections = [
    {
      title: 'Film Simulation',
      settings: [
        { label: 'Film Simulation', value: recipe.filmSim }
      ]
    },
    {
      title: 'Color Settings',
      settings: [
        { label: 'Color Temperature', value: recipe.colorTemperature },
        { label: 'White Balance Fine Tune', value: recipe.whiteBalanceFineTune },
        { label: 'Color', value: recipe.color }
      ]
    },
    {
      title: 'Light Settings',
      settings: [
        { label: 'Development Dynamic Range', value: recipe.developmentDynamicRange },
        { label: 'Highlight Tone', value: recipe.highlightTone },
        { label: 'Shadow Tone', value: recipe.shadowTone }
      ]
    },
    {
      title: 'Effects',
      settings: [
        { label: 'Sharpness', value: recipe.sharpness },
        { label: 'Clarity', value: recipe.clarity },
        { label: 'Noise Reduction', value: recipe.noiseReduction },
        { label: 'Color Chrome Effect', value: recipe.colorChromeEffect },
        { label: 'Color Chrome FX Blue', value: recipe.colorChromeFXBlue },
        { label: 'Grain Effect Size', value: recipe.grainEffectSize },
        { label: 'Grain Effect Roughness', value: recipe.grainEffectRoughness }
      ]
    }
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {recipe.recipeName}
            <Badge variant="secondary">{recipe.filmSim}</Badge>
          </DialogTitle>
          <DialogDescription>
            Created: {formatDate(recipe.createdAt)} • 
            Updated: {formatDate(recipe.updatedAt)}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] px-1">
          <div className="space-y-6">
            {settingsSections.map((section, sectionIndex) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {section.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">{setting.label}</span>
                      <span className="text-sm text-gray-900 font-mono">{setting.value}</span>
                    </div>
                  ))}
                </div>
                {sectionIndex < settingsSections.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}