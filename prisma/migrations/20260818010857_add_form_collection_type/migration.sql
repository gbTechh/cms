/*
  Warnings:

  - You are about to drop the column `formId` on the `FormSubmission` table. All the data in the column will be lost.
  - Added the required column `collectionId` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "CollectionType" ADD VALUE 'form';

-- DropIndex
DROP INDEX "FormSubmission_formId_idx";

-- AlterTable
ALTER TABLE "FormSubmission" DROP COLUMN "formId",
ADD COLUMN     "collectionId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "FormSubmission_collectionId_idx" ON "FormSubmission"("collectionId");

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
