import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

type Point = { lat: number; lng: number };
type Item = {
  _id: string;
  label: string;
  location: Point;
  paymentPerHour: number;
};

export function MapView({ items, center }: { items: Item[]; center?: Point }) {
  // Default center to Sofia, Bulgaria
  const defaultCenter = { lat: 42.6977, lng: 23.3219 };
  const mapCenter = center || defaultCenter;
  
  // Filter out items with invalid locations
  const validItems = items.filter(item => 
    item && 
    item.location && 
    typeof item.location.lat === 'number' && 
    typeof item.location.lng === 'number' &&
    !isNaN(item.location.lat) && 
    !isNaN(item.location.lng)
  );

  if (validItems.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '600px',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(249, 250, 251, 0.5)',
        color: '#6b7280'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No valid locations to display</p>
          <p style={{ fontSize: '0.875rem' }}>Please check that job offerings have valid coordinates</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '600px',
      borderRadius: '1rem',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    }}>
      <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={13} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validItems.map((o) => (
          <Marker key={o._id} position={[o.location.lat, o.location.lng]}>
            <Popup>
              <div style={{ padding: '1rem', minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <h3 style={{ 
                    fontWeight: 'bold', 
                    color: '#1f2937', 
                    fontSize: '1.125rem', 
                    lineHeight: '1.25',
                    margin: 0,
                    flex: 1
                  }}>
                    {o.label}
                  </h3>
                  <div style={{ marginLeft: '0.75rem', textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {o.paymentPerHour} BGN/h
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      up to {o.maxHours}h
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <svg width="16" height="16" fill="#3b82f6" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Sofia, Bulgaria
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <svg width="16" height="16" fill="#8b5cf6" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {o.applicationsCount} applicants
                  </span>
                </div>
                <button style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: 'white',
                  fontWeight: '600',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)';
                }}>
                  Apply Now
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}


