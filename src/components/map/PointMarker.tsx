import { useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Point } from '../../types';

function createColoredIcon(color: string, isFocused: boolean) {
  const size = isFocused ? 36 : 28;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
      <circle cx="12" cy="10" r="6" fill="${color}" stroke="white" stroke-width="2"/>
      <path d="M12 24 L6 14 Q12 8 18 14 Z" fill="${color}"/>
      <circle cx="12" cy="10" r="2.5" fill="white"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
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
