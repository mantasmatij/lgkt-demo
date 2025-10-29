"use client";
import * as React from 'react';
import { SelectItem, Card } from '@heroui/react';
import { cn } from '../utils/cn';
import { InputField } from './fields/InputField';
import { SelectField } from './fields/SelectField';
import { iconButtonClass } from './fields/buttonStyles';

export type OrganRow = {
  organType: 'VALDYBA' | 'STEBETOJU_TARYBA';
  lastElectionDate?: string;
  plannedElectionDate?: string;
};

export function OrgansSection({ value, onChange }: { value: OrganRow[]; onChange: (rows: OrganRow[]) => void }) {
  // Ensure at least one row exists
  React.useEffect(() => {
    if (value.length === 0) {
      onChange([{ organType: 'VALDYBA' }]);
    }
  }, []);

  const addRow = () => onChange([...value, { organType: 'VALDYBA' }]);
  const removeRow = (idx: number) => {
    // Prevent removing the last row
    if (value.length > 1) {
      onChange(value.filter((_, i) => i !== idx));
    }
  };
  const update = (idx: number, patch: Partial<OrganRow>) => {
    const next = [...value];
    next[idx] = { ...next[idx], ...patch } as OrganRow;
    onChange(next);
  };

  return (
    <Card className={cn("p-6")}> 
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-medium">Governance Organs</h3>

        {value.map((row, idx) => (
          <Card key={idx} className="p-4">
            <div className="flex flex-col gap-3">
              <SelectField
                id={`organ.${idx}.type`}
                name={`organ.${idx}.type`}
                label="Organ type"
                selectedKeys={[row.organType]}
                classNames={{
                  // Increase only horizontal padding to prevent text touching the border/chevron
                  // Keep height unchanged
                  trigger: 'pl-4 pr-8',
                  // Add inner padding for the dropdown content to avoid text hugging the border
                  popoverContent: 'p-1', // 8px per 8-point grid
                  listbox: 'p-1',
                }}
                onChange={(e) => update(idx, { organType: (e.target.value as OrganRow['organType']) })}
              >
                <SelectItem key="VALDYBA">Valdyba</SelectItem>
                <SelectItem key="STEBETOJU_TARYBA">Stebėtojų taryba</SelectItem>
              </SelectField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField
                  id={`organ.${idx}.lastElectionDate`}
                  name={`organ.${idx}.lastElectionDate`}
                  type="date"
                  label="Last election date"
                  value={row.lastElectionDate ?? ''}
                  onChange={(e) => update(idx, { lastElectionDate: e.target.value || undefined })}
                />
                <InputField
                  id={`organ.${idx}.plannedElectionDate`}
                  name={`organ.${idx}.plannedElectionDate`}
                  type="date"
                  label="Planned election date"
                  value={row.plannedElectionDate ?? ''}
                  onChange={(e) => update(idx, { plannedElectionDate: e.target.value || undefined })}
                />
              </div>

              <div className="flex justify-between items-center">
                {/* Show add on the left only for the last row */}
                {idx === value.length - 1 ? (
                  <button
                    type="button"
                    aria-label="Add organ"
                    className={iconButtonClass}
                    onClick={addRow}
                  >
                    +
                  </button>
                ) : (
                  <div />
                )}
                {/* Show remove on the right for all rows except when only one exists */}
                {value.length > 1 && (
                  <button
                    type="button"
                    aria-label="Remove organ"
                    className={iconButtonClass}
                    onClick={() => removeRow(idx)}
                  >
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
