export interface Country {
  name: string;
  officialName: string;
  capital: string;
  population: number;
  area: number;
  continent: string;
  currency: string;
  languages: string[];
  timezones: string[];
  flag: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isoCode: string;
  neighbors: string[];
  bounds: {
    minLat: number;
    minLng: number;
    maxLat: number;
    maxLng: number;
  };
  gdp?: number;
  elevation?: number;
}

export interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    name: string;
    iso_a2: string;
    [key: string]: any;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface GeoJSONData {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export interface MapState {
  selectedCountry: Country | null;
  hoveredCountry: Country | null;
  isGlobeMode: boolean;
  zoom: number;
  center: [number, number];
  pitch: number;
  bearing: number;
}

export interface MapStyle {
  id: string;
  name: string;
  url: string;
}
