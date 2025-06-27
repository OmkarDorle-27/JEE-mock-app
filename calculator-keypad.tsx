import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Delete } from "lucide-react";

interface CalculatorKeypadProps {
  value: string;
  onChange: (value: string | number) => void;
}

export default function CalculatorKeypad({ value, onChange }: CalculatorKeypadProps) {
  const [displayValue, setDisplayValue] = useState(value || '');

  const handleKeypadClick = (keyValue: string) => {
    let newValue = displayValue;
    
    if (keyValue === 'clear') {
      newValue = '';
    } else if (keyValue === 'backspace') {
      newValue = displayValue.slice(0, -1);
    } else {
      // Prevent multiple decimal points
      if (keyValue === '.' && displayValue.includes('.')) {
        return;
      }
      newValue = displayValue + keyValue;
    }
    
    setDisplayValue(newValue);
    onChange(newValue);
  };

  const keypadButtons = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', 'backspace'],
  ];

  return (
    <div>
      <div className="mb-4">
        <Input
          type="text"
          value={displayValue}
          onChange={(e) => {
            setDisplayValue(e.target.value);
            onChange(e.target.value);
          }}
          className="text-center text-xl font-mono"
          placeholder="0.00"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {keypadButtons.flat().map((key) => (
          <Button
            key={key}
            variant="outline"
            className="h-12 font-semibold"
            onClick={() => handleKeypadClick(key)}
          >
            {key === 'backspace' ? (
              <Delete className="h-4 w-4" />
            ) : (
              key
            )}
          </Button>
        ))}
        <Button
          variant="outline"
          className="h-12 col-span-3 font-semibold text-red-600 hover:text-red-700"
          onClick={() => handleKeypadClick('clear')}
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}
