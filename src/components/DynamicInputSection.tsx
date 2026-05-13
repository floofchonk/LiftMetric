import { Plus, Trash2, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export interface DynamicLineItem {
  id: string;
  label: string;
  value: number;
  description?: string;
}

interface DynamicInputSectionProps {
  title: string;
  items: DynamicLineItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: 'label' | 'value' | 'description', value: string | number) => void;
  type: 'cost' | 'benefit';
}

export default function DynamicInputSection({
  title,
  items,
  onAdd,
  onRemove,
  onChange,
  type,
}: DynamicInputSectionProps) {
  const handleValueChange = (id: string, rawValue: string) => {
    // Remove any non-numeric characters except decimal point
    const cleaned = rawValue.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    const formatted = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('')
      : cleaned;

    // Convert to number, default to 0 if invalid
    const numValue = parseFloat(formatted) || 0;
    onChange(id, 'value', numValue);
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const totalValue = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add custom {type === 'cost' ? 'costs' : 'benefits'} to refine your ROI calculation
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total</div>
          <div className={`text-2xl font-bold ${type === 'cost' ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(totalValue)}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Label Input */}
              <div className="md:col-span-4">
                <Label htmlFor={`label-${item.id}`} className="text-sm font-medium text-gray-700">
                  Label
                </Label>
                <Input
                  id={`label-${item.id}`}
                  type="text"
                  value={item.label}
                  onChange={(e) => onChange(item.id, 'label', e.target.value)}
                  placeholder="e.g., Software Licensing"
                  className="mt-1"
                />
              </div>

              {/* Value Input */}
              <div className="md:col-span-3">
                <Label htmlFor={`value-${item.id}`} className="text-sm font-medium text-gray-700">
                  Amount ($)
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id={`value-${item.id}`}
                    type="text"
                    inputMode="decimal"
                    value={item.value || ''}
                    onChange={(e) => handleValueChange(item.id, e.target.value)}
                    placeholder="0"
                    className="pl-7"
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="md:col-span-4">
                <Label htmlFor={`desc-${item.id}`} className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Description
                  <Info className="w-3 h-3 text-gray-400" />
                </Label>
                <Textarea
                  id={`desc-${item.id}`}
                  value={item.description || ''}
                  onChange={(e) => onChange(item.id, 'description', e.target.value)}
                  placeholder="Optional notes..."
                  className="mt-1 resize-none"
                  rows={1}
                />
              </div>

              {/* Remove Button */}
              <div className="md:col-span-1 flex items-end justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(item.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No custom {type === 'cost' ? 'costs' : 'benefits'} added yet</p>
            <p className="text-xs mt-1">Click the button below to add your first item</p>
          </div>
        )}

        {/* Add Button */}
        <Button
          type="button"
          onClick={onAdd}
          variant="outline"
          className="w-full border-dashed border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {type === 'cost' ? 'Cost' : 'Benefit'} Item
        </Button>
      </div>
    </div>
  );
}
