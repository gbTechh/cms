export interface IMedia {
  id: string;
  url: string;
  altText: string | null;
  mimeType: string;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export interface IMediaCreate {
  url: string;
  altText?: string;
  mimeType: string;
  fileSize?: number;
}

export interface IMediaError {
  url?: string;
  file?: string;
}
