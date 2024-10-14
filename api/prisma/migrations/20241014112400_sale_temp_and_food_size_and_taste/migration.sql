-- AlterTable
ALTER TABLE "SaleTemp" ADD COLUMN     "addedMoney" INTEGER,
ADD COLUMN     "foodSizeId" INTEGER,
ADD COLUMN     "tasteId" INTEGER;

-- AddForeignKey
ALTER TABLE "SaleTemp" ADD CONSTRAINT "SaleTemp_tasteId_fkey" FOREIGN KEY ("tasteId") REFERENCES "Taste"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTemp" ADD CONSTRAINT "SaleTemp_foodSizeId_fkey" FOREIGN KEY ("foodSizeId") REFERENCES "FoodSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;
