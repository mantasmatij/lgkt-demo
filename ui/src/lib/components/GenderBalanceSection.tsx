"use client";
import * as React from 'react';
import { Card } from '@heroui/react';
import { cn } from '../utils/cn';
import { InputField } from './fields/InputField';

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
        <div className="flex flex-col gap-4">
          {roles.map((role) => {
            const row = value.find((v) => v.role === role) || { role, women: 0, men: 0, total: 0 };
            const womenPercentage = row.total > 0 ? Math.round((row.women / row.total) * 100) : 0;
            const menPercentage = row.total > 0 ? Math.round((row.men / row.total) * 100) : 0;
            
            return (
              <div key={role} className="flex flex-col gap-2 pb-4 border-b last:border-b-0 last:pb-0">
                <div className="text-sm font-semibold">{role.replace('_', ' ')}</div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InputField type="number" id={`${role}.women`} name={`${role}.women`} label="Women" value={String(row.women)} onChange={(e) => update(role, { women: Number(e.target.value || 0) })} min={0} />
                  <InputField type="number" id={`${role}.men`} name={`${role}.men`} label="Men" value={String(row.men)} onChange={(e) => update(role, { men: Number(e.target.value || 0) })} min={0} />
                  <InputField type="number" id={`${role}.total`} name={`${role}.total`} label="Total" value={String(row.total)} readOnly />
                </div>
                
                {row.total > 0 && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-6 bg-gray-200 rounded-md overflow-hidden flex">
                        <div 
                          className="bg-pink-500 flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${womenPercentage}%` }}
                        >
                          {womenPercentage > 10 && `${womenPercentage}%`}
                        </div>
                        <div 
                          className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${menPercentage}%` }}
                        >
                          {menPercentage > 10 && `${menPercentage}%`}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>👩 Women: {womenPercentage}%</span>
                      <span>👨 Men: {menPercentage}%</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
