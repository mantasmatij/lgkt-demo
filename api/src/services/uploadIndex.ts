import type { StoredFile } from './storage';

const index = new Map<string, StoredFile>();

export function rememberUpload(file: StoredFile) {
  index.set(file.uploadId, file);
}

export function getUpload(uploadId: string): StoredFile | undefined {
  return index.get(uploadId);
}

export function deleteUpload(uploadId: string) {
  index.delete(uploadId);
}

export function clearAllUploads() {
  index.clear();
}
