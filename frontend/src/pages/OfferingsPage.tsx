import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapView } from '../components/MapView';

type Offering = {
  _id: string;
  type: string;
  label: string;
  description?: string;
  location: { lat: number; lng: number };
  paymentPerHour: number;
  maxHours: number;
  applicationsCount: number;
};

export function OfferingsPage() {
  const [items, setItems] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [minPay, setMinPay] = useState('');
  const [maxPay, setMaxPay] = useState('');

  async function fetchData() {
    try {
      setLoading(true);
      const params: any = {};
      if (q) params.q = q;
      if (minPay) params.minPay = Number(minPay);
      if (maxPay) params.maxPay = Number(maxPay);
      const res = await axios.get('/api/offerings', { params });
      setItems(res.data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 grid md:grid-cols-2 gap-4">
      <div>
        <div className="flex gap-2 mb-3">
          <input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} className="border px-2 py-1 rounded w-full" />
          <input placeholder="Min $/h" value={minPay} onChange={(e) => setMinPay(e.target.value)} className="border px-2 py-1 rounded w-24" />
          <input placeholder="Max $/h" value={maxPay} onChange={(e) => setMaxPay(e.target.value)} className="border px-2 py-1 rounded w-24" />
          <button onClick={fetchData} className="border px-3 py-1 rounded">Filter</button>
        </div>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && items.length === 0 && <div>No offerings found.</div>}
        <ul className="space-y-3">
          {items.map((o) => (
            <li key={o._id} className="border rounded p-3">
              <div className="font-medium">{o.label}</div>
              <div className="text-sm text-gray-600">${o.paymentPerHour}/h · up to {o.maxHours}h · {o.applicationsCount} applicants</div>
              {o.description && <p className="text-sm mt-1">{o.description}</p>}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <MapView items={items} center={{ lat: 37.7749, lng: -122.4194 }} />
      </div>
    </div>
  );
}


