import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { Alert } from '../../types';

function createAlertIcon(color: string, type: string) {
  const symbol = type === 'radar' ? '📷' : type === 'danger' ? '⚠️' : 'ℹ️';
  return L.divIcon({
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;border:2px solid white;
           display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3)">
           ${symbol}</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

interface AlertMarkerProps {
  alert: Alert;
  isAdmin: boolean;
  onClick: (alert: Alert) => void;
}

export function AlertMarker({ alert, isAdmin: _isAdmin, onClick }: AlertMarkerProps) {
  return (
    <Marker
      position={[alert.lat, alert.lon]}
      icon={createAlertIcon(alert.color, alert.type)}
      eventHandlers={{ click: () => onClick(alert) }}
    >
      <Popup>
        <strong>{alert.title}</strong>
        {alert.description && <p className="text-sm mt-1">{alert.description}</p>}
      </Popup>
    </Marker>
  );
}
