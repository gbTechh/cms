-- CreateEnum
CREATE TYPE "CollectionType" AS ENUM ('collection', 'global', 'page');

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "type" "CollectionType" NOT NULL DEFAULT 'collection';
