import { useState } from 'react';
import { ClipboardPaste } from 'lucide-react';

interface CoordsPasteFieldProps {
  onParse: (lat: number, lon: number) => void;
}

function parseCoords(raw: string): [number, number] | null {
  // Acepta: "37.8308, -0.7870" · "37.8308 -0.7870" · "37.8308,-0.7870"
  const parts = raw.trim().split(/[\s,]+/).filter(Boolean);
  if (parts.length < 2) return null;
  const lat = parseFloat(parts[0]);
  const lon = parseFloat(parts[1]);
  if (isNaN(lat) || isNaN(lon)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return [lat, lon];
}

export function CoordsPasteField({ onParse }: CoordsPasteFieldProps) {
  const [raw, setRaw] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');

  const handle = (value: string) => {
    setRaw(value);
    if (!value.trim()) { setStatus('idle'); return; }
    const result = parseCoords(value);
    if (result) {
      onParse(result[0], result[1]);
      setStatus('ok');
    } else {
      setStatus(value.trim().length > 4 ? 'error' : 'idle');
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        <ClipboardPaste size={14} className="text-gray-400" />
        Pegar coordenadas de Maps
      </label>
      <input
        value={raw}
        onChange={(e) => handle(e.target.value)}
        onPaste={(e) => {
          // Procesa al pegar sin esperar blur
          const pasted = e.clipboardData.getData('text');
          handle(pasted);
        }}
        placeholder="37.83080013502256, -0.7870026742236361"
        className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          ${status === 'error' ? 'border-red-400 bg-red-50' : ''}
          ${status === 'ok' ? 'border-green-400 bg-green-50' : ''}
          ${status === 'idle' ? 'border-gray-300' : ''}`}
      />
      <p className="text-xs text-gray-400">
        {status === 'ok' && <span className="text-green-600 font-medium">✓ Coordenadas aplicadas</span>}
        {status === 'error' && <span className="text-red-500">Formato inválido — usa lat, lon</span>}
        {status === 'idle' && 'Copia las coordenadas desde Google Maps y pégalas aquí'}
      </p>
    </div>
  );
}
