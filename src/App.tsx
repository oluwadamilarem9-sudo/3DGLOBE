import { useState, useCallback } from 'react';
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

  const handleCountryClick = useCallback((country: Country) => {
    setSelectedCountry(country);
  }, []);

  const handleCountryHover = useCallback((country: Country | null) => {
    setHoveredCountry(country);
  }, []);

  const handleSearchSelect = useCallback((country: Country) => {
    setSelectedCountry(country);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (hoveredCountry) {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  }, [hoveredCountry]);

  return (
    <div className="app" onMouseMove={handleMouseMove}>
      <WorldMap
        onCountryClick={handleCountryClick}
        onCountryHover={handleCountryHover}
      />
      
      <SearchBar onCountrySelect={handleSearchSelect} />
      
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
  );
}

export default App;
