"use client";
import * as React from 'react';
import { Button, Card, Input } from '@nextui-org/react';

export type AttachmentLink = { type: 'LINK'; url: string };
export type AttachmentFileRef = { type: 'FILE'; uploadId: string; fileName?: string };
export type AttachmentRef = AttachmentLink | AttachmentFileRef;

async function uploadFile(file: File): Promise<{ uploadId: string; fileName: string }> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/uploads', { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return { uploadId: data.uploadId, fileName: data.fileName };
}

async function deleteUpload(uploadId: string) {
  await fetch(`/api/uploads/${encodeURIComponent(uploadId)}`, { method: 'DELETE' });
}

export function AttachmentsSection({ value, onChange }: { value: AttachmentRef[]; onChange: (rows: AttachmentRef[]) => void }) {
  const [link, setLink] = React.useState('');
  const [busy, setBusy] = React.useState(false);

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

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const up = await uploadFile(file);
      onChange([...(value || []), { type: 'FILE', uploadId: up.uploadId, fileName: up.fileName }]);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-lg font-medium">Attachments</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
        <Input label="Attachment link (URL)" value={link} onChange={(e) => setLink(e.target.value)} />
        <Button onPress={addLink} disabled={!link} color="primary">Add link</Button>
        <Input type="file" onChange={onPickFile} disabled={busy} />
      </div>
      <ul className="list-disc pl-5 space-y-1">
        {value.map((a, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <span className="text-sm">
              {a.type === 'LINK' ? `Link: ${a.url}` : `File: ${a.fileName || a.uploadId}`}
            </span>
            <Button size="sm" color="danger" variant="flat" onPress={() => remove(idx)}>Remove</Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
