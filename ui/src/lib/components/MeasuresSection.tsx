"use client";
import * as React from 'react';
import { Button, Card, Input, Textarea } from '@heroui/react';
import { cn } from '../utils/cn';

export type MeasureRow = {
  name: string;
  plannedResult?: string;
  indicator?: string;
  indicatorValue?: string;
  indicatorUnit?: string;
  year?: string;
};

export function MeasuresSection({ value, onChange }: { value: MeasureRow[]; onChange: (rows: MeasureRow[]) => void }) {
  const addRow = () => onChange([...value, { name: '' }]);
  const removeRow = (idx: number) => onChange(value.filter((_, i) => i !== idx));
  const update = (idx: number, patch: Partial<MeasureRow>) => {
    const next = [...value];
    next[idx] = { ...next[idx], ...patch } as MeasureRow;
    onChange(next);
  };
  return (
    <Card className={cn("p-6")}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Measures</h3>
          <Button size="sm" onPress={addRow} color="primary">Add measure</Button>
        </div>
        {value.length === 0 && <p className="text-sm text-default-500">No measures added.</p>}
        {value.map((row, idx) => (
          <Card key={idx} className={cn("p-4")}>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input variant="bordered" label="Name" value={row.name} onChange={(e) => update(idx, { name: e.target.value })} />
            <Input variant="bordered" label="Year" value={row.year ?? ''} onChange={(e) => update(idx, { year: e.target.value || undefined })} />
            <Input variant="bordered" label="Indicator" value={row.indicator ?? ''} onChange={(e) => update(idx, { indicator: e.target.value || undefined })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input variant="bordered" label="Indicator value" value={row.indicatorValue ?? ''} onChange={(e) => update(idx, { indicatorValue: e.target.value || undefined })} />
            <Input variant="bordered" label="Indicator unit" value={row.indicatorUnit ?? ''} onChange={(e) => update(idx, { indicatorUnit: e.target.value || undefined })} />
            <div className="flex justify-end">
              <Button size="sm" color="danger" variant="flat" onPress={() => removeRow(idx)}>Remove</Button>
            </div>
          </div>
          <Textarea variant="bordered" label="Planned result" value={row.plannedResult ?? ''} onChange={(e) => update(idx, { plannedResult: e.target.value || undefined })} />
            </div>
        </Card>
        ))}
      </div>
    </Card>
  );
}
