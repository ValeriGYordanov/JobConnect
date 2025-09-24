import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapView } from '../components/MapView';
import { SearchFilter } from '../components/SearchFilter';

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
};

export function OfferingsPage() {
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
      
      if (res.data.offerings) {
        setItems(res.data.offerings);
        setTotalCount(res.data.total);
        setTotalPages(res.data.totalPages);
      } else {
        // Fallback for old API format
        setItems(res.data);
        setTotalCount(res.data.length);
        setTotalPages(1);
      }
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
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          background: 'linear-gradient(135deg, #1f2937 0%, #2563eb 50%, #7c3aed 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem'
        }}>
          Find Your Next Gig
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#6b7280', 
          maxWidth: '42rem', 
          margin: '0 auto' 
        }}>
          Discover local opportunities in Sofia. Connect with people who need help, and earn money doing what you love.
        </p>
      </div>

      {/* Search and Filter Section */}
      <SearchFilter onSearch={handleSearch} onClear={handleClear} />

      {/* Map Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Job Locations</h2>
        </div>
        <div style={{ padding: '0.5rem' }}>
          <MapView items={items} center={{ lat: 42.694558, lng: 23.322851 }} />
        </div>
      </div>

      {/* Job Listings Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Available Jobs</h2>
          </div>
          <div style={{
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%)',
            borderRadius: '9999px'
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
              {items.length} opportunities
            </span>
          </div>
        </div>
        
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #dbeafe',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '48px',
                height: '48px',
                border: '4px solid transparent',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          </div>
        )}
        
        {error && (
          <div style={{
            background: 'rgba(254, 242, 242, 0.8)',
            border: '1px solid rgba(252, 165, 165, 0.5)',
            color: '#dc2626',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}
        
        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{
              width: '96px',
              height: '96px',
              background: '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <svg width="48" height="48" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
              No jobs found
            </h3>
            <p style={{ color: '#6b7280' }}>
              Try adjusting your search filters to find more opportunities.
            </p>
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {items.map((o) => (
            <div key={o._id} style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '1rem',
              padding: '2rem',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLDivElement;
              target.style.background = 'rgba(255, 255, 255, 0.8)';
              target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              target.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLDivElement;
              target.style.background = 'rgba(255, 255, 255, 0.6)';
              target.style.boxShadow = 'none';
              target.style.transform = 'translateY(0)';
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: '#1f2937', 
                    marginBottom: '0.75rem',
                    transition: 'color 0.2s'
                  }}>
                    {o.label}
                  </h3>
                  {o.description && (
                    <p style={{ color: '#6b7280', fontSize: '1.125rem', lineHeight: '1.75' }}>
                      {o.description}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right', marginLeft: '1.5rem' }}>
                  <div style={{ 
                    fontSize: '1.875rem', 
                    fontWeight: 'bold', 
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {o.paymentPerHour} BGN/h
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                    up to {o.maxHours}h
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#6b7280' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: '#dbeafe',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="16" height="16" fill="#2563eb" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Sofia, Bulgaria
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: '#e9d5ff',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="16" height="16" fill="#8b5cf6" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {o.applicationsCount} applicants
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
                  Apply Now
                </button>
              </div>
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


