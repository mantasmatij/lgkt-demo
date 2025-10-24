"use client";
import * as React from 'react';
import { Button, Input, Select, SelectItem, Card } from '@heroui/react';

export type OrganRow = {
  organType: 'VALDYBA' | 'STEBETOJU_TARYBA';
  lastElectionDate?: string;
  plannedElectionDate?: string;
};

export function OrgansSection({ value, onChange }: { value: OrganRow[]; onChange: (rows: OrganRow[]) => void }) {
  const addRow = () => onChange([...value, { organType: 'VALDYBA' }]);
  const removeRow = (idx: number) => onChange(value.filter((_, i) => i !== idx));
  const update = (idx: number, patch: Partial<OrganRow>) => {
    const next = [...value];
    next[idx] = { ...next[idx], ...patch } as OrganRow;
    onChange(next);
  };
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Governance Organs</h3>
        <Button size="sm" onPress={addRow} color="primary">Add organ</Button>
      </div>
      {value.length === 0 && <p className="text-sm text-default-500">No organs added.</p>}
      {value.map((row, idx) => (
        <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <Select
            label="Organ type"
            selectedKeys={[row.organType]}
            onChange={(e) => update(idx, { organType: (e.target.value as OrganRow['organType']) })}
          >
            <SelectItem key="VALDYBA">Valdyba</SelectItem>
            <SelectItem key="STEBETOJU_TARYBA">Stebėtojų taryba</SelectItem>
          </Select>
          <Input type="date" label="Last election date" value={row.lastElectionDate ?? ''} onChange={(e) => update(idx, { lastElectionDate: e.target.value || undefined })} />
          <Input type="date" label="Planned election date" value={row.plannedElectionDate ?? ''} onChange={(e) => update(idx, { plannedElectionDate: e.target.value || undefined })} />
          <div className="flex justify-end">
            <Button size="sm" color="danger" variant="flat" onPress={() => removeRow(idx)}>Remove</Button>
          </div>
        </div>
      ))}
    </Card>
  );
}
