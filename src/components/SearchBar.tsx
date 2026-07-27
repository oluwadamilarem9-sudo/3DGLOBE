import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Country } from '../types';
import { searchCountries } from '../data/countries';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onCountrySelect: (country: Country) => void;
}

export const SearchBar = ({ onCountrySelect }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchCountries(query);
      setResults(filtered.slice(0, 8)); // Limit to 8 results
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
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

  const handleSelect = (country: Country) => {
    onCountrySelect(country);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="search-bar-container">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search countries..."
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
            {results.map((country) => (
              <div
                key={country.isoCode}
                onClick={() => handleSelect(country)}
                className="search-result-item"
              >
                <span className="country-flag">{country.flag}</span>
                <div className="country-info">
                  <div className="country-name">{country.name}</div>
                  <div className="country-capital">{country.capital}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
