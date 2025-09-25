import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
  height?: string;
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (location: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });
  return null;
}

export function LocationPicker({ onLocationSelect, initialLocation, height = '400px' }: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>(
    initialLocation || { lat: 42.6977, lng: 23.3219 } // Default to Sofia
  );

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        right: '10px',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(229, 231, 235, 0.5)',
        fontSize: '0.875rem',
        color: '#374151',
        textAlign: 'center'
      }}>
        📍 Click on the map to select your job location
      </div>
      
      <MapContainer
        center={selectedLocation}
        zoom={13}
        style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={selectedLocation} />
        <MapClickHandler onLocationSelect={handleLocationSelect} />
      </MapContainer>
      
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        right: '10px',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(229, 231, 235, 0.5)',
        fontSize: '0.875rem',
        color: '#374151'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            <strong>Selected Location:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </span>
          <button
            onClick={() => {
              const sofiaLocation = { lat: 42.6977, lng: 23.3219 };
              setSelectedLocation(sofiaLocation);
              onLocationSelect(sofiaLocation);
            }}
            style={{
              padding: '0.25rem 0.75rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '600',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(-1px)';
              target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = 'none';
            }}
          >
            Reset to Sofia
          </button>
        </div>
      </div>
    </div>
  );
}
