import { useCallback } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { MAP_CENTER, MAP_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../../lib/constants';
import { Point, Alert, Zone, Category } from '../../types';
import { PointMarker } from './PointMarker';
import { AlertMarker } from './AlertMarker';
import { ZonePolygon } from './ZonePolygon';
import { DrawControl } from './DrawControl';
import { UserLocator } from './UserLocator';
import { useUIStore } from '../../store/uiStore';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

interface MapClickHandlerProps {
  onMapClick: (lat: number, lon: number) => void;
}

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface MapViewProps {
  points: Point[];
  alerts: Alert[];
  zones: Zone[];
  categories: Category[];
  isAdmin: boolean;
  onPointClick: (point: Point) => void;
  onAlertClick: (alert: Alert) => void;
  onZoneClick: (zone: Zone) => void;
  onMapClick: (lat: number, lon: number) => void;
  onZoneDrawn: (geojson: GeoJSON.Polygon) => void;
  focusPointId?: string | null;
}

export function MapView({
  points,
  alerts,
  zones,
  categories,
  isAdmin,
  onPointClick,
  onAlertClick,
  onZoneClick,
  onMapClick,
  onZoneDrawn,
  focusPointId,
}: MapViewProps) {
  const { showAlerts, showZones, addingPointMode, addingAlertMode, drawingZoneMode } =
    useUIStore();

  const getCategoryColor = useCallback(
    (categoryId: string | null) => {
      if (!categoryId) return '#64748b';
      return categories.find((c) => c.id === categoryId)?.color ?? '#64748b';
    },
    [categories]
  );

  const isClickMode = addingPointMode || addingAlertMode;

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      className={`w-full h-full ${isClickMode ? 'cursor-crosshair' : ''}`}
      zoomControl={true}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

      <UserLocator />

      {isClickMode && <MapClickHandler onMapClick={onMapClick} />}

      {points.map((point) => (
        <PointMarker
          key={point.id}
          point={point}
          color={getCategoryColor(point.category_id)}
          isAdmin={isAdmin}
          isFocused={focusPointId === point.id}
          onClick={onPointClick}
        />
      ))}

      {showAlerts &&
        alerts.map((alert) => (
          <AlertMarker
            key={alert.id}
            alert={alert}
            isAdmin={isAdmin}
            onClick={onAlertClick}
          />
        ))}

      {showZones &&
        zones.map((zone) => (
          <ZonePolygon
            key={zone.id}
            zone={zone}
            isAdmin={isAdmin}
            onClick={onZoneClick}
          />
        ))}

      {isAdmin && drawingZoneMode && <DrawControl onZoneDrawn={onZoneDrawn} />}
    </MapContainer>
  );
}
