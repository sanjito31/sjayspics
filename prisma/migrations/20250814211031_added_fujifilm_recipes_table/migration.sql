-- CreateTable
CREATE TABLE "FujifilmRecipes" (
    "id" TEXT NOT NULL,
    "recipeName" TEXT NOT NULL,
    "filmSim" TEXT NOT NULL,
    "colorTemperature" TEXT NOT NULL DEFAULT 'auto',
    "developmentDynamicRange" TEXT NOT NULL,
    "whiteBalanceFineTune" TEXT NOT NULL,
    "noiseReduction" TEXT NOT NULL,
    "highlightTone" TEXT NOT NULL,
    "shadowTone" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "sharpness" TEXT NOT NULL,
    "clarity" TEXT NOT NULL,
    "colorChromeEffect" TEXT NOT NULL,
    "colorChromeFXBlue" TEXT NOT NULL,
    "grainEffectSize" TEXT NOT NULL,
    "grainEffectRoughness" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FujifilmRecipes_pkey" PRIMARY KEY ("id")
);
