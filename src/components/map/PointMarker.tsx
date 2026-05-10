import { useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Point } from '../../types';

function createColoredIcon(color: string, isFocused: boolean) {
  const w = isFocused ? 32 : 26;
  const h = isFocused ? 44 : 36;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 32 44">
    <path d="M16 2 C8.82 2 3 7.82 3 15 C3 24.6 16 42 16 42 C16 42 29 24.6 29 15 C29 7.82 23.18 2 16 2 Z"
          fill="${color}" stroke="white" stroke-width="2.5"/>
    <circle cx="16" cy="15" r="5.5" fill="white"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h],
  });
}

interface PointMarkerProps {
  point: Point;
  color: string;
  isAdmin: boolean;
  isFocused: boolean;
  onClick: (point: Point) => void;
}

export function PointMarker({ point, color, isAdmin: _isAdmin, isFocused, onClick }: PointMarkerProps) {
  const map = useMap();
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (isFocused && markerRef.current) {
      map.setView([point.lat, point.lon], Math.max(map.getZoom(), 16), { animate: true });
    }
  }, [isFocused, map, point.lat, point.lon]);

  return (
    <Marker
      ref={markerRef}
      position={[point.lat, point.lon]}
      icon={createColoredIcon(color, isFocused)}
      eventHandlers={{ click: () => onClick(point) }}
    >
      <Popup>
        <strong>{point.title}</strong>
      </Popup>
    </Marker>
  );
}
