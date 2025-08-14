'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { FujifilmTags } from '@/lib/fujifilm/tags';
import { updateRecipe } from './actions';
import { toast } from 'sonner';

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

interface EditRecipeDialogProps {
  recipe: Recipe;
  onClose: () => void;
  onComplete: () => void;
}

// Helper functions (same as in AddRecipeForm)
const getDropdownOptions = (tagKey: string) => {
  const tag = FujifilmTags[tagKey as keyof typeof FujifilmTags];
  if (!tag || !tag.values || Object.keys(tag.values).length === 0) {
    return null;
  }
  
  return Object.entries(tag.values).map(([key, value]) => ({
    value: key,
    label: value
  }));
};

const generateRangeOptions = (min: number, max: number) => {
  const options = [];
  for (let i = min; i <= max; i++) {
    const value = i >= 0 ? `+${i}` : `${i}`;
    options.push({ value: value, label: value });
  }
  return options;
};

const getColorSaturationOptions = () => {
  const saturationTag = FujifilmTags['0x1003']; // Saturation tag
  if (!saturationTag || !saturationTag.values) return [];
  
  return Object.entries(saturationTag.values)
    .filter(([, value]) => {
      return value.match(/[+-]\d+/) || value === '0 (normal)';
    })
    .map(([key, value]) => ({
      value: key,
      label: value
    }));
};

// Parse white balance fine tune from string format "Red +2, Blue -1"
const parseWhiteBalanceFineTune = (wbFineTune: string) => {
  const match = wbFineTune.match(/Red ([+-]\d+), Blue ([+-]\d+)/);
  if (match) {
    return {
      red: match[1],
      blue: match[2]
    };
  }
  return { red: '+0', blue: '+0' };
};

export default function EditRecipeDialog({ recipe, onClose, onComplete }: EditRecipeDialogProps) {
  const wbFineTune = parseWhiteBalanceFineTune(recipe.whiteBalanceFineTune);
  
  // Parse white balance and kelvin from colorTemperature
  const isManual = recipe.colorTemperature.includes('K');
  const initialWhiteBalance = isManual ? 'Manual' : recipe.colorTemperature;
  const initialKelvin = isManual ? recipe.colorTemperature.replace('K', '') : '';

  const [formData, setFormData] = useState({
    recipeName: recipe.recipeName,
    filmSim: recipe.filmSim,
    whiteBalance: initialWhiteBalance,
    manualKelvin: initialKelvin,
    wbFineRed: wbFineTune.red,
    wbFineBlue: wbFineTune.blue,
    color: recipe.color,
    developmentDynamicRange: recipe.developmentDynamicRange,
    highlightTone: recipe.highlightTone,
    shadowTone: recipe.shadowTone,
    sharpness: recipe.sharpness,
    clarity: recipe.clarity,
    noiseReduction: recipe.noiseReduction,
    colorChromeEffect: recipe.colorChromeEffect,
    colorChromeFXBlue: recipe.colorChromeFXBlue,
    grainEffectSize: recipe.grainEffectSize,
    grainEffectRoughness: recipe.grainEffectRoughness
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createWhiteBalanceFineTune = () => {
    return `Red ${formData.wbFineRed}, Blue ${formData.wbFineBlue}`;
  };

  const createColorTemperature = () => {
    if (formData.whiteBalance === 'Manual' && formData.manualKelvin) {
      return `${formData.manualKelvin}K`;
    }
    return formData.whiteBalance;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check all required fields
    const requiredFields = [
      { field: 'recipeName', label: 'Recipe name' },
      { field: 'filmSim', label: 'Film simulation' },
      { field: 'whiteBalance', label: 'White balance' },
      { field: 'color', label: 'Color' },
      { field: 'developmentDynamicRange', label: 'Development dynamic range' },
      { field: 'highlightTone', label: 'Highlight tone' },
      { field: 'shadowTone', label: 'Shadow tone' },
      { field: 'sharpness', label: 'Sharpness' },
      { field: 'clarity', label: 'Clarity' },
      { field: 'noiseReduction', label: 'Noise reduction' },
      { field: 'colorChromeEffect', label: 'Color chrome effect' },
      { field: 'colorChromeFXBlue', label: 'Color chrome FX blue' },
      { field: 'grainEffectSize', label: 'Grain effect size' },
      { field: 'grainEffectRoughness', label: 'Grain effect roughness' }
    ];

    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof typeof formData]?.trim()) {
        toast.error(`${label} is required`);
        return;
      }
    }

    if (formData.whiteBalance === 'Manual' && !formData.manualKelvin) {
      toast.error('Kelvin value is required when using Manual white balance');
      return;
    }

    setIsLoading(true);
    
    try {
      const submitData = {
        recipeName: formData.recipeName,
        filmSim: formData.filmSim,
        colorTemperature: createColorTemperature(),
        developmentDynamicRange: formData.developmentDynamicRange,
        whiteBalanceFineTune: createWhiteBalanceFineTune(),
        noiseReduction: formData.noiseReduction,
        highlightTone: formData.highlightTone,
        shadowTone: formData.shadowTone,
        color: formData.color,
        sharpness: formData.sharpness,
        clarity: formData.clarity,
        colorChromeEffect: formData.colorChromeEffect,
        colorChromeFXBlue: formData.colorChromeFXBlue,
        grainEffectSize: formData.grainEffectSize,
        grainEffectRoughness: formData.grainEffectRoughness
      };

      await updateRecipe(recipe.id, submitData);
      toast.success('Recipe updated successfully!');
      onComplete();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to update recipe');
    } finally {
      setIsLoading(false);
    }
  };

  const filmSimOptions = getDropdownOptions('0x1401');
  const highlightToneOptions = getDropdownOptions('0x1041');
  const shadowToneOptions = getDropdownOptions('0x1040');
  const sharpnessOptions = getDropdownOptions('0x1001');
  const clarityOptions = getDropdownOptions('0x100F');
  const noiseReductionOptions = getDropdownOptions('0x100E');
  const colorChromeOptions = getDropdownOptions('0x1048');
  const colorChromeFXBlueOptions = getDropdownOptions('0x104E');
  const grainSizeOptions = getDropdownOptions('0x104C');
  const grainRoughnessOptions = getDropdownOptions('0x1047');
  const wbFineOptions = generateRangeOptions(-9, 9);
  const colorSaturationOptions = getColorSaturationOptions();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Recipe: {recipe.recipeName}</DialogTitle>
          <DialogDescription>
            Update your Fujifilm recipe settings.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] px-1">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Recipe Name Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Recipe Name</h3>
              <div className="space-y-2">
                <Label htmlFor="recipeName">
                  Recipe Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="recipeName"
                  value={formData.recipeName}
                  onChange={(e) => handleInputChange('recipeName', e.target.value)}
                  placeholder="Enter recipe name"
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Film Simulation Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Film Simulation</h3>
              <div className="space-y-2">
                <Label htmlFor="filmSim">
                  Film Simulation <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.filmSim} onValueChange={(value) => handleInputChange('filmSim', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select film simulation" />
                  </SelectTrigger>
                  <SelectContent>
                    {filmSimOptions?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Color Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Color</h3>
              <div className="space-y-8">
                {/* Top Row - White Balance, Color, and Manual Kelvin */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* White Balance */}
                  <div className="space-y-2">
                    <Label htmlFor="whiteBalance">
                      White Balance <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.whiteBalance} onValueChange={(value) => handleInputChange('whiteBalance', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" className="z-50">
                        <SelectItem value="Auto">Auto</SelectItem>
                        <SelectItem value="Auto (white priority)">White Priority</SelectItem>
                        <SelectItem value="Auto (ambiance priority)">Ambiance Priority</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Color (Saturation) */}
                  <div className="space-y-2">
                    <Label htmlFor="color">
                      Color <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color saturation" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="z-50">
                        {colorSaturationOptions?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Manual Kelvin Input */}
                  {formData.whiteBalance === 'Manual' && (
                    <div className="space-y-2">
                      <Label htmlFor="manualKelvin">
                        Kelvin Value <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="manualKelvin"
                          type="number"
                          value={formData.manualKelvin}
                          onChange={(e) => handleInputChange('manualKelvin', e.target.value)}
                          placeholder="5600"
                          className="pr-6"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                          K
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Row - White Balance Fine Tune */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* White Balance Fine Tune - Red */}
                  <div className="space-y-2">
                    <Label htmlFor="wbFineRed">
                      White Balance Fine Tune - Red <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.wbFineRed} onValueChange={(value) => handleInputChange('wbFineRed', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" className="z-50">
                        {wbFineOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* White Balance Fine Tune - Blue */}
                  <div className="space-y-2">
                    <Label htmlFor="wbFineBlue">
                      White Balance Fine Tune - Blue <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.wbFineBlue} onValueChange={(value) => handleInputChange('wbFineBlue', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" className="z-50">
                        {wbFineOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Light Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Light</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="developmentDynamicRange">
                    Development Dynamic Range <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.developmentDynamicRange} onValueChange={(value) => handleInputChange('developmentDynamicRange', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Auto">Auto</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="200">200</SelectItem>
                      <SelectItem value="400">400</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="highlightTone">
                    Highlight Tone <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.highlightTone} onValueChange={(value) => handleInputChange('highlightTone', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select highlight tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {highlightToneOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shadowTone">
                    Shadow Tone <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.shadowTone} onValueChange={(value) => handleInputChange('shadowTone', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shadow tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {shadowToneOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Effects Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Effects</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="sharpness">
                    Sharpness <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.sharpness} onValueChange={(value) => handleInputChange('sharpness', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sharpness" />
                    </SelectTrigger>
                    <SelectContent>
                      {sharpnessOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clarity">
                    Clarity <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.clarity} onValueChange={(value) => handleInputChange('clarity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select clarity" />
                    </SelectTrigger>
                    <SelectContent>
                      {clarityOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noiseReduction">
                    Noise Reduction <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.noiseReduction} onValueChange={(value) => handleInputChange('noiseReduction', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select noise reduction" />
                    </SelectTrigger>
                    <SelectContent>
                      {noiseReductionOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colorChromeEffect">
                    Color Chrome Effect <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.colorChromeEffect} onValueChange={(value) => handleInputChange('colorChromeEffect', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color chrome effect" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorChromeOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colorChromeFXBlue">
                    Color Chrome FX Blue <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.colorChromeFXBlue} onValueChange={(value) => handleInputChange('colorChromeFXBlue', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color chrome FX blue" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorChromeFXBlueOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grainEffectSize">
                    Grain Effect Size <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.grainEffectSize} onValueChange={(value) => handleInputChange('grainEffectSize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grain effect size" />
                    </SelectTrigger>
                    <SelectContent>
                      {grainSizeOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grainEffectRoughness">
                    Grain Effect Roughness <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.grainEffectRoughness} onValueChange={(value) => handleInputChange('grainEffectRoughness', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grain effect roughness" />
                    </SelectTrigger>
                    <SelectContent>
                      {grainRoughnessOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? 'Updating Recipe...' : 'Update Recipe'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}