import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TruthTableInput } from './TruthTableInput';
import { InputType, parseTerms } from '@/lib/kmap-solver';
import { Calculator, Table, Binary } from 'lucide-react';

interface InputPanelProps {
  variables: number;
  onVariablesChange: (v: number) => void;
  onSolve: (type: InputType, values: number[], dontCares: number[]) => void;
}

export function InputPanel({ variables, onVariablesChange, onSolve }: InputPanelProps) {
  const [inputType, setInputType] = useState<InputType>('minterms');
  const [mintermsInput, setMintermsInput] = useState('');
  const [maxtermsInput, setMaxtermsInput] = useState('');
  const [dontCaresInput, setDontCaresInput] = useState('');
  const [truthTableValues, setTruthTableValues] = useState<number[]>([]);

  const handleSolve = () => {
    const dontCares = parseTerms(dontCaresInput);
    
    if (inputType === 'minterms') {
      const values = parseTerms(mintermsInput);
      onSolve('minterms', values, dontCares);
    } else if (inputType === 'maxterms') {
      const values = parseTerms(maxtermsInput);
      onSolve('maxterms', values, dontCares);
    } else {
      const dontCareIndices = truthTableValues
        .map((v, i) => v === -1 ? i : -1)
        .filter(i => i >= 0);
      onSolve('truthTable', truthTableValues, dontCareIndices);
    }
  };

  const maxMinterm = Math.pow(2, variables) - 1;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Variable selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">Number of Variables</Label>
        <div className="flex gap-2">
          {[2, 3, 4].map(v => (
            <Button
              key={v}
              variant={variables === v ? "default" : "outline"}
              className={`flex-1 font-mono ${variables === v ? 'glow-box' : ''}`}
              onClick={() => onVariablesChange(v)}
            >
              {v} Variables
            </Button>
          ))}
        </div>
      </div>

      {/* Input type tabs */}
      <Tabs 
        value={inputType} 
        onValueChange={(v) => setInputType(v as InputType)}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-3 bg-secondary">
          <TabsTrigger 
            value="minterms" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Binary className="w-4 h-4" />
            Minterms
          </TabsTrigger>
          <TabsTrigger 
            value="maxterms"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Calculator className="w-4 h-4" />
            Maxterms
          </TabsTrigger>
          <TabsTrigger 
            value="truthTable"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Table className="w-4 h-4" />
            Truth Table
          </TabsTrigger>
        </TabsList>

        <TabsContent value="minterms" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Minterms (0-{maxMinterm}), comma-separated
            </Label>
            <Input
              placeholder="e.g., 0, 1, 5, 7, 8, 14"
              value={mintermsInput}
              onChange={(e) => setMintermsInput(e.target.value)}
              className="font-mono bg-input border-border focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Don't Cares (optional)
            </Label>
            <Input
              placeholder="e.g., 2, 4, 10"
              value={dontCaresInput}
              onChange={(e) => setDontCaresInput(e.target.value)}
              className="font-mono bg-input border-border focus:ring-primary"
            />
          </div>
        </TabsContent>

        <TabsContent value="maxterms" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Maxterms (0-{maxMinterm}), comma-separated
            </Label>
            <Input
              placeholder="e.g., 2, 3, 4, 6, 9, 11"
              value={maxtermsInput}
              onChange={(e) => setMaxtermsInput(e.target.value)}
              className="font-mono bg-input border-border focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Don't Cares (optional)
            </Label>
            <Input
              placeholder="e.g., 2, 4, 10"
              value={dontCaresInput}
              onChange={(e) => setDontCaresInput(e.target.value)}
              className="font-mono bg-input border-border focus:ring-primary"
            />
          </div>
        </TabsContent>

        <TabsContent value="truthTable" className="mt-4">
          <TruthTableInput 
            variables={variables} 
            onChange={setTruthTableValues}
          />
        </TabsContent>
      </Tabs>

      {/* Solve button */}
      <Button 
        onClick={handleSolve}
        className="w-full h-12 text-lg font-semibold glow-box animate-pulse-glow"
        size="lg"
      >
        <Calculator className="w-5 h-5 mr-2" />
        Solve K-Map
      </Button>
    </div>
  );
}
