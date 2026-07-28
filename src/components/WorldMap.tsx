import { useEffect, forwardRef, useImperativeHandle } from 'react';
import * as Cesium from 'cesium';
import { useMap } from '../hooks/useMap';
import { Country } from '../types';
import { getCountryByName } from '../data/countries';
import './WorldMap.css';

interface WorldMapProps {
  onCountryClick?: (country: Country) => void;
  onCountryHover?: (country: Country | null) => void;
}

export interface WorldMapRef {
  flyToLocation: (lat: number, lng: number) => void;
}

export const WorldMap = forwardRef<WorldMapRef, WorldMapProps>(({ onCountryClick, onCountryHover }, ref) => {
  const {
    mapContainerRef,
    mapRef
  } = useMap({
    onCountryClick,
    onCountryHover
  });

  useImperativeHandle(ref, () => ({
    flyToLocation: (lat: number, lng: number) => {
      if (mapRef.current) {
        mapRef.current.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(lng, lat, 100000),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-45),
            roll: 0
          },
          duration: 2
        });
      }
    }
  }));

  useEffect(() => {
    const handleCountryClick = (e: any) => {
      if (onCountryClick && e.detail.name) {
        const country = getCountryByName(e.detail.name);
        if (country) {
          onCountryClick(country);
        }
      }
    };

    const handleCountryHover = (e: any) => {
      if (onCountryHover) {
        if (e.detail.name) {
          const country = getCountryByName(e.detail.name);
          onCountryHover(country || null);
        } else {
          onCountryHover(null);
        }
      }
    };

    window.addEventListener('country-click', handleCountryClick);
    window.addEventListener('country-hover', handleCountryHover);

    return () => {
      window.removeEventListener('country-click', handleCountryClick);
      window.removeEventListener('country-hover', handleCountryHover);
    };
  }, [onCountryClick, onCountryHover]);

  return (
    <div className="world-map-container">
      <div ref={mapContainerRef} className="cesium-container" tabIndex={0} />
    </div>
  );
});
