# World Map Explorer - Interactive 3D Globe

A modern, responsive web application that displays the entire Earth with realistic satellite-style mapping, allowing users to explore countries with smooth animations and detailed information.

![World Map Explorer](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

## Features

- **Interactive World Map**: Full-screen interactive globe/flat map with smooth zoom and pan
- **Realistic Satellite Imagery**: High-quality satellite tiles (MapTiler/Esri) with OpenStreetMap fallback
- **Country Selection**: Click any country to zoom in and view detailed information
- **Country Information Panel**: Displays comprehensive data including:
  - Country name and official name
  - Capital city
  - Population and area
  - Continent and currency
  - Languages and time zones
  - Geographic coordinates
  - ISO codes and neighboring countries
- **Search Functionality**: Autocomplete search to quickly find any country
- **Hover Effects**: Country highlighting with tooltips showing quick info
- **Smooth Animations**: Framer Motion powered transitions for panels, buttons, and camera movements
- **Modern UI**: Glassmorphism design with dark theme, gradients, and professional typography
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Globe Mode**: Toggle between flat map and 3D globe projection
- **Zoom Controls**: Easy zoom in/out with compass and reset view buttons

## Tech Stack

- **React 18.3** - UI framework
- **TypeScript 5.5** - Type safety
- **Vite 5.4** - Build tool and dev server
- **MapLibre GL JS 4.5** - Map rendering engine
- **Tailwind CSS 3.4** - Styling
- **Framer Motion 11.3** - Animations
- **Lucide React 0.4** - Icons

## Data Sources

- **GeoJSON Country Boundaries**: Natural Earth data via GitHub
- **Satellite Imagery**: MapTiler Satellite (with API key) or OpenStreetMap (fallback)
- **Country Data**: Manually curated dataset with 20+ major countries

## Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd devinproj
```

2. Install dependencies:
```bash
npm install
```

3. Configure API keys (optional but recommended for satellite imagery):

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and add your MapTiler API key:
```
VITE_MAPTILER_API_KEY=your_maptiler_api_key_here
```

Get a free API key at: https://www.maptiler.com/cloud/

**Note**: Without an API key, the app will fall back to OpenStreetMap tiles (standard map style instead of satellite).

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
devinproj/
├── src/
│   ├── components/          # React components
│   │   ├── WorldMap.tsx    # Main map component
│   │   ├── SearchBar.tsx   # Search with autocomplete
│   │   ├── CountryInfoPanel.tsx  # Country details panel
│   │   ├── Controls.tsx    # Zoom and navigation controls
│   │   └── Tooltip.tsx     # Hover tooltip
│   ├── hooks/              # Custom React hooks
│   │   └── useMap.ts       # Map initialization and state
│   ├── utils/              # Utility functions
│   │   └── mapUtils.ts     # Map helper functions
│   ├── data/               # Static data
│   │   └── countries.ts    # Country information dataset
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Shared types
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
├── tailwind.config.js      # Tailwind CSS config
└── README.md               # This file
```

## Usage

### Basic Navigation

- **Pan**: Click and drag to move around the map
- **Zoom**: Use mouse wheel or the +/- buttons
- **Rotate**: In globe mode, click and drag to rotate the globe
- **Select Country**: Click on any country to zoom in and view details
- **Search**: Use the search bar to find countries by name or capital

### Controls

- **Home Button**: Reset view to world overview
- **Globe Button**: Toggle between flat map and 3D globe
- **Fullscreen**: Enter fullscreen mode
- **Compass**: Shows current bearing/rotation

### Country Information

When you select a country, an information panel slides in from the right showing:
- Basic information (capital, continent, population, area)
- Economy & culture (currency, languages, time zones)
- Geographic details (coordinates, ISO code)
- Bordering countries

## Customization

### Adding More Countries

Edit `src/data/countries.ts` to add more country data:

```typescript
{
  name: 'Country Name',
  officialName: 'Official Country Name',
  capital: 'Capital City',
  population: 12345678,
  area: 123456,
  continent: 'Continent Name',
  currency: 'Currency Name (Code)',
  languages: ['Language 1', 'Language 2'],
  timezones: ['UTC+X'],
  flag: '🏳️',
  coordinates: { lat: 0.0, lng: 0.0 },
  isoCode: 'XX',
  neighbors: ['Neighbor 1', 'Neighbor 2'],
  bounds: { minLat: 0, minLng: 0, maxLat: 0, maxLng: 0 }
}
```

### Changing Map Style

Edit `src/utils/mapUtils.ts` to modify the map style:

```typescript
export const getMapStyle = (apiKey?: string): maplibregl.StyleSpecification => {
  // Customize the style object
}
```

### Styling

All styles use Tailwind CSS. Modify `tailwind.config.js` for global theme changes or edit component CSS files for component-specific styles.

## API Keys

### MapTiler (Recommended)

1. Sign up at https://www.maptiler.com/cloud/
2. Create a new project
3. Copy your API key
4. Add it to `.env`: `VITE_MAPTILER_API_KEY=your_key_here`

### Mapbox (Alternative)

1. Sign up at https://www.mapbox.com/
2. Create an access token
3. Add it to `.env`: `VITE_MAPBOX_API_KEY=your_token_here`

## Troubleshooting

### Map not loading

- Check browser console for errors
- Verify API key is correctly set in `.env`
- Ensure you're using a supported browser (Chrome, Firefox, Safari, Edge)
- Try clearing browser cache

### Satellite imagery not showing

- Verify your MapTiler API key is valid
- Check that you have sufficient API quota
- The app will fall back to OpenStreetMap if no API key is provided

### Build errors

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure Node.js version is 18 or higher

## Performance

The application is optimized for performance:
- Lazy loading of map tiles
- Efficient React rendering with useCallback
- Smooth 60 FPS animations
- Optimized GeoJSON data handling

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- MapLibre GL JS for the excellent map rendering engine
- MapTiler for satellite imagery tiles
- Natural Earth for geographic data
- OpenStreetMap for fallback map tiles
- Framer Motion for smooth animations
- Lucide for beautiful icons

## Future Enhancements

Potential features for future versions:
- Weather overlay
- 3D terrain and buildings
- Flight paths visualization
- Day/night cycle
- More countries in the dataset
- Offline mode
- Custom markers and annotations
- Sharing and embedding
- Historical map views
