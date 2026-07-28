import { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import { Country, MapState } from '../types';
import { getBestImageryProvider, getBestTerrainProvider, supports3DBuildings } from '../config/mapProviders';

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

    const initializeMap = async () => {
      try {
        // Set Cesium Ion access token if available
        const ionToken = (import.meta as any).env?.VITE_CESIUM_ION_TOKEN;
        if (ionToken) {
          Cesium.Ion.defaultAccessToken = ionToken;
        }

        const viewer = new Cesium.Viewer(mapContainerRef.current as HTMLElement, {
          baseLayerPicker: false,
          geocoder: false,
          homeButton: true,
          sceneModePicker: true,
          navigationHelpButton: false,
          animation: false,
          timeline: false,
          fullscreenButton: true,
          vrButton: false,
          infoBox: false,
          selectionIndicator: false,
          shadows: true,
          shouldAnimate: true,
          requestRenderMode: false,
          maximumRenderTimeChange: Infinity,
          // Enable full camera controls
          scene3DOnly: false
        });

        // Enable lighting based on sun position
        viewer.scene.globe.enableLighting = true;

        // Use provider system to get best imagery
        const imageryLayers = viewer.imageryLayers;
        imageryLayers.removeAll();

        const bestImageryProvider = await getBestImageryProvider();
        if (bestImageryProvider) {
          const imageryLayer = new Cesium.ImageryLayer(bestImageryProvider);
          imageryLayers.add(imageryLayer);
        }

        // Add OpenStreetMap labels on top (for all providers)
        const osmLabels = new Cesium.OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/',
          credit: '© OpenStreetMap contributors'
        });
        const osmLayer = new Cesium.ImageryLayer(osmLabels, {
          alpha: 0.7,
          brightness: 1.2
        });
        imageryLayers.add(osmLayer);

        // Use provider system to get best terrain
        const bestTerrainProvider = await getBestTerrainProvider();
        if (bestTerrainProvider) {
          viewer.terrainProvider = bestTerrainProvider;
        }

        // Enable 3D buildings if supported by provider
        if (supports3DBuildings()) {
          try {
            const osmBuildings = await Cesium.createOsmBuildingsAsync();
            viewer.scene.primitives.add(osmBuildings);
          } catch (buildingsErr) {
            console.warn('Failed to load 3D buildings:', buildingsErr);
          }
        }

        // Configure fog for depth
        viewer.scene.fog.enabled = true;
        viewer.scene.fog.density = 0.0001;

        // Remove camera restrictions for full exploration
        viewer.scene.screenSpaceCameraController.maximumZoomDistance = 0; // No limit
        viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100; // Minimum distance
        viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
        viewer.scene.screenSpaceCameraController.enableTranslate = true;
        viewer.scene.screenSpaceCameraController.enableZoom = true;
        viewer.scene.screenSpaceCameraController.enableRotate = true;
        viewer.scene.screenSpaceCameraController.enableTilt = true;
        viewer.scene.screenSpaceCameraController.enableLook = true;

        // Improve Level of Detail (LOD) for smooth zoom
        viewer.scene.globe.tileCacheSize = 1000; // Increase tile cache for better LOD
        viewer.scene.globe.maximumScreenSpaceError = 2; // Better detail at distance

        // Enable dynamic atmosphere
        if (viewer.scene.skyAtmosphere) {
          viewer.scene.skyAtmosphere.show = true;
          viewer.scene.skyAtmosphere.hueShift = 0;
          viewer.scene.skyAtmosphere.saturationShift = 0;
          viewer.scene.skyAtmosphere.brightnessShift = 0;
        }

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

        // Double-click to zoom in
        handler.setInputAction((click: any) => {
          const cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
          if (Cesium.defined(cartesian)) {
            viewer.camera.flyTo({
              destination: cartesian,
              orientation: {
                heading: viewer.camera.heading,
                pitch: viewer.camera.pitch,
                roll: viewer.camera.roll
              },
              duration: 1.5,
              easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT
            });
          }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        // Keyboard navigation
        const handleKeyDown = (e: KeyboardEvent) => {
          const camera = viewer.camera;
          const moveAmount = camera.positionCartographic.height * 0.1;
          const rotateAmount = Cesium.Math.toRadians(5);
          const tiltAmount = Cesium.Math.toRadians(5);

          switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
              camera.moveForward(moveAmount);
              break;
            case 'ArrowDown':
            case 's':
            case 'S':
              camera.moveBackward(moveAmount);
              break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
              camera.moveLeft(moveAmount);
              break;
            case 'ArrowRight':
            case 'd':
            case 'D':
              camera.moveRight(moveAmount);
              break;
            case 'q':
            case 'Q':
              camera.rotateLeft(rotateAmount);
              break;
            case 'e':
            case 'E':
              camera.rotateRight(rotateAmount);
              break;
            case 'r':
            case 'R':
              camera.lookUp(tiltAmount);
              break;
            case 'f':
            case 'F':
              camera.lookDown(tiltAmount);
              break;
            case '+':
            case '=':
              camera.zoomIn(moveAmount * 0.5);
              break;
            case '-':
            case '_':
              camera.zoomOut(moveAmount * 0.5);
              break;
            case 'Home':
              camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(0, 20, 10000000),
                orientation: {
                  heading: Cesium.Math.toRadians(0),
                  pitch: Cesium.Math.toRadians(-90),
                  roll: 0
                },
                duration: 2
              });
              break;
            case 'Escape':
              // Close panels (handled by parent component)
              break;
            case ' ':
              camera.cancelFlight();
              break;
          }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Auto-focus map on load
        mapContainerRef.current?.focus();

        return () => {
          handler.destroy();
          document.removeEventListener('keydown', handleKeyDown);
          viewer.destroy();
          viewerRef.current = null;
        };
      } catch (err) {
        console.error('Error initializing Cesium:', err);
        setError('Failed to initialize map. Please check console for details.');
      }
    };

    initializeMap();
  }, []);

  const selectCountry = (country: Country) => {
    if (viewerRef.current) {
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          country.coordinates.lng,
          country.coordinates.lat,
          500000
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
