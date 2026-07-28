import * as Cesium from 'cesium';

export interface MapProvider {
  name: string;
  priority: number;
  isAvailable: () => boolean;
  createImageryProvider: () => Promise<Cesium.ImageryProvider | null>;
  createTerrainProvider?: () => Promise<Cesium.TerrainProvider | null>;
  supports3DBuildings: boolean;
}

// Get environment variables
const getEnvVar = (key: string): string | undefined => {
  return (import.meta as any).env?.[key];
};

// Provider 1: Google Photorealistic 3D Tiles (if credentials available)
const googlePhotorealisticProvider: MapProvider = {
  name: 'Google Photorealistic 3D Tiles',
  priority: 1,
  isAvailable: () => {
    const apiKey = getEnvVar('VITE_GOOGLE_MAPS_API_KEY');
    return !!apiKey;
  },
  createImageryProvider: async () => {
    const apiKey = getEnvVar('VITE_GOOGLE_MAPS_API_KEY');
    if (!apiKey) return null;
    
    try {
      // Google 3D Tiles would be configured here when API is available
      // This is a placeholder for when Google provides public 3D Tiles API
      return null;
    } catch (error) {
      console.warn('Google Photorealistic 3D Tiles failed:', error);
      return null;
    }
  },
  supports3DBuildings: true
};

// Provider 2: Cesium Ion (if token available)
const cesiumIonProvider: MapProvider = {
  name: 'Cesium Ion',
  priority: 2,
  isAvailable: () => {
    const token = getEnvVar('VITE_CESIUM_ION_TOKEN');
    return !!token;
  },
  createImageryProvider: async () => {
    const token = getEnvVar('VITE_CESIUM_ION_TOKEN');
    if (!token) return null;
    
    try {
      return await Cesium.IonImageryProvider.fromAssetId(2);
    } catch (error) {
      console.warn('Cesium Ion imagery failed:', error);
      return null;
    }
  },
  createTerrainProvider: async () => {
    const token = getEnvVar('VITE_CESIUM_ION_TOKEN');
    if (!token) return null;
    
    try {
      return await Cesium.CesiumTerrainProvider.fromIonAssetId(1);
    } catch (error) {
      console.warn('Cesium Ion terrain failed:', error);
      return null;
    }
  },
  supports3DBuildings: true
};

// Provider 3: ArcGIS World Imagery (free, no API key required)
const arcGISProvider: MapProvider = {
  name: 'ArcGIS World Imagery',
  priority: 3,
  isAvailable: () => true, // Always available
  createImageryProvider: async () => {
    try {
      return await Cesium.ArcGisMapServerImageryProvider.fromUrl(
        'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
      );
    } catch (error) {
      console.warn('ArcGIS imagery failed:', error);
      return null;
    }
  },
  supports3DBuildings: false
};

// Provider 4: Bing Maps Aerial (if API key available)
const bingMapsProvider: MapProvider = {
  name: 'Bing Maps Aerial',
  priority: 4,
  isAvailable: () => {
    const apiKey = getEnvVar('VITE_BING_MAPS_API_KEY');
    return !!apiKey;
  },
  createImageryProvider: async () => {
    const apiKey = getEnvVar('VITE_BING_MAPS_API_KEY');
    if (!apiKey) return null;
    
    try {
      return await Cesium.BingMapsImageryProvider.fromUrl(
        'https://dev.virtualearth.net',
        {
          key: apiKey,
          mapStyle: Cesium.BingMapsStyle.AERIAL
        }
      );
    } catch (error) {
      console.warn('Bing Maps imagery failed:', error);
      return null;
    }
  },
  supports3DBuildings: false
};

// Provider 5: OpenStreetMap (free, no API key required)
const openStreetMapProvider: MapProvider = {
  name: 'OpenStreetMap',
  priority: 5,
  isAvailable: () => true, // Always available
  createImageryProvider: async () => {
    try {
      return new Cesium.OpenStreetMapImageryProvider({
        url: 'https://a.tile.openstreetmap.org/'
      });
    } catch (error) {
      console.warn('OpenStreetMap imagery failed:', error);
      return null;
    }
  },
  supports3DBuildings: false
};

// Provider 6: NASA Blue Marble (free, no API key required)
const nasaBlueMarbleProvider: MapProvider = {
  name: 'NASA Blue Marble',
  priority: 6,
  isAvailable: () => true, // Always available
  createImageryProvider: async () => {
    try {
      return new Cesium.UrlTemplateImageryProvider({
        url: 'https://tiles.arcgis.com/tiles/AJTFxQ7q0UaBvf8p/arcgis/rest/services/Blue_Marble_Next_Generation/MapServer/tile/{Level}/{Row}/{Col}',
        credit: 'NASA Blue Marble'
      });
    } catch (error) {
      console.warn('NASA Blue Marble imagery failed:', error);
      return null;
    }
  },
  supports3DBuildings: false
};

// All providers in priority order
const allProviders: MapProvider[] = [
  googlePhotorealisticProvider,
  cesiumIonProvider,
  arcGISProvider,
  bingMapsProvider,
  openStreetMapProvider,
  nasaBlueMarbleProvider
];

/**
 * Get the best available imagery provider
 * Tries providers in priority order and returns the first one that works
 */
export async function getBestImageryProvider(): Promise<Cesium.ImageryProvider | null> {
  console.log('Searching for best imagery provider...');
  
  for (const provider of allProviders) {
    if (provider.isAvailable()) {
      console.log(`Trying provider: ${provider.name}`);
      const imageryProvider = await provider.createImageryProvider();
      if (imageryProvider) {
        console.log(`Successfully loaded: ${provider.name}`);
        return imageryProvider;
      }
      console.warn(`Provider ${provider.name} failed, trying next...`);
    }
  }
  
  console.error('All imagery providers failed');
  return null;
}

/**
 * Get the best available terrain provider
 */
export async function getBestTerrainProvider(): Promise<Cesium.TerrainProvider | null> {
  console.log('Searching for best terrain provider...');
  
  for (const provider of allProviders) {
    if (provider.isAvailable() && provider.createTerrainProvider) {
      console.log(`Trying terrain from: ${provider.name}`);
      const terrainProvider = await provider.createTerrainProvider();
      if (terrainProvider) {
        console.log(`Successfully loaded terrain: ${provider.name}`);
        return terrainProvider;
      }
      console.warn(`Terrain from ${provider.name} failed, trying next...`);
    }
  }
  
  console.log('No terrain provider available, using default ellipsoid');
  return null;
}

/**
 * Check if any provider supports 3D buildings
 */
export function supports3DBuildings(): boolean {
  for (const provider of allProviders) {
    if (provider.isAvailable() && provider.supports3DBuildings) {
      return true;
    }
  }
  return false;
}

/**
 * Get the name of the active provider
 */
export async function getActiveProviderName(): Promise<string> {
  for (const provider of allProviders) {
    if (provider.isAvailable()) {
      const imageryProvider = await provider.createImageryProvider();
      if (imageryProvider) {
        return provider.name;
      }
    }
  }
  return 'Unknown';
}
