import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';

interface DrawControlProps {
  onZoneDrawn: (geojson: GeoJSON.Polygon) => void;
}

export function DrawControl({ onZoneDrawn }: DrawControlProps) {
  const map = useMap();
  // Ref keeps the latest callback without re-running the effect
  const callbackRef = useRef(onZoneDrawn);
  callbackRef.current = onZoneDrawn;

  useEffect(() => {
    // Create fresh instances every mount — avoids stale-ref issues with StrictMode
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: { featureGroup: drawnItems, remove: false },
      draw: {
        polygon: {
          shapeOptions: { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.3 },
          showArea: false,
        },
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
      },
    });

    map.addControl(drawControl);

    // Auto-start drawing so the user doesn't need to click the toolbar button
    const polygonHandler = new (L.Draw as unknown as {
      Polygon: new (m: L.Map, opts?: object) => { enable(): void; disable(): void };
    }).Polygon(map, {
      shapeOptions: { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.3 },
    });
    polygonHandler.enable();

    const handler = (e: L.LeafletEvent) => {
      const event = e as L.DrawEvents.Created;
      if (event.layerType === 'polygon') {
        drawnItems.addLayer(event.layer);
        const layer = event.layer as L.Polygon;
        const geojson = layer.toGeoJSON().geometry as GeoJSON.Polygon;
        callbackRef.current(geojson);
      }
    };

    // Use string literal — more reliable than L.Draw.Event.CREATED across bundlers
    map.on('draw:created', handler);

    return () => {
      map.off('draw:created', handler);
      // Close over local drawControl — safe even in StrictMode double-invoke
      try { map.removeControl(drawControl); } catch (_) { /* already removed */ }
      try { map.removeLayer(drawnItems); } catch (_) { /* already removed */ }
      try { polygonHandler.disable(); } catch (_) { /* already disabled */ }
    };
  }, [map]); // map is stable; onZoneDrawn handled via ref above

  return null;
}
