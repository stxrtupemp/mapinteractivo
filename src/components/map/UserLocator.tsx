import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { MAP_CENTER, MAP_ZOOM } from '../../lib/constants';

export function UserLocator() {
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.setView([pos.coords.latitude, pos.coords.longitude], MAP_ZOOM, { animate: true });
      },
      () => {
        // On error or denied: stay on San Pedro del Pinatar
        map.setView(MAP_CENTER, MAP_ZOOM);
      },
      { timeout: 8000 }
    );
  }, [map]);

  return null;
}
