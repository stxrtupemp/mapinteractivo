export const googleMapsUrl = (lat: number, lon: number): string =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

export const wazeUrl = (lat: number, lon: number): string =>
  `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`;
