-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "fileSize" DOUBLE PRECISION NOT NULL,
    "mimeType" TEXT NOT NULL,
    "publicID" TEXT NOT NULL,
    "assetID" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secureURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "caption" TEXT,
    "tags" TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "filmPhoto" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "location" TEXT,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExifData" (
    "photoID" TEXT NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "lens" TEXT,
    "shutterSpeed" TEXT,
    "aperture" DOUBLE PRECISION,
    "iso" INTEGER,
    "focalLength" DOUBLE PRECISION,
    "exposureComp" DOUBLE PRECISION,
    "dateTaken" TIMESTAMP(3),
    "orientation" INTEGER,
    "flash" TEXT,
    "whiteBalance" TEXT,
    "meteringMode" TEXT,
    "exposureMode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExifData_pkey" PRIMARY KEY ("photoID")
);

-- CreateTable
CREATE TABLE "FujifilmData" (
    "photoID" TEXT NOT NULL,
    "filmMode" TEXT,
    "grainEffectRoughness" TEXT,
    "grainEffectSize" TEXT,
    "colorChromeEffect" TEXT,
    "colorChromeFXBlue" TEXT,
    "whiteBalance" TEXT,
    "whiteBalanceFineTune" TEXT,
    "dynamicRangeSetting" TEXT,
    "highlightTone" TEXT,
    "shadowTone" TEXT,
    "color" TEXT,
    "sharpness" TEXT,
    "noiseReduction" TEXT,
    "clarity" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FujifilmData_pkey" PRIMARY KEY ("photoID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Photo_publicID_key" ON "Photo"("publicID");

-- CreateIndex
CREATE UNIQUE INDEX "Photo_assetID_key" ON "Photo"("assetID");

-- CreateIndex
CREATE INDEX "Photo_createdAt_idx" ON "Photo"("createdAt");

-- CreateIndex
CREATE INDEX "Photo_isPublic_idx" ON "Photo"("isPublic");

-- AddForeignKey
ALTER TABLE "ExifData" ADD CONSTRAINT "ExifData_photoID_fkey" FOREIGN KEY ("photoID") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FujifilmData" ADD CONSTRAINT "FujifilmData_photoID_fkey" FOREIGN KEY ("photoID") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
