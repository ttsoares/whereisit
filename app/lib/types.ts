export interface DirectoryItem {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number; // Size in bytes, only for files
  contents?: DirectoryItem[];
}

export interface DVDDoc {
  name: string;
  contents: DirectoryItem[];
  date: Date;
  comment: string;
  // Derived from `contents` at save time, so search and Totals run inside Mongo
  files?: FlatFile[];
  fileCount?: number;
  totalSize?: number;
}

export interface FlatFile {
  name: string;
  path: string;
  size: number;
}
