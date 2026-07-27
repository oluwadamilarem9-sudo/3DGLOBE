import { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import { Country, MapState } from '../types';

interface UseMapOptions {
  onCountryClick?: (country: Country) => void;
  onCountryHover?: (country: Country | null) => void;
}

export const useMap = (options: UseMapOptions = {}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [mapState, setMapState] = useState<MapState>({
    selectedCountry: null,
    hoveredCountry: null,
    isGlobeMode: true,
    zoom: 10000000,
    center: [0, 20],
    pitch: 0,
    bearing: 0
  });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || viewerRef.current) return;

    try {
      // Set Cesium Ion access token if available
      const ionToken = (import.meta as any).env?.VITE_CESIUM_ION_TOKEN;
      if (ionToken) {
        Cesium.Ion.defaultAccessToken = ionToken;
      }

      const viewer = new Cesium.Viewer(mapContainerRef.current, {
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        infoBox: false,
        selectionIndicator: false,
        shadows: true,
        shouldAnimate: true
      });

      // Enable lighting based on sun position
      viewer.scene.globe.enableLighting = true;

      // Set initial view
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(0, 20, 10000000),
        duration: 0
      });

      viewerRef.current = viewer;

      // Mark as loaded immediately
      setIsMapLoaded(true);

      // Handle click events for country selection
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((click: any) => {
        const pickedObject = viewer.scene.pick(click.position);
        if (Cesium.defined(pickedObject) && pickedObject instanceof Cesium.Entity) {
          const name = pickedObject.name;
          if (name && options.onCountryClick) {
            const event = new CustomEvent('country-click', { detail: { name } });
            window.dispatchEvent(event);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      return () => {
        handler.destroy();
        viewer.destroy();
        viewerRef.current = null;
      };
    } catch (err) {
      console.error('Error initializing Cesium:', err);
      setError('Failed to initialize map. Please check console for details.');
    }
  }, []);

  const selectCountry = (country: Country) => {
    if (viewerRef.current) {
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          country.coordinates.lng,
          country.coordinates.lat,
          2000000
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45),
          roll: 0
        },
        duration: 2
      });
      setMapState(prev => ({ ...prev, selectedCountry: country }));
    }
  };

  const hoverCountry = (country: Country | null) => {
    setMapState(prev => ({ ...prev, hoveredCountry: country }));
  };

  const resetView = () => {
    if (viewerRef.current) {
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(0, 20, 10000000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: 0
        },
        duration: 2
      });
      setMapState(prev => ({ ...prev, selectedCountry: null }));
    }
  };

  const zoomIn = () => {
    if (viewerRef.current) {
      viewerRef.current.camera.zoomIn(viewerRef.current.camera.positionCartographic.height * 0.5);
    }
  };

  const zoomOut = () => {
    if (viewerRef.current) {
      viewerRef.current.camera.zoomOut(viewerRef.current.camera.positionCartographic.height * 0.5);
    }
  };

  const setPitch = (pitch: number) => {
    if (viewerRef.current) {
      viewerRef.current.camera.setView({
        orientation: {
          heading: viewerRef.current.camera.heading,
          pitch: Cesium.Math.toRadians(pitch),
          roll: viewerRef.current.camera.roll
        }
      });
    }
  };

  const toggleGlobeMode = () => {
    if (viewerRef.current) {
      const currentMode = viewerRef.current.scene.mode;
      const newMode = currentMode === Cesium.SceneMode.SCENE3D 
        ? Cesium.SceneMode.SCENE2D 
        : Cesium.SceneMode.SCENE3D;
      viewerRef.current.scene.mode = newMode;
      setMapState(prev => ({ ...prev, isGlobeMode: newMode === Cesium.SceneMode.SCENE3D }));
    }
  };

  return {
    mapContainerRef,
    mapRef: viewerRef,
    mapState,
    isMapLoaded,
    error,
    selectCountry,
    hoverCountry,
    resetView,
    zoomIn,
    zoomOut,
    setPitch,
    toggleGlobeMode
  };
};
