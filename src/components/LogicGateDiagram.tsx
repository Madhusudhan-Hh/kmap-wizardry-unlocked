import { forwardRef, useMemo } from 'react';

interface LogicGateDiagramProps {
  sopTerms: string[];
  variables: number;
}

export const LogicGateDiagram = forwardRef<HTMLDivElement, LogicGateDiagramProps>(
  ({ sopTerms, variables }, ref) => {
    const varNames = ['A', 'B', 'C', 'D'].slice(0, variables);
    
    const diagram = useMemo(() => {
      if (sopTerms.length === 0 || (sopTerms.length === 1 && sopTerms[0] === '0')) {
        return { inputs: varNames, andGates: [], hasOrGate: false };
      }
      
      // Handle special case where term is "1" (always true)
      if (sopTerms.length === 1 && sopTerms[0] === '1') {
        return { inputs: varNames, andGates: [], hasOrGate: false, isConstantOne: true };
      }
      
      const andGates = sopTerms.map(term => {
        const inputs: { name: string; inverted: boolean }[] = [];
        let i = 0;
        while (i < term.length) {
          const char = term[i];
          if (char >= 'A' && char <= 'D') {
            const inverted = term[i + 1] === "'";
            inputs.push({ name: char, inverted });
            if (inverted) i++;
          }
          i++;
        }
        return { term, inputs };
      });
      
      return {
        inputs: varNames,
        andGates,
        hasOrGate: andGates.length > 1
      };
    }, [sopTerms, varNames]);

    const { andGates, hasOrGate, inputs } = diagram;
    
    if ('isConstantOne' in diagram && diagram.isConstantOne) {
      return (
        <div ref={ref} className="flex items-center justify-center h-48 text-primary font-mono text-lg">
          Output = 1 (Always HIGH)
        </div>
      );
    }
    
    if (andGates.length === 0) {
      return (
        <div ref={ref} className="flex items-center justify-center h-48 text-muted-foreground">
          Output = 0 (No gates needed)
        </div>
      );
    }

    // Calculate dimensions based on number of gates
    const gateHeight = 40;
    const gateSpacing = 70;
    const inputBusX = 80;
    const andGateX = 200;
    const orGateX = 380;
    const outputX = 480;
    const startY = 60;
    
    const totalHeight = Math.max(250, andGates.length * gateSpacing + 80);
    const orGateY = startY + ((andGates.length - 1) * gateSpacing) / 2;
    
    return (
      <div ref={ref} className="w-full overflow-x-auto animate-fade-in">
        <svg 
          viewBox={`0 0 520 ${totalHeight}`}
          className="w-full max-w-2xl mx-auto"
          style={{ minHeight: '250px' }}
        >
          {/* Input labels and bus lines */}
          {inputs.map((input, idx) => {
            const busX = inputBusX + idx * 18;
            const labelY = 25;
            const busEndY = startY + (andGates.length - 1) * gateSpacing + gateHeight;
            
            return (
              <g key={`input-${input}`}>
                {/* Input label */}
                <text
                  x={busX}
                  y={labelY}
                  className="fill-primary font-mono text-sm font-bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {input}
                </text>
                
                {/* Vertical bus line */}
                <line
                  x1={busX}
                  y1={labelY + 12}
                  x2={busX}
                  y2={busEndY}
                  stroke="hsl(210, 20%, 50%)"
                  strokeWidth="2"
                />
              </g>
            );
          })}
          
          {/* AND gates and their connections */}
          {andGates.map((gate, gateIdx) => {
            const gateY = startY + gateIdx * gateSpacing;
            const gateInputs = gate.inputs;
            const inputCount = gateInputs.length;
            const gateInputSpacing = gateHeight / (inputCount + 1);
            
            return (
              <g key={`and-${gateIdx}`}>
                {/* Input wires to AND gate */}
                {gateInputs.map((input, inputIdx) => {
                  const varIdx = inputs.indexOf(input.name);
                  const busX = inputBusX + varIdx * 18;
                  const wireY = gateY + gateInputSpacing * (inputIdx + 1);
                  const gateInputX = input.inverted ? andGateX - 20 : andGateX;
                  
                  return (
                    <g key={`wire-${gateIdx}-${inputIdx}`}>
                      {/* Horizontal wire from bus to gate */}
                      <line
                        x1={busX}
                        y1={wireY}
                        x2={gateInputX}
                        y2={wireY}
                        stroke="hsl(210, 20%, 50%)"
                        strokeWidth="2"
                      />
                      
                      {/* NOT bubble (inverter) if needed */}
                      {input.inverted && (
                        <>
                          <circle
                            cx={andGateX - 10}
                            cy={wireY}
                            r="6"
                            fill="hsl(220, 18%, 14%)"
                            stroke="hsl(185, 80%, 50%)"
                            strokeWidth="2"
                          />
                          <line
                            x1={andGateX - 4}
                            y1={wireY}
                            x2={andGateX}
                            y2={wireY}
                            stroke="hsl(210, 20%, 50%)"
                            strokeWidth="2"
                          />
                        </>
                      )}
                      
                      {/* Connection dot on bus */}
                      <circle
                        cx={busX}
                        cy={wireY}
                        r="4"
                        fill="hsl(185, 80%, 50%)"
                      />
                    </g>
                  );
                })}
                
                {/* AND gate shape */}
                <rect
                  x={andGateX}
                  y={gateY}
                  width={50}
                  height={gateHeight}
                  rx="4"
                  fill="hsl(220, 18%, 14%)"
                  stroke="hsl(185, 80%, 50%)"
                  strokeWidth="2"
                />
                
                {/* AND gate curved right side */}
                <path
                  d={`M${andGateX + 35} ${gateY} 
                      Q${andGateX + 60} ${gateY} ${andGateX + 60} ${gateY + gateHeight / 2}
                      Q${andGateX + 60} ${gateY + gateHeight} ${andGateX + 35} ${gateY + gateHeight}`}
                  fill="hsl(220, 18%, 14%)"
                  stroke="hsl(185, 80%, 50%)"
                  strokeWidth="2"
                />
                
                {/* Cover the rect's right edge */}
                <rect
                  x={andGateX + 34}
                  y={gateY + 1}
                  width="4"
                  height={gateHeight - 2}
                  fill="hsl(220, 18%, 14%)"
                />
                
                {/* AND gate label */}
                <text
                  x={andGateX + 25}
                  y={gateY + gateHeight / 2 + 1}
                  fill="hsl(185, 80%, 50%)"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  AND
                </text>
                
                {/* Term label below gate */}
                <text
                  x={andGateX + 30}
                  y={gateY + gateHeight + 14}
                  fill="hsl(215, 15%, 55%)"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {gate.term}
                </text>
                
                {/* Output wire from AND gate */}
                <line
                  x1={andGateX + 60}
                  y1={gateY + gateHeight / 2}
                  x2={hasOrGate ? orGateX - 10 : outputX - 30}
                  y2={hasOrGate ? orGateY + 20 : gateY + gateHeight / 2}
                  stroke="hsl(210, 20%, 50%)"
                  strokeWidth="2"
                />
                
                {hasOrGate && (
                  <circle
                    cx={orGateX - 10}
                    cy={orGateY + 20}
                    r="3"
                    fill="hsl(280, 70%, 60%)"
                  />
                )}
              </g>
            );
          })}
          
          {/* OR gate */}
          {hasOrGate && (
            <g>
              {/* OR gate shape - curved body */}
              <path
                d={`M${orGateX} ${orGateY}
                    Q${orGateX + 15} ${orGateY + 20} ${orGateX} ${orGateY + 40}
                    Q${orGateX + 30} ${orGateY + 40} ${orGateX + 55} ${orGateY + 20}
                    Q${orGateX + 30} ${orGateY} ${orGateX} ${orGateY}`}
                fill="hsl(220, 18%, 14%)"
                stroke="hsl(280, 70%, 60%)"
                strokeWidth="2"
              />
              
              {/* OR gate label */}
              <text
                x={orGateX + 25}
                y={orGateY + 22}
                fill="hsl(280, 70%, 60%)"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                OR
              </text>
              
              {/* Output wire from OR gate */}
              <line
                x1={orGateX + 55}
                y1={orGateY + 20}
                x2={outputX - 30}
                y2={orGateY + 20}
                stroke="hsl(210, 20%, 50%)"
                strokeWidth="2"
              />
            </g>
          )}
          
          {/* Output label */}
          <g>
            <circle
              cx={outputX - 15}
              cy={hasOrGate ? orGateY + 20 : startY + gateHeight / 2}
              r="12"
              fill="hsl(220, 18%, 14%)"
              stroke="hsl(185, 80%, 50%)"
              strokeWidth="2"
            />
            <text
              x={outputX - 15}
              y={hasOrGate ? orGateY + 21 : startY + gateHeight / 2 + 1}
              fill="hsl(185, 80%, 50%)"
              fontSize="12"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              F
            </text>
          </g>
        </svg>
        
        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Input/AND Gate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span>OR Gate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center text-[8px]">○</div>
            <span>NOT (Inverter)</span>
          </div>
        </div>
      </div>
    );
  }
);

LogicGateDiagram.displayName = 'LogicGateDiagram';
