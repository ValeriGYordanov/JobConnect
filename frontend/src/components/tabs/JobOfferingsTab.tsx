import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapView } from '../MapView';
import { SearchFilter } from '../SearchFilter';

// Define SearchFilters interface locally to avoid import issues
interface SearchFilters {
  search: string;
  minPayment: number | null;
  maxPayment: number | null;
  maxHours: number | null;
  hasApplications: string;
  sortBy: string;
  sortOrder: string;
}

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

export function JobOfferingsTab() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    minPayment: null,
    maxPayment: null,
    maxHours: null,
    hasApplications: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  async function fetchData(searchFilters?: SearchFilters) {
    try {
      setLoading(true);
      const activeFilters = searchFilters || filters;
      const params: any = {};

      if (activeFilters.search) params.search = activeFilters.search;
      if (activeFilters.minPayment !== null) params.minPayment = activeFilters.minPayment;
      if (activeFilters.maxPayment !== null) params.maxPayment = activeFilters.maxPayment;
      if (activeFilters.maxHours !== null) params.maxHours = activeFilters.maxHours;
      if (activeFilters.hasApplications) params.hasApplications = activeFilters.hasApplications;
      if (activeFilters.sortBy) params.sortBy = activeFilters.sortBy;
      if (activeFilters.sortOrder) params.sortOrder = activeFilters.sortOrder;

      params.page = currentPage;
      params.limit = 10;

      const res = await axios.get('/api/offerings', { params });

      let offerings = [];
      if (res.data.offerings) {
        offerings = res.data.offerings;
        setTotalCount(res.data.total);
        setTotalPages(res.data.totalPages);
      } else {
        offerings = res.data;
        setTotalCount(res.data.length);
        setTotalPages(1);
      }

      // Sort featured jobs first, then by the selected sort criteria
      const sortedOfferings = offerings.sort((a, b) => {
        // Featured jobs always come first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        // Then sort by the selected criteria
        if (activeFilters.sortBy === 'date') {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return activeFilters.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        } else if (activeFilters.sortBy === 'payment') {
          return activeFilters.sortOrder === 'desc' ? b.paymentPerHour - a.paymentPerHour : a.paymentPerHour - b.paymentPerHour;
        } else if (activeFilters.sortBy === 'applications') {
          return activeFilters.sortOrder === 'desc' ? b.applicationsCount - a.applicationsCount : a.applicationsCount - b.applicationsCount;
        }
        return 0;
      });

      setItems(sortedOfferings);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchData(newFilters);
  };

  const handleClear = () => {
    const clearedFilters: SearchFilters = {
      search: '',
      minPayment: null,
      maxPayment: null,
      maxHours: null,
      hasApplications: '',
      sortBy: 'date',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    fetchData(clearedFilters);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
      {/* Search and Filter Section */}
      <div style={{ marginBottom: '2rem' }}>
        <SearchFilter onSearch={handleSearch} onClear={handleClear} />
      </div>

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
        {items.length > 0 && <MapView items={items} />}
      </div>

      {/* Job Listings Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
          All Job Offerings
        </h2>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
            <div style={{
              border: '4px solid rgba(59, 130, 246, 0.2)',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        )}

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#ef4444',
            padding: '1rem',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            Error: {error}
          </div>
        )}

        {!loading && items.length === 0 && !error && (
          <div style={{
            background: 'rgba(249, 250, 251, 0.7)',
            padding: '2rem',
            borderRadius: '0.75rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>No job offerings found.</p>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {items.map((item) => (
            <div key={item._id} style={{
              background: item.featured 
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 243, 199, 0.8) 100%)'
                : 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(5px)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: item.featured 
                ? '0 8px 25px -5px rgba(245, 158, 11, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: item.featured 
                ? '2px solid rgba(245, 158, 11, 0.3)'
                : '1px solid rgba(229, 231, 235, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              transition: 'all 0.2s',
              cursor: 'pointer',
              position: 'relative'
            }}
              onClick={() => navigate(`/job/${item._id}`)}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.transform = 'translateY(-5px)';
                target.style.boxShadow = item.featured 
                  ? '0 12px 30px -5px rgba(245, 158, 11, 0.4), 0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  : '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = item.featured 
                  ? '0 8px 25px -5px rgba(245, 158, 11, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              {item.featured && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '20px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  ⭐ FEATURED
                </div>
              )}
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                color: '#1f2937',
                marginTop: item.featured ? '0.5rem' : '0'
              }}>
                {item.label}
              </h3>
              <p style={{ color: '#4b5563', fontSize: '0.95rem' }}>{item.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <svg width="16" height="16" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <svg width="16" height="16" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 12v-1m-4-4H9m6 0h1m-6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item.paymentPerHour} BGN/hour
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <svg width="16" height="16" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Up to {item.maxHours} hours
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <svg width="16" height="16" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a4 4 0 014-4h12.713M18 10a6 6 0 00-12 0v2H2.93A2 2 0 001 14.93V19a2 2 0 002 2h18a2 2 0 002-2v-4.07A2 2 0 0021.07 12H18v-2z" />
                  </svg>
                  {item.applicationsCount} applications
                </span>
              </div>
              <button style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: '600',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s'
              }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/job/${item._id}`);
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = 'translateY(-2px)';
                  target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Results Count and Pagination */}
      {!loading && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginTop: '2rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Showing {items.length} of {totalCount} jobs
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  background: currentPage === 1 ? 'rgba(229, 231, 235, 0.5)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: currentPage === 1 ? '#9ca3af' : 'white',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Previous
              </button>

              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  const isActive = page === currentPage;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: '40px',
                        height: '40px',
                        background: isActive ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(249, 250, 251, 0.5)',
                        color: isActive ? 'white' : '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          const target = e.target as HTMLButtonElement;
                          target.style.background = 'rgba(59, 130, 246, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          const target = e.target as HTMLButtonElement;
                          target.style.background = 'rgba(249, 250, 251, 0.5)';
                        }
                      }}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  background: currentPage === totalPages ? 'rgba(229, 231, 235, 0.5)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: currentPage === totalPages ? '#9ca3af' : 'white',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
