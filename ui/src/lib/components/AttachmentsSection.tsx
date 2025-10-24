"use client";
import * as React from 'react';
import { Button, Card, Input, Progress } from '@heroui/react';

export type AttachmentLink = { type: 'LINK'; url: string };
export type AttachmentFileRef = { type: 'FILE'; uploadId: string; fileName?: string };
export type AttachmentRef = AttachmentLink | AttachmentFileRef;

type UploadProgress = {
  fileName: string;
  progress: number;
  error?: string;
};

async function uploadFile(file: File): Promise<{ uploadId: string; fileName: string }> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/uploads', { method: 'POST', body: fd });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Upload failed');
  }
  const data = await res.json();
  return { uploadId: data.uploadId, fileName: data.fileName };
}

async function deleteUpload(uploadId: string) {
  await fetch(`/api/uploads/${encodeURIComponent(uploadId)}`, { method: 'DELETE' });
}

export function AttachmentsSection({ value, onChange }: { value: AttachmentRef[]; onChange: (rows: AttachmentRef[]) => void }) {
  const [link, setLink] = React.useState('');
  const [uploads, setUploads] = React.useState<Record<string, UploadProgress>>({});
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const addLink = () => {
    if (!link) return;
    onChange([...(value || []), { type: 'LINK', url: link }]);
    setLink('');
  };

  const remove = async (idx: number) => {
    const item = value[idx];
    if (item && item.type === 'FILE') {
      try { await deleteUpload(item.uploadId); } catch { /* noop */ }
    }
    onChange(value.filter((_, i) => i !== idx));
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      const uploadKey = `${Date.now()}-${file.name}`;
      
      // Initialize progress
      setUploads(prev => ({
        ...prev,
        [uploadKey]: { fileName: file.name, progress: 0 }
      }));

      try {
        // Simulate progress (real progress tracking would require XMLHttpRequest)
        setUploads(prev => ({
          ...prev,
          [uploadKey]: { ...prev[uploadKey], progress: 50 }
        }));

        const up = await uploadFile(file);
        
        // Complete progress
        setUploads(prev => ({
          ...prev,
          [uploadKey]: { ...prev[uploadKey], progress: 100 }
        }));

        onChange([...(value || []), { type: 'FILE', uploadId: up.uploadId, fileName: up.fileName }]);

        // Remove from progress tracker after a brief delay
        setTimeout(() => {
          setUploads(prev => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [uploadKey]: _removed, ...rest } = prev;
            return rest;
          });
        }, 1000);
      } catch (error) {
        setUploads(prev => ({
          ...prev,
          [uploadKey]: { 
            ...prev[uploadKey], 
            progress: 0, 
            error: error instanceof Error ? error.message : 'Upload failed'
          }
        }));
      }
    }
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const hasActiveUploads = Object.keys(uploads).length > 0;

  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-lg font-medium">Attachments</h3>
      
      {/* Drag and drop zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onPickFile}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-gray-500">Multiple files supported</p>
          </div>
        </label>
      </div>

      {/* Upload progress */}
      {Object.entries(uploads).map(([key, upload]) => (
        <div key={key} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="truncate flex-1">{upload.fileName}</span>
            {upload.error ? (
              <span className="text-danger text-xs ml-2">{upload.error}</span>
            ) : (
              <span className="text-xs text-gray-500 ml-2">{upload.progress}%</span>
            )}
          </div>
          <Progress
            value={upload.progress}
            color={upload.error ? 'danger' : 'primary'}
            size="sm"
          />
        </div>
      ))}

      {/* Link input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end pt-2 border-t">
        <Input 
          label="Attachment link (URL)" 
          value={link} 
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://example.com/document.pdf"
        />
        <Button onPress={addLink} disabled={!link} color="primary">Add link</Button>
      </div>

      {/* Uploaded files and links list */}
      {value.length > 0 && (
        <ul className="list-disc pl-5 space-y-2 pt-2 border-t">
          {value.map((a, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <span className="text-sm truncate flex-1">
                {a.type === 'LINK' ? (
                  <>
                    <span className="font-medium">Link:</span> {a.url}
                  </>
                ) : (
                  <>
                    <span className="font-medium">File:</span> {a.fileName || a.uploadId}
                  </>
                )}
              </span>
              <Button 
                size="sm" 
                color="danger" 
                variant="flat" 
                onPress={() => remove(idx)}
                isDisabled={hasActiveUploads}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
