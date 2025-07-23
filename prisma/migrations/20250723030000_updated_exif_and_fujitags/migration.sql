-- AlterTable
ALTER TABLE "ExifData" ALTER COLUMN "orientation" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "FujifilmData" ADD COLUMN     "colorTemperature" TEXT,
ADD COLUMN     "developmentDynamicRange" TEXT;
