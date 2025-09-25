import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  featured?: boolean;
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
  const navigate = useNavigate();
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
        
        // Get featured offerings for promo section
        const featuredOfferings = allOfferings.filter(offering => offering.featured === true);
        setPromoOfferings(featuredOfferings);
        
        // Get last 5 offerings (excluding featured ones)
        const nonFeaturedOfferings = allOfferings.filter(offering => offering.featured !== true);
        setRecentOfferings(nonFeaturedOfferings.slice(0, 5));
        
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
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 243, 199, 0.8) 100%)',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '2px solid rgba(245, 158, 11, 0.3)',
                boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
                onClick={() => navigate(`/job/${offering._id}`)}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLDivElement;
                  target.style.transform = 'translateY(-2px)';
                  target.style.boxShadow = '0 8px 15px -3px rgba(245, 158, 11, 0.3)';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLDivElement;
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = '0 4px 6px -1px rgba(245, 158, 11, 0.2)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '10px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.625rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  ⭐ FEATURED
                </div>
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  {offering.label}
                </h4>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  marginBottom: '0.75rem',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {offering.description}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.75rem'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '600' }}>
                    {offering.paymentPerHour} BGN/hour
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {offering.applicationsCount} applications
                  </span>
                </div>
                <button style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s'
                }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/job/${offering._id}`);
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'translateY(-1px)';
                    target.style.boxShadow = '0 4px 8px -1px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'translateY(0)';
                    target.style.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  View Details
                </button>
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
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
                onClick={() => navigate(`/job/${offering._id}`)}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLDivElement;
                  target.style.background = 'rgba(59, 130, 246, 0.05)';
                  target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  target.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLDivElement;
                  target.style.background = 'rgba(249, 250, 251, 0.7)';
                  target.style.borderColor = 'rgba(229, 231, 235, 0.5)';
                  target.style.transform = 'translateX(0)';
                }}
              >
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
