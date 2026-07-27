import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';
import { Country } from '../types';
import { formatNumber } from '../utils/mapUtils';

interface TooltipProps {
  country: Country | null;
  position: { x: number; y: number };
}

export const Tooltip = ({ country, position }: TooltipProps) => {
  if (!country) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.15 }}
        className="tooltip"
        style={{
          left: position.x,
          top: position.y
        }}
      >
        <div className="tooltip-header">
          <span className="tooltip-flag">{country.flag}</span>
          <span className="tooltip-name">{country.name}</span>
        </div>
        <div className="tooltip-body">
          <div className="tooltip-item">
            <MapPin size={14} className="tooltip-icon" />
            <span>{country.capital}</span>
          </div>
          <div className="tooltip-item">
            <Users size={14} className="tooltip-icon" />
            <span>{formatNumber(country.population)}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
