"use client";
import * as React from 'react';
import { Card, Input } from '@heroui/react';
import { cn } from '../utils/cn';

export type GenderRow = { role: 'CEO' | 'BOARD' | 'SUPERVISORY_BOARD'; women: number; men: number; total: number };

const roles: GenderRow['role'][] = ['CEO', 'BOARD', 'SUPERVISORY_BOARD'];

export function GenderBalanceSection({ value, onChange }: { value: GenderRow[]; onChange: (rows: GenderRow[]) => void }) {
  React.useEffect(() => {
    if (value.length !== roles.length) {
      const next = roles.map((r) => value.find((v) => v.role === r) || { role: r, women: 0, men: 0, total: 0 });
      onChange(next);
    }
  }, []);

  const update = (role: GenderRow['role'], patch: Partial<GenderRow>) => {
    const idx = value.findIndex((v) => v.role === role);
    const row = { ...value[idx], ...patch } as GenderRow;
    row.total = row.women + row.men;
    const next = [...value];
    next[idx] = row;
    onChange(next);
  };

  return (
    <Card className={cn("p-6")}>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-medium mb-2">Gender balance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {roles.map((role) => {
            const row = value.find((v) => v.role === role) || { role, women: 0, men: 0, total: 0 };
            return (
              <Card key={role} className={cn("p-4")}>
                <div className="flex flex-col gap-3">
                  <div className="text-sm font-medium">{role.replace('_', ' ')}</div>
                  <div className="grid grid-cols-3 gap-2">
                <Input type="number" min={0} label="Women" value={String(row.women)} onChange={(e) => update(role, { women: Number(e.target.value || 0) })} />
                <Input type="number" min={0} label="Men" value={String(row.men)} onChange={(e) => update(role, { men: Number(e.target.value || 0) })} />
                <Input type="number" isReadOnly label="Total" value={String(row.total)} />
              </div>
                </div>
            </Card>
          );
        })}
        </div>
      </div>
    </Card>
  );
}
