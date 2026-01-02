import { useMemo } from 'react';

interface LogicGateDiagramProps {
  sopTerms: string[];
  variables: number;
}

export function LogicGateDiagram({ sopTerms, variables }: LogicGateDiagramProps) {
  const varNames = ['A', 'B', 'C', 'D'].slice(0, variables);
  
  const diagram = useMemo(() => {
    if (sopTerms.length === 0 || (sopTerms.length === 1 && sopTerms[0] === '0')) {
      return { inputs: varNames, andGates: [], hasOrGate: false };
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
  
  if (andGates.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        Output = 0 (No gates needed)
      </div>
    );
  }

  const gateSpacing = 80;
  const inputSpacing = 30;
  const startY = 40;
  const andX = 180;
  const orX = 340;
  const outputX = 450;
  
  return (
    <div className="w-full overflow-x-auto animate-fade-in">
      <svg 
        viewBox={`0 0 500 ${Math.max(200, andGates.length * gateSpacing + 60)}`}
        className="w-full max-w-2xl mx-auto"
        style={{ minHeight: '200px' }}
      >
        {/* Input labels */}
        {inputs.map((input, idx) => (
          <g key={`input-${input}`}>
            <text
              x={20}
              y={startY + idx * inputSpacing}
              className="fill-foreground font-mono text-sm"
              dominantBaseline="middle"
            >
              {input}
            </text>
            <line
              x1={35}
              y1={startY + idx * inputSpacing}
              x2={60}
              y2={startY + idx * inputSpacing}
              className="stroke-wire"
              strokeWidth="2"
            />
            {/* Vertical bus line */}
            <line
              x1={60 + idx * 15}
              y1={startY + idx * inputSpacing}
              x2={60 + idx * 15}
              y2={startY + (andGates.length - 1) * gateSpacing + 40}
              className="stroke-wire"
              strokeWidth="2"
            />
          </g>
        ))}
        
        {/* AND gates */}
        {andGates.map((gate, gateIdx) => {
          const gateY = startY + gateIdx * gateSpacing;
          const gateInputs = gate.inputs;
          
          return (
            <g key={`and-${gateIdx}`}>
              {/* Input wires to AND gate */}
              {gateInputs.map((input, inputIdx) => {
                const varIdx = inputs.indexOf(input.name);
                const busX = 60 + varIdx * 15;
                const inputY = gateY - 10 + inputIdx * 20;
                
                return (
                  <g key={`wire-${gateIdx}-${inputIdx}`}>
                    {/* Horizontal wire from bus */}
                    <line
                      x1={busX}
                      y1={inputY}
                      x2={input.inverted ? andX - 30 : andX}
                      y2={inputY}
                      className="stroke-wire"
                      strokeWidth="2"
                    />
                    {/* NOT gate (inverter) if needed */}
                    {input.inverted && (
                      <>
                        <circle
                          cx={andX - 22}
                          cy={inputY}
                          r="6"
                          className="fill-gate-fill stroke-primary"
                          strokeWidth="2"
                        />
                        <line
                          x1={andX - 16}
                          y1={inputY}
                          x2={andX}
                          y2={inputY}
                          className="stroke-wire"
                          strokeWidth="2"
                        />
                      </>
                    )}
                    {/* Connection dot on bus */}
                    <circle
                      cx={busX}
                      cy={inputY}
                      r="3"
                      className="fill-primary"
                    />
                  </g>
                );
              })}
              
              {/* AND gate shape */}
              <path
                d={`M${andX} ${gateY - 15} 
                    L${andX + 30} ${gateY - 15} 
                    Q${andX + 55} ${gateY - 15} ${andX + 55} ${gateY}
                    Q${andX + 55} ${gateY + 15} ${andX + 30} ${gateY + 15}
                    L${andX} ${gateY + 15} Z`}
                className="fill-gate-fill stroke-primary"
                strokeWidth="2"
              />
              
              {/* AND gate label */}
              <text
                x={andX + 25}
                y={gateY + 4}
                className="fill-primary font-mono text-xs"
                textAnchor="middle"
              >
                AND
              </text>
              
              {/* Output wire from AND */}
              <line
                x1={andX + 55}
                y1={gateY}
                x2={hasOrGate ? orX : outputX - 20}
                y2={hasOrGate ? startY + ((andGates.length - 1) * gateSpacing) / 2 : gateY}
                className="stroke-wire"
                strokeWidth="2"
              />
            </g>
          );
        })}
        
        {/* OR gate */}
        {hasOrGate && (
          <g>
            {/* OR gate input wires */}
            {andGates.map((_, idx) => {
              const gateY = startY + idx * gateSpacing;
              const orY = startY + ((andGates.length - 1) * gateSpacing) / 2;
              return (
                <line
                  key={`or-wire-${idx}`}
                  x1={andX + 55}
                  y1={gateY}
                  x2={orX}
                  y2={orY - 15 + (idx * 30 / (andGates.length - 1 || 1))}
                  className="stroke-wire"
                  strokeWidth="2"
                />
              );
            })}
            
            {/* OR gate shape */}
            <path
              d={`M${orX} ${startY + ((andGates.length - 1) * gateSpacing) / 2 - 20}
                  Q${orX + 15} ${startY + ((andGates.length - 1) * gateSpacing) / 2} ${orX} ${startY + ((andGates.length - 1) * gateSpacing) / 2 + 20}
                  Q${orX + 30} ${startY + ((andGates.length - 1) * gateSpacing) / 2 + 20} ${orX + 55} ${startY + ((andGates.length - 1) * gateSpacing) / 2}
                  Q${orX + 30} ${startY + ((andGates.length - 1) * gateSpacing) / 2 - 20} ${orX} ${startY + ((andGates.length - 1) * gateSpacing) / 2 - 20}`}
              className="fill-gate-fill stroke-accent"
              strokeWidth="2"
            />
            
            <text
              x={orX + 28}
              y={startY + ((andGates.length - 1) * gateSpacing) / 2 + 4}
              className="fill-accent font-mono text-xs"
              textAnchor="middle"
            >
              OR
            </text>
            
            {/* Output wire */}
            <line
              x1={orX + 55}
              y1={startY + ((andGates.length - 1) * gateSpacing) / 2}
              x2={outputX - 20}
              y2={startY + ((andGates.length - 1) * gateSpacing) / 2}
              className="stroke-wire"
              strokeWidth="2"
            />
          </g>
        )}
        
        {/* Output label */}
        <text
          x={outputX}
          y={hasOrGate ? startY + ((andGates.length - 1) * gateSpacing) / 2 : startY}
          className="fill-foreground font-mono text-sm font-bold"
          dominantBaseline="middle"
        >
          F
        </text>
      </svg>
    </div>
  );
}
