"use client";
import * as React from 'react';
import { Button, Input, Select, SelectItem, Card } from '@heroui/react';
import { cn } from '../utils/cn';

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
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Governance Organs</h3>
          <Button size="sm" onPress={addRow} color="primary">Add organ</Button>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-2 text-sm font-semibold text-gray-700">Organ Type</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-700">Last Election Date</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-700">Planned Election Date</th>
                <th className="text-right p-2 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {value.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 last:border-b-0">
                  <td className="py-3 px-2">
                    <Select
                      label="Organ type"
                      selectedKeys={[row.organType]}
                      onChange={(e) => update(idx, { organType: (e.target.value as OrganRow['organType']) })}
                      size="sm"
                      classNames={{ trigger: "min-h-unit-10" }}
                    >
                      <SelectItem key="VALDYBA">Valdyba</SelectItem>
                      <SelectItem key="STEBETOJU_TARYBA">Stebėtojų taryba</SelectItem>
                    </Select>
                  </td>
                  <td className="py-3 px-2">
                    <Input 
                      type="date" 
                      label="Last election date" 
                      value={row.lastElectionDate ?? ''} 
                      onChange={(e) => update(idx, { lastElectionDate: e.target.value || undefined })}
                      size="sm"
                      classNames={{ inputWrapper: "min-h-unit-10" }}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <Input 
                      type="date" 
                      label="Planned election date" 
                      value={row.plannedElectionDate ?? ''} 
                      onChange={(e) => update(idx, { plannedElectionDate: e.target.value || undefined })}
                      size="sm"
                      classNames={{ inputWrapper: "min-h-unit-10" }}
                    />
                  </td>
                  <td className="py-3 px-2 text-right">
                    <Button 
                      size="sm" 
                      color="danger" 
                      variant="flat" 
                      onPress={() => removeRow(idx)}
                      isDisabled={value.length === 1}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
