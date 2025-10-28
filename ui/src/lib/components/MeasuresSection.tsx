"use client";
import * as React from 'react';
import { Card } from '@heroui/react';
import { cn } from '../utils/cn';
import { InputField } from './fields/InputField';
import { TextareaField } from './fields/TextareaField';
import { iconButtonClass } from './fields/buttonStyles';

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
          <button type="button" aria-label="Add measure" className={iconButtonClass} onClick={addRow}>+</button>
        </div>
        {value.length === 0 && <p className="text-sm text-default-500">No measures added.</p>}
        {value.map((row, idx) => (
          <Card key={idx} className={cn("p-4")}> 
            <div className="flex flex-col gap-3">
              {/* Measure name as large input block */}
              <TextareaField
                id={`measure.${idx}.name`}
                name={`measure.${idx}.name`}
                label="Measure name"
                value={row.name}
                onChange={(e: unknown) => update(idx, { name: (e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>).target.value })}
                disableAutosize
                minRows={3}
                classNames={{ inputWrapper: "min-h-28 rounded-2xl border-2 border-black px-4 py-3" }}
              />

              {/* Planned result block */}
              <TextareaField
                id={`measure.${idx}.plannedResult`}
                name={`measure.${idx}.plannedResult`}
                label="Planned result"
                value={row.plannedResult ?? ''}
                onChange={(e: unknown) => update(idx, { plannedResult: (e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>).target.value || undefined })}
                disableAutosize
                minRows={3}
                classNames={{ inputWrapper: "min-h-28 rounded-2xl border-2 border-black px-4 py-3" }}
              />

              {/* Indicator rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField
                  id={`measure.${idx}.indicator`}
                  name={`measure.${idx}.indicator`}
                  label="Planned indicator"
                  value={row.indicator ?? ''}
                  onChange={(e) => update(idx, { indicator: e.target.value || undefined })}
                />
                <InputField
                  id={`measure.${idx}.indicatorValue`}
                  name={`measure.${idx}.indicatorValue`}
                  label="Indicator value"
                  value={row.indicatorValue ?? ''}
                  onChange={(e) => update(idx, { indicatorValue: e.target.value || undefined })}
                />
                <InputField
                  id={`measure.${idx}.indicatorUnit`}
                  name={`measure.${idx}.indicatorUnit`}
                  label="Indicator unit"
                  value={row.indicatorUnit ?? ''}
                  onChange={(e) => update(idx, { indicatorUnit: e.target.value || undefined })}
                />
                <InputField
                  id={`measure.${idx}.year`}
                  name={`measure.${idx}.year`}
                  label="Year"
                  value={row.year ?? ''}
                  onChange={(e) => update(idx, { year: e.target.value || undefined })}
                />
              </div>

              <div className="flex justify-end">
                <button type="button" aria-label="Remove measure" className={iconButtonClass} onClick={() => removeRow(idx)}>
                  −
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
