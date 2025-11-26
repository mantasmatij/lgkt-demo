"use client";
import * as React from 'react';
import { Card } from '@heroui/react';
import { cn } from '../utils/cn';
import { InputField } from './fields/InputField';
import { TextareaField } from './fields/TextareaField';
import { iconButtonClass } from './fields/buttonStyles';

export type MeasureRow = {
  name: string;
  plannedResult: string;
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

export function MeasuresSection({ value, onChange, labels, topSlot, errors = {} }: { value: MeasureRow[]; onChange: (rows: MeasureRow[]) => void; labels?: MeasuresLabels; topSlot?: React.ReactNode; errors?: Record<string, string[]> }) {
  // Ensure at least one row is visible at all times
  React.useEffect(() => {
    if (value.length === 0) {
      onChange([{ name: '', plannedResult: '' }]);
    }
  }, []);
  const addRow = () => onChange([...value, { name: '', plannedResult: '' }]);
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
  const firstError = (key: string): string | undefined => {
    if (errors[key]?.[0]) return errors[key][0];
    const bracketKey = key.replace(/\.(\d+)\./g, '[$1].');
    if (errors[bracketKey]?.[0]) return errors[bracketKey][0];
    const entry = Object.entries(errors).find(([k, v]) =>
      Boolean(v?.length) && (k === key || k === bracketKey)
    );
    return entry?.[1]?.[0];
  };
  return (
    <Card className={cn("p-6")}>
      <div className="flex flex-col gap-3">
        <div className="mb-2">
          <h3 className="text-lg font-bold">{L.title}</h3>
        </div>
        {topSlot}
        {value.length === 0 && <p className="text-sm text-default-500">{L.no_measures}</p>}
        {value.length === 0 && (
          <div className="flex justify-start">
            <button type="button" aria-label={L.add} className={iconButtonClass} onClick={addRow}>+</button>
          </div>
        )}
        {value.map((row, idx) => (
          <Card key={idx} className={cn("p-4")}> 
            <div className="flex flex-col gap-3">
              {/* Measure name as large input block */}
              <TextareaField
                id={`measures.${idx}.name`}
                name={`measures.${idx}.name`}
                label={L.name}
                isRequired
                isInvalid={!!firstError(`measures.${idx}.name`)}
                errorMessage={firstError(`measures.${idx}.name`)}
                value={row.name}
                onChange={(e: unknown) => update(idx, { name: (e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>).target.value })}
                // Force visual space for ~10 lines; leading-6 = 1.5rem → 15rem + vertical padding ≈ 17rem
                minRows={10}
                maxRows={10}
                disableAutosize
                classNames={{ inputWrapper: "rounded-2xl border-2 border-black px-4 py-3 h-[17rem]", input: "h-full min-h-0 resize-none overflow-y-auto" }}
              />

              {/* Planned result block */}
              <TextareaField
                id={`measures.${idx}.plannedResult`}
                name={`measures.${idx}.plannedResult`}
                label={L.planned_result}
                isRequired
                isInvalid={!!firstError(`measures.${idx}.plannedResult`)}
                errorMessage={firstError(`measures.${idx}.plannedResult`)}
                value={row.plannedResult ?? ''}
                onChange={(e: unknown) => update(idx, { plannedResult: (e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>).target.value || undefined })}
                minRows={10}
                maxRows={10}
                disableAutosize
                classNames={{ inputWrapper: "rounded-2xl border-2 border-black px-4 py-3 h-[17rem]", input: "h-full min-h-0 resize-none overflow-y-auto" }}
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

              <div className="flex justify-between items-center">
                {idx === value.length - 1 ? (
                  <button type="button" aria-label={L.add} className={iconButtonClass} onClick={addRow}>+</button>
                ) : (
                  <div />
                )}
                {value.length > 1 && (
                  <button type="button" aria-label={L.remove} className={iconButtonClass} onClick={() => removeRow(idx)}>
                    −
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
