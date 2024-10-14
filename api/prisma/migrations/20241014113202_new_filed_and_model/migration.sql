/*
  Warnings:

  - You are about to drop the column `addedMoney` on the `SaleTemp` table. All the data in the column will be lost.
  - You are about to drop the column `foodSizeId` on the `SaleTemp` table. All the data in the column will be lost.
  - You are about to drop the column `tasteId` on the `SaleTemp` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SaleTemp" DROP CONSTRAINT "SaleTemp_foodSizeId_fkey";

-- DropForeignKey
ALTER TABLE "SaleTemp" DROP CONSTRAINT "SaleTemp_tasteId_fkey";

-- AlterTable
ALTER TABLE "SaleTemp" DROP COLUMN "addedMoney",
DROP COLUMN "foodSizeId",
DROP COLUMN "tasteId";

-- CreateTable
CREATE TABLE "SaleTempDetail" (
    "id" SERIAL NOT NULL,
    "saleTempId" INTEGER NOT NULL,
    "addedMoney" INTEGER,
    "tasteId" INTEGER,
    "foodSizeId" INTEGER,

    CONSTRAINT "SaleTempDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SaleTempDetail" ADD CONSTRAINT "SaleTempDetail_saleTempId_fkey" FOREIGN KEY ("saleTempId") REFERENCES "SaleTemp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTempDetail" ADD CONSTRAINT "SaleTempDetail_tasteId_fkey" FOREIGN KEY ("tasteId") REFERENCES "Taste"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTempDetail" ADD CONSTRAINT "SaleTempDetail_foodSizeId_fkey" FOREIGN KEY ("foodSizeId") REFERENCES "FoodSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;
