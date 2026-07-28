import { useState, useCallback, useRef } from 'react';
import { WorldMap } from './components/WorldMap';
import { SearchBar } from './components/SearchBar';
import { CountryInfoPanel } from './components/CountryInfoPanel';
import { Tooltip } from './components/Tooltip';
import { Country } from './types';
import './App.css';

function App() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const worldMapRef = useRef<any>(null);

  const handleCountryClick = useCallback((country: Country) => {
    setSelectedCountry(country);
  }, []);

  const handleCountryHover = useCallback((country: Country | null) => {
    setHoveredCountry(country);
  }, []);

  const handleLocationSelect = useCallback((location: { lat: number; lng: number; name: string }) => {
    if (worldMapRef.current && worldMapRef.current.flyToLocation) {
      worldMapRef.current.flyToLocation(location.lat, location.lng);
    }
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (hoveredCountry) {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  }, [hoveredCountry]);

  return (
    <div className="app" onMouseMove={handleMouseMove}>
      <WorldMap
        ref={worldMapRef}
        onCountryClick={handleCountryClick}
        onCountryHover={handleCountryHover}
      />
      
      <div className="ui-overlay">
        <SearchBar onLocationSelect={handleLocationSelect} />
        
        <CountryInfoPanel
          country={selectedCountry}
          onClose={handleClosePanel}
        />
        
        {hoveredCountry && !selectedCountry && (
          <Tooltip
            country={hoveredCountry}
            position={tooltipPosition}
          />
        )}
      </div>
    </div>
  );
}

export default App;
