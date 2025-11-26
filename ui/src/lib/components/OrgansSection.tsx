"use client";
import * as React from 'react';
import { SelectItem, Card } from '@heroui/react';
import { cn } from '../utils/cn';
import { InputField } from './fields/InputField';
import { DateInputWithPicker } from './fields/DateInputWithPicker';
import { SelectField } from './fields/SelectField';
import { iconButtonClass } from './fields/buttonStyles';

export type OrganRow = {
  organType: 'VALDYBA' | 'STEBETOJU_TARYBA';
  lastElectionDate: string;
  plannedElectionDate: string;
};

type OrgansLabels = {
  title?: string;
  organ_type?: string;
  last_election_date?: string;
  planned_election_date?: string;
  option_VALDYBA?: string;
  option_STEBETOJU_TARYBA?: string;
  add?: string; // aria-label
  remove?: string; // aria-label
};

export function OrgansSection({ value, onChange, labels, errors = {} }: { value: OrganRow[]; onChange: (rows: OrganRow[]) => void; labels?: OrgansLabels; errors?: Record<string, string[]> }) {
  // Ensure at least one row exists
  React.useEffect(() => {
    if (value.length === 0) {
      onChange([{ organType: 'VALDYBA', lastElectionDate: '', plannedElectionDate: '' }]);
    }
  }, []);

  const addRow = () => onChange([...value, { organType: 'VALDYBA', lastElectionDate: '', plannedElectionDate: '' }]);
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

  const L: Required<OrgansLabels> = {
    title: labels?.title ?? 'Governance Organs',
    organ_type: labels?.organ_type ?? 'Organ type',
    last_election_date: labels?.last_election_date ?? 'Last election date',
    planned_election_date: labels?.planned_election_date ?? 'Planned election date',
    option_VALDYBA: labels?.option_VALDYBA ?? 'Valdyba',
    option_STEBETOJU_TARYBA: labels?.option_STEBETOJU_TARYBA ?? 'Stebėtojų taryba',
    add: labels?.add ?? 'Add organ',
    remove: labels?.remove ?? 'Remove organ',
  };

  const firstError = (key: string): string | undefined => {
    if (errors[key]?.[0]) return errors[key][0];
    const bracketKey = key.replace(/\.(\d+)\./g, '[$1].');
    if (errors[bracketKey]?.[0]) return errors[bracketKey][0];
    // Fallback: try to find a closely related key (helps if paths differ slightly)
    const entry = Object.entries(errors).find(([k, v]) =>
      Boolean(v?.length) && (k === key || k === bracketKey)
    );
    return entry?.[1]?.[0];
  };

  return (
    <Card className={cn("p-6")}> 
      <div className="flex flex-col gap-3">
	  <h3 className="text-lg font-bold">{L.title}</h3>

        {value.map((row, idx) => (
          <Card key={idx} className="p-4">
            <div className="flex flex-col gap-3">
              <SelectField
                id={`organs.${idx}.organType`}
                name={`organs.${idx}.organType`}
                label={L.organ_type}
                labelClassName="font-normal"
                selectedKeys={[row.organType]}
                classNames={{
                  // Increase only horizontal padding to prevent text touching the border/chevron
                  // Keep height unchanged
                  trigger: 'pl-4 pr-8',
                  // Add inner padding for the dropdown content to avoid text hugging the border
                  popoverContent: 'p-1', // 8px per 8-point grid
                  listbox: 'p-1',
                }}
                onSelectionChange={(keys) => {
                  const k = Array.from(keys as Set<string>)[0] as OrganRow['organType'] | undefined;
                  if (k) update(idx, { organType: k });
                }}
              >
                <SelectItem key="VALDYBA">{L.option_VALDYBA}</SelectItem>
                <SelectItem key="STEBETOJU_TARYBA">{L.option_STEBETOJU_TARYBA}</SelectItem>
              </SelectField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label htmlFor={`organs.${idx}.lastElectionDate`} className="text-black font-normal mb-2">{L.last_election_date} *</label>
                  <div>
                    <DateInputWithPicker
                      id={`organs.${idx}.lastElectionDate`}
                      value={row.lastElectionDate || ''}
                      onChange={(v) => update(idx, { lastElectionDate: v })}
                      ariaLabel={L.last_election_date}
                    />
                  </div>
                  {firstError(`organs.${idx}.lastElectionDate`) && (
                    <div className="text-sm text-red-600 mt-2" role="alert">{firstError(`organs.${idx}.lastElectionDate`)}</div>
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor={`organs.${idx}.plannedElectionDate`} className="text-black font-normal mb-2">{L.planned_election_date} *</label>
                  <div>
                    <DateInputWithPicker
                      id={`organs.${idx}.plannedElectionDate`}
                      value={row.plannedElectionDate || ''}
                      onChange={(v) => update(idx, { plannedElectionDate: v })}
                      ariaLabel={L.planned_election_date}
                    />
                  </div>
                  {firstError(`organs.${idx}.plannedElectionDate`) && (
                    <div className="text-sm text-red-600 mt-2" role="alert">{firstError(`organs.${idx}.plannedElectionDate`)}</div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                {/* Show add on the left only for the last row */}
                {idx === value.length - 1 ? (
                  <button
                    type="button"
                    aria-label={L.add}
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
                    aria-label={L.remove}
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
