interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#64748b',
  '#dc2626', '#16a34a', '#2563eb', '#9333ea', '#ca8a04',
];

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <div className="flex flex-wrap gap-1.5">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110
              ${value === color ? 'border-gray-900 scale-110' : 'border-transparent'}`}
            style={{ backgroundColor: color }}
          />
        ))}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded cursor-pointer border border-gray-300"
          title="Color personalizado"
        />
      </div>
    </div>
  );
}
