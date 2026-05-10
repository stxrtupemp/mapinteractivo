import { Polygon, Popup } from 'react-leaflet';
import { Zone } from '../../types';

interface ZonePolygonProps {
  zone: Zone;
  isAdmin: boolean;
  onClick: (zone: Zone) => void;
}

export function ZonePolygon({ zone, isAdmin: _isAdmin, onClick }: ZonePolygonProps) {
  const positions = zone.geojson.coordinates[0].map(
    ([lon, lat]) => [lat, lon] as [number, number]
  );

  return (
    <Polygon
      positions={positions}
      pathOptions={{
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: zone.opacity,
        weight: 2,
      }}
      eventHandlers={{ click: () => onClick(zone) }}
    >
      <Popup>
        <strong>{zone.name}</strong>
        {zone.description && <p className="text-sm mt-1">{zone.description}</p>}
      </Popup>
    </Polygon>
  );
}
