import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

type Point = { lat: number; lng: number };
type Item = {
  _id: string;
  label: string;
  location: Point;
  paymentPerHour: number;
};

export function MapView({ items, center }: { items: Item[]; center: Point }) {
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={12} className="w-full h-[480px] rounded overflow-hidden">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((o) => (
        <Marker key={o._id} position={[o.location.lat, o.location.lng]}>
          <Popup>
            <div className="text-sm">
              <div className="font-medium">{o.label}</div>
              <div>${o.paymentPerHour}/h</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}


