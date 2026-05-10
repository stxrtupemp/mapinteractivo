export const MAP_CENTER: [number, number] = [37.8203, -0.7806];
export const MAP_ZOOM = 14;
export const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const ADMIN_PATH = (import.meta.env.VITE_ADMIN_PATH as string | undefined) ?? 'admin';

export const DEFAULT_CATEGORY_COLOR = '#3b82f6';
export const DEFAULT_ALERT_COLOR = '#ef4444';
export const DEFAULT_ZONE_COLOR = '#ef4444';
export const DEFAULT_ZONE_OPACITY = 0.35;
