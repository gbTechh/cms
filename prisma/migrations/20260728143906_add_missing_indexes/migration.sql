-- CreateIndex
CREATE INDEX "Entry_collectionId_idx" ON "Entry"("collectionId");

-- CreateIndex
CREATE INDEX "FormSubmission_formId_idx" ON "FormSubmission"("formId");

-- CreateIndex
CREATE INDEX "Relationship_fromEntryId_idx" ON "Relationship"("fromEntryId");

-- CreateIndex
CREATE INDEX "Relationship_toEntryId_idx" ON "Relationship"("toEntryId");
