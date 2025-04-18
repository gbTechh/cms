/*
  Warnings:

  - A unique constraint covering the columns `[fileName]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - Made the column `fileName` on table `Collection` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Collection" ALTER COLUMN "fileName" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Collection_fileName_key" ON "Collection"("fileName");
