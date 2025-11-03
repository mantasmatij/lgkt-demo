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

type MeasuresLabels = {
  title?: string;
  no_measures?: string;
  name?: string;
  planned_result?: string;
  planned_indicator?: string;
  indicator_value?: string;
  indicator_unit?: string;
  year?: string;
  add?: string; // aria-label
  remove?: string; // aria-label
};

export function MeasuresSection({ value, onChange, labels, topSlot }: { value: MeasureRow[]; onChange: (rows: MeasureRow[]) => void; labels?: MeasuresLabels; topSlot?: React.ReactNode }) {
  const addRow = () => onChange([...value, { name: '' }]);
  const removeRow = (idx: number) => onChange(value.filter((_, i) => i !== idx));
  const update = (idx: number, patch: Partial<MeasureRow>) => {
    const next = [...value];
    next[idx] = { ...next[idx], ...patch } as MeasureRow;
    onChange(next);
  };
  const L: Required<MeasuresLabels> = {
    title: labels?.title ?? 'Measures',
    no_measures: labels?.no_measures ?? 'No measures added.',
    name: labels?.name ?? 'Measure name',
    planned_result: labels?.planned_result ?? 'Planned result',
    planned_indicator: labels?.planned_indicator ?? 'Planned indicator',
    indicator_value: labels?.indicator_value ?? 'Indicator value',
    indicator_unit: labels?.indicator_unit ?? 'Indicator unit',
    year: labels?.year ?? 'Year',
    add: labels?.add ?? 'Add measure',
    remove: labels?.remove ?? 'Remove measure',
  };
  return (
    <Card className={cn("p-6")}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">{L.title}</h3>
          <button type="button" aria-label={L.add} className={iconButtonClass} onClick={addRow}>+</button>
        </div>
        {topSlot}
        {value.length === 0 && <p className="text-sm text-default-500">{L.no_measures}</p>}
        {value.map((row, idx) => (
          <Card key={idx} className={cn("p-4")}> 
            <div className="flex flex-col gap-3">
              {/* Measure name as large input block */}
              <TextareaField
                id={`measure.${idx}.name`}
                name={`measure.${idx}.name`}
                label={L.name}
                value={row.name}
                onChange={(e: unknown) => update(idx, { name: (e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>).target.value })}
                disableAutosize
                minRows={10}
                classNames={{ inputWrapper: "rounded-2xl border-2 border-black px-4 py-3", input: "resize-none overflow-y-auto" }}
              />

              {/* Planned result block */}
              <TextareaField
                id={`measure.${idx}.plannedResult`}
                name={`measure.${idx}.plannedResult`}
                label={L.planned_result}
                value={row.plannedResult ?? ''}
                onChange={(e: unknown) => update(idx, { plannedResult: (e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>).target.value || undefined })}
                disableAutosize
                minRows={10}
                classNames={{ inputWrapper: "rounded-2xl border-2 border-black px-4 py-3", input: "resize-none overflow-y-auto" }}
              />

              {/* Indicator rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField
                  id={`measure.${idx}.indicator`}
                  name={`measure.${idx}.indicator`}
                  label={L.planned_indicator}
                  value={row.indicator ?? ''}
                  onChange={(e) => update(idx, { indicator: e.target.value || undefined })}
                />
                <InputField
                  id={`measure.${idx}.indicatorValue`}
                  name={`measure.${idx}.indicatorValue`}
                  label={L.indicator_value}
                  value={row.indicatorValue ?? ''}
                  onChange={(e) => update(idx, { indicatorValue: e.target.value || undefined })}
                />
                <InputField
                  id={`measure.${idx}.indicatorUnit`}
                  name={`measure.${idx}.indicatorUnit`}
                  label={L.indicator_unit}
                  value={row.indicatorUnit ?? ''}
                  onChange={(e) => update(idx, { indicatorUnit: e.target.value || undefined })}
                />
                <InputField
                  id={`measure.${idx}.year`}
                  name={`measure.${idx}.year`}
                  label={L.year}
                  value={row.year ?? ''}
                  onChange={(e) => update(idx, { year: e.target.value || undefined })}
                />
              </div>

              <div className="flex justify-end">
                <button type="button" aria-label={L.remove} className={iconButtonClass} onClick={() => removeRow(idx)}>
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
