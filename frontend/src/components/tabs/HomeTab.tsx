import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapView } from '../MapView';

type Offering = {
  _id: string;
  type: string;
  label: string;
  description?: string;
  location: { lat: number; lng: number };
  paymentPerHour: number;
  maxHours: number;
  applicationsCount: number;
  createdAt: string;
  requestor?: {
    username: string;
    rating: number;
  };
};

type User = {
  _id: string;
  username: string;
  email: string;
  rating: number;
  completedJobs: number;
  createdJobs: number;
  createdAt: string;
};

export function HomeTab() {
  const [promoOfferings, setPromoOfferings] = useState<Offering[]>([]);
  const [recentOfferings, setRecentOfferings] = useState<Offering[]>([]);
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // Fetch all offerings for the map and other sections
        const offeringsResponse = await axios.get('/api/offerings', {
          params: { limit: 20, sortBy: 'date', sortOrder: 'desc' }
        });
        
        const allOfferings = offeringsResponse.data.offerings || offeringsResponse.data;
        
        // Get 3 random offerings for promo section
        const shuffled = [...allOfferings].sort(() => 0.5 - Math.random());
        setPromoOfferings(shuffled.slice(0, 3));
        
        // Get last 5 offerings
        setRecentOfferings(allOfferings.slice(0, 5));
        
        // Mock top users data (we'll implement real user stats later)
        setTopUsers([
          {
            _id: '1',
            username: 'Alex_Petrov',
            email: 'alex@example.com',
            rating: 4.9,
            completedJobs: 25,
            createdJobs: 8,
            createdAt: '2024-01-15T10:00:00Z'
          },
          {
            _id: '2',
            username: 'Maria_Ivanova',
            email: 'maria@example.com',
            rating: 4.8,
            completedJobs: 18,
            createdJobs: 12,
            createdAt: '2024-02-01T10:00:00Z'
          },
          {
            _id: '3',
            username: 'John_Smith',
            email: 'john@example.com',
            rating: 4.7,
            completedJobs: 15,
            createdJobs: 6,
            createdAt: '2024-02-10T10:00:00Z'
          }
        ]);
        
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{
          border: '4px solid rgba(59, 130, 246, 0.2)',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
      {/* Map Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '1rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          📍 Job Locations Map
        </h2>
        {recentOfferings.length > 0 && <MapView items={recentOfferings} />}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Promo Offerings */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ⭐ Featured Jobs
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {promoOfferings.map((offering) => (
              <div key={offering._id} style={{
                background: 'rgba(249, 250, 251, 0.7)',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(229, 231, 235, 0.5)'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  {offering.label}
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  {offering.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '600' }}>
                    {offering.paymentPerHour} BGN/hour
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {offering.applicationsCount} applications
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Offerings */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🆕 Latest Jobs
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentOfferings.map((offering) => (
              <div key={offering._id} style={{
                background: 'rgba(249, 250, 251, 0.7)',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                    {offering.label}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {offering.paymentPerHour} BGN/hour • {offering.maxHours}h max
                  </p>
                </div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280',
                  background: 'rgba(59, 130, 246, 0.1)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem'
                }}>
                  {offering.applicationsCount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🏆 Top Users This Month
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topUsers.map((user, index) => (
              <div key={user._id} style={{
                background: 'rgba(249, 250, 251, 0.7)',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: index === 0 ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' :
                             index === 1 ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' :
                             'linear-gradient(135deg, #cd7f32 0%, #a0522d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                    {user.username}
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                    <span>⭐ {user.rating}</span>
                    <span>✅ {user.completedJobs} completed</span>
                    <span>📝 {user.createdJobs} created</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
