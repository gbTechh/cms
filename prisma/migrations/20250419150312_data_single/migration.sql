-- CreateTable
CREATE TABLE "DataSingle" (
    "id" SERIAL NOT NULL,
    "collectionId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "DataSingle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DataSingle_collectionId_key" ON "DataSingle"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "DataSingle_slug_key" ON "DataSingle"("slug");

-- AddForeignKey
ALTER TABLE "DataSingle" ADD CONSTRAINT "DataSingle_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
