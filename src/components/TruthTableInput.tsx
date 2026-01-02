import { useState, useEffect } from 'react';
import { getVariableNames } from '@/lib/kmap-solver';

interface TruthTableInputProps {
  variables: number;
  onChange: (values: number[]) => void;
}

export function TruthTableInput({ variables, onChange }: TruthTableInputProps) {
  const varNames = getVariableNames(variables);
  const rows = Math.pow(2, variables);
  const [outputs, setOutputs] = useState<number[]>(Array(rows).fill(0));

  useEffect(() => {
    setOutputs(Array(rows).fill(0));
  }, [rows]);

  const toggleOutput = (idx: number) => {
    const newOutputs = [...outputs];
    newOutputs[idx] = (newOutputs[idx] + 1) % 3; // Cycle: 0 -> 1 -> X(2) -> 0
    setOutputs(newOutputs);
    onChange(newOutputs.map(v => v === 2 ? -1 : v));
  };

  const getBinaryInputs = (idx: number): string[] => {
    return idx.toString(2).padStart(variables, '0').split('');
  };

  return (
    <div className="overflow-x-auto animate-fade-in">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {varNames.map(name => (
              <th 
                key={name}
                className="px-4 py-2 text-sm font-mono font-semibold text-primary bg-secondary border border-border"
              >
                {name}
              </th>
            ))}
            <th className="px-4 py-2 text-sm font-mono font-semibold text-accent bg-secondary border border-border">
              F
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, idx) => {
            const inputs = getBinaryInputs(idx);
            return (
              <tr key={idx} className="hover:bg-muted/50 transition-colors">
                {inputs.map((bit, bitIdx) => (
                  <td 
                    key={bitIdx}
                    className="px-4 py-2 text-center font-mono text-sm border border-border"
                  >
                    {bit}
                  </td>
                ))}
                <td className="px-4 py-2 text-center border border-border">
                  <button
                    onClick={() => toggleOutput(idx)}
                    className={`
                      w-8 h-8 rounded font-mono font-semibold transition-all
                      ${outputs[idx] === 1 
                        ? 'bg-primary text-primary-foreground' 
                        : outputs[idx] === 2 
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'}
                    `}
                  >
                    {outputs[idx] === 2 ? 'X' : outputs[idx]}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Click on output cells to toggle: 0 → 1 → X (don't care) → 0
      </p>
    </div>
  );
}
