import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface JobLocationMapProps {
  location: { lat: number; lng: number };
  jobTitle: string;
  height?: string;
}

export function JobLocationMap({ location, jobTitle, height = '200px' }: JobLocationMapProps) {
  return (
    <div style={{ width: '100%', height, borderRadius: '0.5rem', overflow: 'hidden' }}>
      <MapContainer
        center={location}
        zoom={15}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={location}>
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <strong>{jobTitle}</strong>
              <br />
              <small>Job Location</small>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
