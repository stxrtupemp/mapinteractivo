import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoGalleryProps {
  urls: string[];
}

export function PhotoGallery({ urls }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!urls.length) return null;

  const prev = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + urls.length) % urls.length : null));
  const next = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % urls.length : null));

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {urls.map((url, i) => (
          <button
            key={url}
            onClick={() => setLightboxIndex(i)}
            className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity"
          >
            <img src={url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <img
            src={urls[lightboxIndex]}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          >
            <ChevronRight size={24} />
          </button>
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          >
            <X size={20} />
          </button>
          {urls.length > 1 && (
            <div className="absolute bottom-4 flex gap-1.5">
              {urls.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-colors ${i === lightboxIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
