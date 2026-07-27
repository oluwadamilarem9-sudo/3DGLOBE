import { useEffect } from 'react';
import { useMap } from '../hooks/useMap';
import { Country } from '../types';
import { getCountryByName } from '../data/countries';
import './WorldMap.css';

interface WorldMapProps {
  onCountryClick?: (country: Country) => void;
  onCountryHover?: (country: Country | null) => void;
}

export const WorldMap = ({ onCountryClick, onCountryHover }: WorldMapProps) => {
  const {
    mapContainerRef
  } = useMap({
    onCountryClick,
    onCountryHover
  });

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
      <div ref={mapContainerRef} className="cesium-container" />
    </div>
  );
};
