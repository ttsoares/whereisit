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
}
