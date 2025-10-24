import { Router } from 'express';
import multer from 'multer';
import { getStorageAdapter, UploadConstraints } from '../services/storage';
import { rememberUpload, getUpload, deleteUpload } from '../services/uploadIndex';

type HttpError = Error & { statusCode?: number };

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: UploadConstraints.maxFileSizeBytes },
  fileFilter: (_req, file, cb) => {
    if (UploadConstraints.allowedTypes.includes(file.mimetype)) return cb(null, true);
    const err: HttpError = new Error('Unsupported media type');
    err.statusCode = 415;
    return cb(err);
  },
});


export const uploadsRouter = Router();

uploadsRouter.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ code: 'NO_FILE', message: 'No file provided under field "file"' });
    }
    const storage = getStorageAdapter();
  const saved = await storage.saveTemp(file.buffer, file.originalname, file.mimetype);
  rememberUpload(saved);
    res.status(201).json({
      uploadId: saved.uploadId,
      fileName: saved.fileName,
      contentType: saved.contentType,
      fileSize: saved.fileSize,
      storageKey: saved.storageKey,
    });
  } catch (err) {
    return next(err);
  }
});

uploadsRouter.delete('/:uploadId', async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    const saved = getUpload(uploadId);
    if (!saved) {
      return res.status(404).json({ code: 'NOT_FOUND', message: 'Upload not found' });
    }
    const storage = getStorageAdapter();
    await storage.deleteTemp(saved.storageKey);
    deleteUpload(uploadId);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
});
