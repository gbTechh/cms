import { CollectionType } from "./collection";

// Formato del JSON de "plantilla": snapshot completo de collections + su
// data (entries / DataSingle) + relaciones + metadata de media, pensado
// para migrar entre entornos (dev → prod, restaurar un backup, arrancar un
// proyecto nuevo a partir de otro). Los binarios de /public/uploads NO viajan
// acá — solo los registros de Media (url, mimeType, etc).
export interface TemplateExportEntry {
  id: string;
  data: Record<string, any>;
  createdAt: string;
}

export interface TemplateExportDataSingle {
  slug: string;
  data: Record<string, any>;
}

export interface TemplateExportCollection {
  slug: string;
  name: string;
  type: CollectionType;
  fileName: string;
  isMedia: boolean;
  template: string | null;
  fields: any[];
  entries: TemplateExportEntry[];
  dataSingle: TemplateExportDataSingle | null;
}

export interface TemplateExportRelationship {
  fromEntryId: string;
  toEntryId: string;
  type: string;
}

export interface TemplateExportMedia {
  url: string;
  altText: string | null;
  mimeType: string;
  fileSize: number | null;
  width: number | null;
  height: number | null;
}

export interface TemplateExport {
  version: 1;
  exportedAt: string;
  collections: TemplateExportCollection[];
  relationships: TemplateExportRelationship[];
  media: TemplateExportMedia[];
}

export interface TemplateImportSummary {
  collections: number;
  entries: number;
  relationships: number;
  media: number;
  warnings: string[];
}
