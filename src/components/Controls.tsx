import { motion } from 'framer-motion';
import { Plus, Minus, Home, Compass, RotateCcw, Maximize2, Globe } from 'lucide-react';
import { MapState } from '../types';

interface ControlsProps {
  mapState: mapState;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleGlobe: () => void;
}

export const Controls = ({
  mapState,
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleGlobe
}: ControlsProps) => {
  return (
    <div className="controls-container">
      {/* Zoom Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="control-group zoom-controls"
      >
        <button onClick={onZoomIn} className="control-button" title="Zoom In">
          <Plus size={20} />
        </button>
        <div className="zoom-level">
          {Math.round(mapState.zoom)}
        </div>
        <button onClick={onZoomOut} className="control-button" title="Zoom Out">
          <Minus size={20} />
        </button>
      </motion.div>

      {/* Main Controls */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="control-group main-controls"
      >
        <button onClick={onReset} className="control-button" title="Reset View">
          <Home size={20} />
        </button>
        <button onClick={onToggleGlobe} className="control-button" title="Toggle Globe Mode">
          <Globe size={20} />
        </button>
        <button
          onClick={() => window.dispatchEvent(new Event('fullscreen'))}
          className="control-button"
          title="Fullscreen"
        >
          <Maximize2 size={20} />
        </button>
      </motion.div>

      {/* Compass */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="control-group compass"
      >
        <div className="compass-wrapper">
          <Compass
            size={32}
            className="compass-icon"
            style={{
              transform: `rotate(${-mapState.bearing}deg)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};
