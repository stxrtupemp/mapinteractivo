import { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface PhotoUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function PhotoUploader({ files, onChange }: PhotoUploaderProps) {
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const valid = Array.from(incoming).filter((f) => f.type.startsWith('image/'));
      onChange([...files, ...valid]);
    },
    [files, onChange]
  );

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-gray-700">Añadir fotos</p>
      <label
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-lg py-6 cursor-pointer transition-colors
          ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}
      >
        <Upload size={20} className="text-gray-400" />
        <span className="text-xs text-gray-500">Arrastra fotos o haz clic para seleccionar</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </label>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, i) => (
            <div key={i} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-16 h-16 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
