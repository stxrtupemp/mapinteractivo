export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string;
  parent_id: string | null;
  created_at: string;
}

export interface Point {
  id: string;
  title: string;
  description: string | null;
  suggestion: string | null;
  lat: number;
  lon: number;
  category_id: string | null;
  subcategory_id: string | null;
  photo_urls: string[];
  created_at: string;
}

export interface Alert {
  id: string;
  type: 'radar' | 'danger' | 'info' | string;
  title: string;
  description: string | null;
  lat: number;
  lon: number;
  color: string;
  created_at: string;
}

export interface Zone {
  id: string;
  name: string;
  description: string | null;
  color: string;
  opacity: number;
  geojson: GeoJSON.Polygon;
  created_at: string;
}
