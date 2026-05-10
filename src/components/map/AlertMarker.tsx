import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { Alert } from '../../types';

const ALERT_SVG: Record<string, string> = {
  radar: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>`,
  danger: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
    <rect x="10.5" y="4" width="3" height="9.5" rx="1.5"/>
    <circle cx="12" cy="19" r="2"/>
  </svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
    <circle cx="12" cy="5" r="2"/>
    <rect x="10.5" y="10" width="3" height="9.5" rx="1.5"/>
  </svg>`,
};

function createAlertIcon(color: string, type: string) {
  const icon = ALERT_SVG[type] ?? ALERT_SVG.info;
  return L.divIcon({
    html: `<div style="background:${color};width:34px;height:34px;border-radius:50%;border:2.5px solid white;
           display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.35)">
           ${icon}</div>`,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -22],
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
