-- CreateEnum
CREATE TYPE "OrderUnit" AS ENUM ('EACH', 'INNER_PACK', 'MASTER_CARTON', 'PALLET');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "batchCodeFormat" TEXT,
ADD COLUMN     "certifications" TEXT[],
ADD COLUMN     "countryOfOrigin" TEXT DEFAULT 'India',
ADD COLUMN     "fssaiLicense" TEXT,
ADD COLUMN     "handlingInstructions" TEXT,
ADD COLUMN     "ingredients" TEXT,
ADD COLUMN     "innerPackDimensions" TEXT,
ADD COLUMN     "innerPackWeight" DECIMAL(10,2),
ADD COLUMN     "innerPacksPerMasterCarton" INTEGER,
ADD COLUMN     "manufacturingLocation" TEXT,
ADD COLUMN     "masterCartonDimensions" TEXT,
ADD COLUMN     "masterCartonWeight" DECIMAL(10,2),
ADD COLUMN     "masterCartonsPerPallet" INTEGER,
ADD COLUMN     "minimumOrderQuantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "orderUnitType" "OrderUnit" NOT NULL DEFAULT 'EACH',
ADD COLUMN     "palletDimensions" TEXT,
ADD COLUMN     "palletWeight" DECIMAL(10,2),
ADD COLUMN     "requiresRefrigeration" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shelfLife" TEXT,
ADD COLUMN     "stackingLimit" INTEGER DEFAULT 5,
ADD COLUMN     "storageTemperature" TEXT,
ADD COLUMN     "unitDimensions" TEXT,
ADD COLUMN     "unitWeight" DECIMAL(10,2),
ADD COLUMN     "unitsPerInnerPack" INTEGER;

-- AlterTable
ALTER TABLE "tiered_pricing" ADD COLUMN     "description" TEXT,
ADD COLUMN     "unitType" "OrderUnit" NOT NULL DEFAULT 'EACH';
