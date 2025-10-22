import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type StoredFile = {
  uploadId: string;
  storageKey: string;
  fileName: string;
  fileSize: number;
  contentType: string;
};

export interface StorageAdapter {
  saveTemp(file: Buffer, fileName: string, contentType: string): Promise<StoredFile>;
  deleteTemp(storageKey: string): Promise<void>;
}

export class LocalStorageAdapter implements StorageAdapter {
  constructor(private baseDir = process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads')) {}

  private ensureBase() {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async saveTemp(file: Buffer, fileName: string, contentType: string): Promise<StoredFile> {
    this.ensureBase();
    const uploadId = crypto.randomUUID();
    const storageKey = path.join(this.baseDir, `${uploadId}-${fileName}`);
    await fs.promises.writeFile(storageKey, file);
    const stat = await fs.promises.stat(storageKey);
    return {
      uploadId,
      storageKey,
      fileName,
      fileSize: stat.size,
      contentType,
    };
  }

  async deleteTemp(storageKey: string): Promise<void> {
    try {
      await fs.promises.unlink(storageKey);
    } catch (err) {
      const e = err as NodeJS.ErrnoException;
      if (e.code !== 'ENOENT') throw e;
    }
  }
}

export function getStorageAdapter(): StorageAdapter {
  // TODO: switch to object storage in production via env
  return new LocalStorageAdapter();
}

export const UploadConstraints = {
  maxFileSizeBytes: parseInt(process.env.UPLOAD_MAX_SIZE_BYTES || `${10 * 1024 * 1024}`, 10),
  allowedTypes: (process.env.UPLOAD_ALLOWED_TYPES || 'application/pdf,image/png,image/jpeg').split(','),
  maxFilesPerSubmission: parseInt(process.env.UPLOAD_MAX_FILES || '5', 10),
};
