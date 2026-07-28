import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  display_name: string;
  lat: number;
  lon: number;
  type: string;
  class: string;
}

interface SearchBarProps {
  onLocationSelect: (location: { lat: number; lng: number; name: string }) => void;
}

export const SearchBar = ({ onLocationSelect }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchLocations = async () => {
      if (query.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&addressdetails=1`
        );
        const data: SearchResult[] = await response.json();
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    onLocationSelect({
      lat: Number(result.lat),
      lng: Number(result.lon),
      name: result.display_name
    });
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const getIcon = () => {
    return <MapPin size={16} className="text-blue-400" />;
  };

  const formatDisplayName = (name: string) => {
    // Remove country code and format nicely
    const parts = name.split(',').map(p => p.trim());
    if (parts.length > 3) {
      return parts.slice(0, 3).join(', ') + '...';
    }
    return name;
  };

  return (
    <div ref={searchRef} className="search-bar-container">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search locations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          onFocus={() => query && setIsOpen(true)}
        />
        {query && (
          <button onClick={handleClear} className="clear-button">
            <X size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="search-results"
          >
            {results.map((result, index) => (
              <div
                key={index}
                onClick={() => handleSelect(result)}
                className="search-result-item"
              >
                {getIcon()}
                <div className="country-info">
                  <div className="country-name">{formatDisplayName(result.display_name)}</div>
                  <div className="country-capital capitalize">{result.type}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="search-results"
          >
            <div className="p-4 text-gray-400 text-center">Searching...</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
