import React, { useState, useRef, useEffect } from 'react';
import { 
  Calculator, 
  Delete, 
  RotateCcw, 
  Info,
  ChevronDown,
  ChevronUp,
  History,
  Copy,
  Check
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type CalculatorMode = 'basic' | 'scientific' | 'programmer';

interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: Date;
}

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [mode, setMode] = useState<CalculatorMode>('scientific');
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [angleUnit, setAngleUnit] = useState<'deg' | 'rad'>('deg');
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [copied, setCopied] = useState(false);
  const displayRef = useRef<HTMLDivElement>(null);

  // Auto-scroll display when content overflows
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [display, expression]);

  const handleNumber = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
      setExpression(num);
    } else {
      setDisplay(display + num);
      setExpression(expression + num);
    }
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    setDisplay(display + ' ' + op + ' ');
    setExpression(expression + op);
  };

  const handleFunction = (func: string) => {
    if (display === 'Error') return;
    
    let funcStr = '';
    switch (func) {
      case 'sin':
      case 'cos':
      case 'tan':
      case 'asin':
      case 'acos':
      case 'atan':
        funcStr = angleUnit === 'deg' ? `${func}(${display}°)` : `${func}(${display})`;
        break;
      case 'log':
        funcStr = `log₁₀(${display})`;
        break;
      case 'ln':
        funcStr = `ln(${display})`;
        break;
      case 'sqrt':
        funcStr = `√(${display})`;
        break;
      case 'exp':
        funcStr = `e^(${display})`;
        break;
      case 'abs':
        funcStr = `|${display}|`;
        break;
      default:
        funcStr = `${func}(${display})`;
    }
    
    try {
      const result = calculateFunction(func, parseFloat(display));
      const entry: HistoryEntry = {
        expression: funcStr,
        result: result.toString(),
        timestamp: new Date()
      };
      setHistory([entry, ...history.slice(0, 49)]);
      setDisplay(result.toString());
      setExpression(result.toString());
    } catch (error) {
      setDisplay('Error');
      setExpression('');
    }
  };

  const calculateFunction = (func: string, value: number): number => {
    const radValue = angleUnit === 'deg' ? (value * Math.PI) / 180 : value;
    
    switch (func) {
      case 'sin': return Math.sin(radValue);
      case 'cos': return Math.cos(radValue);
      case 'tan': return Math.tan(radValue);
      case 'asin': return angleUnit === 'deg' ? (Math.asin(value) * 180) / Math.PI : Math.asin(value);
      case 'acos': return angleUnit === 'deg' ? (Math.acos(value) * 180) / Math.PI : Math.acos(value);
      case 'atan': return angleUnit === 'deg' ? (Math.atan(value) * 180) / Math.PI : Math.atan(value);
      case 'log': return Math.log10(value);
      case 'ln': return Math.log(value);
      case 'sqrt': return Math.sqrt(value);
      case 'exp': return Math.exp(value);
      case 'abs': return Math.abs(value);
      case 'factorial': return factorial(value);
      default: return value;
    }
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid input');
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  const handleEquals = () => {
    try {
      // Safe evaluation using Function constructor with limited scope
      const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
      const result = Function('"use strict"; return (' + sanitized + ')')();
      
      const entry: HistoryEntry = {
        expression: display,
        result: result.toString(),
        timestamp: new Date()
      };
      setHistory([entry, ...history.slice(0, 49)]);
      
      setDisplay(result.toString());
      setExpression(result.toString());
    } catch (error) {
      setDisplay('Error');
      setExpression('');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleBackspace = () => {
    if (display.length > 1 && display !== 'Error') {
      setDisplay(display.slice(0, -1));
      setExpression(expression.slice(0, -1));
    } else {
      setDisplay('0');
      setExpression('');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(display);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleHistoryClick = (entry: HistoryEntry) => {
    setDisplay(entry.result);
    setExpression(entry.result);
    setShowHistory(false);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Scientific Calculator</h1>
                  <p className="text-sm text-gray-600">Advanced mathematical operations</p>
                </div>
              </div>
              
              <Button
                variant={showHistory ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Calculator */}
            <Card className="lg:col-span-8 p-6 shadow-xl">
              {/* Display */}
              <div className="mb-6 space-y-3">
                {/* Expression Display */}
                <div 
                  ref={displayRef}
                  className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl p-4 min-h-[80px] border-2 border-slate-200 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300"
                >
                  <div className="text-sm text-slate-600 mb-1 font-mono whitespace-nowrap">
                    {expression || '\u00A0'}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl sm:text-4xl font-bold text-slate-900 font-mono whitespace-nowrap">
                      {display}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="ml-2 flex-shrink-0"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Mode & Settings */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                    <Button
                      variant={angleUnit === 'deg' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setAngleUnit('deg')}
                      className="text-xs font-medium"
                    >
                      DEG
                    </Button>
                    <Button
                      variant={angleUnit === 'rad' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setAngleUnit('rad')}
                      className="text-xs font-medium"
                    >
                      RAD
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                    Advanced
                  </Button>
                </div>
              </div>

              {/* Button Grid */}
              <div className="space-y-4">
                {/* Control Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    className="h-14 text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    AC
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBackspace}
                    className="h-14 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  >
                    <Delete className="w-5 h-5" />
                  </Button>
                  <CalcButton
                    label="("
                    onClick={() => handleNumber('(')}
                    variant="outline"
                    tooltip="Open parenthesis"
                  />
                  <CalcButton
                    label=")"
                    onClick={() => handleNumber(')')}
                    variant="outline"
                    tooltip="Close parenthesis"
                  />
                </div>

                {/* Advanced Functions (Collapsible) */}
                {showAdvanced && (
                  <div className="space-y-2 bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="text-xs font-semibold text-slate-600 mb-2">Trigonometric Functions</div>
                    <div className="grid grid-cols-6 gap-2">
                      <CalcButton label="sin" onClick={() => handleFunction('sin')} tooltip="Sine" />
                      <CalcButton label="cos" onClick={() => handleFunction('cos')} tooltip="Cosine" />
                      <CalcButton label="tan" onClick={() => handleFunction('tan')} tooltip="Tangent" />
                      <CalcButton label="asin" onClick={() => handleFunction('asin')} tooltip="Arc sine" />
                      <CalcButton label="acos" onClick={() => handleFunction('acos')} tooltip="Arc cosine" />
                      <CalcButton label="atan" onClick={() => handleFunction('atan')} tooltip="Arc tangent" />
                    </div>

                    <div className="text-xs font-semibold text-slate-600 mb-2 mt-4">Logarithmic & Exponential</div>
                    <div className="grid grid-cols-6 gap-2">
                      <CalcButton label="log" onClick={() => handleFunction('log')} tooltip="Logarithm base 10" />
                      <CalcButton label="ln" onClick={() => handleFunction('ln')} tooltip="Natural logarithm" />
                      <CalcButton label="e^x" onClick={() => handleFunction('exp')} tooltip="Exponential (e to the power x)" />
                      <CalcButton label="√" onClick={() => handleFunction('sqrt')} tooltip="Square root" />
                      <CalcButton label="x²" onClick={() => handleOperator('**2')} tooltip="Square" />
                      <CalcButton label="x^y" onClick={() => handleOperator('**')} tooltip="Power" />
                    </div>

                    <div className="text-xs font-semibold text-slate-600 mb-2 mt-4">Other Functions</div>
                    <div className="grid grid-cols-6 gap-2">
                      <CalcButton label="|x|" onClick={() => handleFunction('abs')} tooltip="Absolute value" />
                      <CalcButton label="π" onClick={() => handleNumber(Math.PI.toString())} tooltip="Pi (3.14159...)" />
                      <CalcButton label="e" onClick={() => handleNumber(Math.E.toString())} tooltip="Euler's number (2.71828...)" />
                      <CalcButton label="n!" onClick={() => handleFunction('factorial')} tooltip="Factorial" />
                      <CalcButton label="1/x" onClick={() => handleOperator('1/')} tooltip="Reciprocal" />
                      <CalcButton label="%" onClick={() => handleOperator('/100*')} tooltip="Percentage" />
                    </div>
                  </div>
                )}

                {/* Basic Number Pad */}
                <div className="grid grid-cols-4 gap-2">
                  <CalcButton label="7" onClick={() => handleNumber('7')} className="h-16 text-lg font-semibold" />
                  <CalcButton label="8" onClick={() => handleNumber('8')} className="h-16 text-lg font-semibold" />
                  <CalcButton label="9" onClick={() => handleNumber('9')} className="h-16 text-lg font-semibold" />
                  <CalcButton label="÷" onClick={() => handleOperator('/')} variant="secondary" className="h-16 text-xl" tooltip="Division" />

                  <CalcButton label="4" onClick={() => handleNumber('4')} className="h-16 text-lg font-semibold" />
                  <CalcButton label="5" onClick={() => handleNumber('5')} className="h-16 text-lg font-semibold" />
                  <CalcButton label="6" onClick={() => handleNumber('6')} className="h-16 text-lg font-semibold" />
                  <CalcButton label="×" onClick={() => handleOperator('*')} variant="secondary" className="h-16 text-xl" tooltip="Multiplication" />

                  <CalcButton label="1" onClick={() => handleNumber('1')} className="h-16 text-lg font-semibold" />
                  <CalcButton label="2" onClick={() => handleNumber('2')} className="h-16 text-lg font-semibold" />
                  <CalcButton label="3" onClick={() => handleNumber('3')} className="h-16 text-lg font-semibold" />
                  <CalcButton label="−" onClick={() => handleOperator('-')} variant="secondary" className="h-16 text-xl" tooltip="Subtraction" />

                  <CalcButton label="0" onClick={() => handleNumber('0')} className="h-16 text-lg font-semibold col-span-2" />
                  <CalcButton label="." onClick={() => handleNumber('.')} className="h-16 text-lg font-semibold" tooltip="Decimal point" />
                  <CalcButton label="+" onClick={() => handleOperator('+')} variant="secondary" className="h-16 text-xl" tooltip="Addition" />
                </div>

                {/* Equals Button */}
                <Button
                  onClick={handleEquals}
                  className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  = Calculate
                </Button>
              </div>
            </Card>

            {/* History Sidebar */}
            {showHistory && (
              <Card className="lg:col-span-4 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Calculation History
                  </h3>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHistory([])}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {history.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No calculations yet</p>
                    </div>
                  ) : (
                    history.map((entry, index) => (
                      <button
                        key={index}
                        onClick={() => handleHistoryClick(entry)}
                        className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200 border border-slate-200"
                      >
                        <div className="text-xs text-slate-600 mb-1 truncate">{entry.expression}</div>
                        <div className="text-sm font-semibold text-slate-900 truncate">= {entry.result}</div>
                        <div className="text-xs text-slate-400 mt-1">
                          {entry.timestamp.toLocaleTimeString()}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Help Section */}
          <Card className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-2">Quick Tips</h4>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-blue-800">
                  <div>
                    <strong>Keyboard Shortcuts:</strong> Use number keys, +, -, *, /, Enter for equals, Esc for clear
                  </div>
                  <div>
                    <strong>Angle Units:</strong> Toggle between DEG and RAD for trigonometric functions
                  </div>
                  <div>
                    <strong>Order of Operations:</strong> Use parentheses () to control calculation order
                  </div>
                  <div>
                    <strong>History:</strong> Click any past calculation to reuse its result
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Reusable Calculator Button Component
interface CalcButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
  tooltip?: string;
}

function CalcButton({ label, onClick, variant = 'outline', className = '', tooltip }: CalcButtonProps) {
  const button = (
    <Button
      variant={variant}
      onClick={onClick}
      className={`h-12 font-semibold hover:scale-105 transition-transform duration-150 ${className}`}
    >
      {label}
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}
