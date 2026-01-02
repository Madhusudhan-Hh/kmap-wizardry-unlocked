import { KMapGrid } from './KMapGrid';
import { LogicGateDiagram } from './LogicGateDiagram';
import { KMapResult } from '@/lib/kmap-solver';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3X3, CircuitBoard, FileCode } from 'lucide-react';

interface ResultsPanelProps {
  result: KMapResult;
  variables: number;
}

export function ResultsPanel({ result, variables }: ResultsPanelProps) {
  const { grid, groups, sop, pos, sopTerms } = result;

  return (
    <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <Tabs defaultValue="kmap" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-secondary">
          <TabsTrigger 
            value="kmap"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Grid3X3 className="w-4 h-4" />
            K-Map
          </TabsTrigger>
          <TabsTrigger 
            value="expressions"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileCode className="w-4 h-4" />
            Expressions
          </TabsTrigger>
          <TabsTrigger 
            value="diagram"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <CircuitBoard className="w-4 h-4" />
            Logic Gates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kmap" className="mt-6">
          <div className="flex justify-center">
            <KMapGrid 
              variables={variables}
              grid={grid}
              groups={groups}
            />
          </div>
        </TabsContent>

        <TabsContent value="expressions" className="mt-6 space-y-4">
          <div className="expression-box glow-box">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Sum of Products (SOP)
            </div>
            <div className="text-xl text-primary glow-text break-all">
              F = {sop || '0'}
            </div>
          </div>
          
          <div className="expression-box border-accent/30">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Product of Sums (POS)
            </div>
            <div className="text-xl text-accent break-all">
              F = {pos || '1'}
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Simplification Steps</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {groups.map((group, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span 
                    className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: group.color }}
                  />
                  <span>
                    Group cells <span className="font-mono text-foreground">{group.cells.join(', ')}</span> 
                    {' → '}
                    <span className="font-mono" style={{ color: group.color }}>{group.term}</span>
                  </span>
                </li>
              ))}
              {groups.length === 0 && (
                <li className="text-muted-foreground">No groupings found - output is constant 0</li>
              )}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="diagram" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">
              Logic Gate Implementation (SOP)
            </h4>
            <LogicGateDiagram 
              sopTerms={sopTerms}
              variables={variables}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
