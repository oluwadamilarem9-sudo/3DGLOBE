import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, Globe, DollarSign, Clock, Languages, Flag, TrendingUp, Mountain } from 'lucide-react';
import { Country } from '../types';
import { formatNumber, formatArea, formatGDP } from '../utils/mapUtils';

interface CountryInfoPanelProps {
  country: Country | null;
  onClose: () => void;
}

export const CountryInfoPanel = ({ country, onClose }: CountryInfoPanelProps) => {
  if (!country) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="country-info-panel"
      >
        <div className="panel-header">
          <div className="panel-title">
            <span className="panel-flag">{country.flag}</span>
            <div>
              <h2 className="country-title">{country.name}</h2>
              <p className="country-subtitle">{country.officialName}</p>
            </div>
          </div>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <div className="panel-content">
          <div className="info-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <MapPin size={18} className="info-icon" />
                <div>
                  <div className="info-label">Capital</div>
                  <div className="info-value">{country.capital}</div>
                </div>
              </div>
              <div className="info-item">
                <Globe size={18} className="info-icon" />
                <div>
                  <div className="info-label">Continent</div>
                  <div className="info-value">{country.continent}</div>
                </div>
              </div>
              <div className="info-item">
                <Users size={18} className="info-icon" />
                <div>
                  <div className="info-label">Population</div>
                  <div className="info-value">{formatNumber(country.population)}</div>
                </div>
              </div>
              <div className="info-item">
                <Flag size={18} className="info-icon" />
                <div>
                  <div className="info-label">Area</div>
                  <div className="info-value">{formatArea(country.area)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3 className="section-title">Economy & Culture</h3>
            <div className="info-grid">
              <div className="info-item">
                <DollarSign size={18} className="info-icon" />
                <div>
                  <div className="info-label">Currency</div>
                  <div className="info-value">{country.currency}</div>
                </div>
              </div>
              <div className="info-item">
                <Languages size={18} className="info-icon" />
                <div>
                  <div className="info-label">Languages</div>
                  <div className="info-value">{country.languages.join(', ')}</div>
                </div>
              </div>
              <div className="info-item">
                <Clock size={18} className="info-icon" />
                <div>
                  <div className="info-label">Time Zones</div>
                  <div className="info-value">{country.timezones.join(', ')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3 className="section-title">Geographic Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <MapPin size={18} className="info-icon" />
                <div>
                  <div className="info-label">Coordinates</div>
                  <div className="info-value">
                    {country.coordinates.lat.toFixed(4)}°, {country.coordinates.lng.toFixed(4)}°
                  </div>
                </div>
              </div>
              <div className="info-item">
                <Flag size={18} className="info-icon" />
                <div>
                  <div className="info-label">ISO Code</div>
                  <div className="info-value">{country.isoCode}</div>
                </div>
              </div>
              {country.elevation && (
                <div className="info-item">
                  <Mountain size={18} className="info-icon" />
                  <div>
                    <div className="info-label">Highest Point</div>
                    <div className="info-value">{country.elevation} m</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {country.gdp && (
            <div className="info-section">
              <h3 className="section-title">Economy</h3>
              <div className="info-grid">
                <div className="info-item">
                  <TrendingUp size={18} className="info-icon" />
                  <div>
                    <div className="info-label">GDP</div>
                    <div className="info-value">{formatGDP(country.gdp)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {country.neighbors.length > 0 && (
            <div className="info-section">
              <h3 className="section-title">Bordering Countries</h3>
              <div className="neighbors-list">
                {country.neighbors.map((neighbor) => (
                  <span key={neighbor} className="neighbor-tag">
                    {neighbor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
