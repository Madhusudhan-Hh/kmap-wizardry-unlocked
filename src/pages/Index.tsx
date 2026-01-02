import { useState } from 'react';
import { InputPanel } from '@/components/InputPanel';
import { ResultsPanel } from '@/components/ResultsPanel';
import { solveKMap, InputType, KMapResult } from '@/lib/kmap-solver';
import { CircuitBoard, Zap } from 'lucide-react';

const Index = () => {
  const [variables, setVariables] = useState(4);
  const [result, setResult] = useState<KMapResult | null>(null);

  const handleSolve = (type: InputType, values: number[], dontCares: number[]) => {
    const solved = solveKMap({
      type,
      variables,
      values,
      dontCares
    });
    setResult(solved);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 glow-box">
              <CircuitBoard className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="text-foreground">K-Map</span>
              <span className="text-primary glow-text"> Solver</span>
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simplify Boolean expressions using Karnaugh Maps. Enter minterms, maxterms, or a truth table
            to get minimized SOP/POS expressions and logic gate diagrams.
          </p>
        </header>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input panel */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Input</h2>
            </div>
            <InputPanel 
              variables={variables}
              onVariablesChange={setVariables}
              onSolve={handleSolve}
            />
          </div>

          {/* Results panel */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <CircuitBoard className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Results</h2>
            </div>
            {result ? (
              <ResultsPanel 
                result={result}
                variables={variables}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <CircuitBoard className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-center">
                  Enter your K-Map input and click "Solve" to see the results
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Supports 2, 3, and 4 variable K-Maps • Automatic grouping and simplification</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
