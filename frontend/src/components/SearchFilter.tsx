import { useState } from 'react';

interface SearchFilterProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

export interface SearchFilters {
  search: string;
  minPayment: number | null;
  maxPayment: number | null;
  maxHours: number | null;
  hasApplications: string;
  sortBy: string;
  sortOrder: string;
}

export function SearchFilter({ onSearch, onClear }: SearchFilterProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    minPayment: null,
    maxPayment: null,
    maxHours: null,
    hasApplications: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (field: keyof SearchFilters, value: string | number | null) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
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
    onClear();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginBottom: '2rem',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      {/* Main Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg 
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: '#6b7280'
            }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search jobs by title or description..."
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 3rem',
              background: 'rgba(249, 250, 251, 0.5)',
              border: '1px solid rgba(229, 231, 235, 0.5)',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(229, 231, 235, 0.5)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <button
          onClick={handleSearch}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '0.75rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}
        >
          Search
        </button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: '0.75rem 1rem',
            background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '0.75rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
          Filters
        </button>
        <button
          onClick={handleClear}
          style={{
            padding: '0.75rem 1rem',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '0.75rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}
        >
          Clear
        </button>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div style={{
          borderTop: '1px solid rgba(229, 231, 235, 0.5)',
          paddingTop: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {/* Payment Range */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Payment Range (BGN/h)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPayment || ''}
                onChange={(e) => handleInputChange('minPayment', e.target.value ? parseFloat(e.target.value) : null)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: 'rgba(249, 250, 251, 0.5)',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPayment || ''}
                onChange={(e) => handleInputChange('maxPayment', e.target.value ? parseFloat(e.target.value) : null)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: 'rgba(249, 250, 251, 0.5)',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Max Hours */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Max Hours
            </label>
            <input
              type="number"
              placeholder="Maximum hours"
              value={filters.maxHours || ''}
              onChange={(e) => handleInputChange('maxHours', e.target.value ? parseFloat(e.target.value) : null)}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: 'rgba(249, 250, 251, 0.5)',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Applications Filter */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Applications
            </label>
            <select
              value={filters.hasApplications}
              onChange={(e) => handleInputChange('hasApplications', e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: 'rgba(249, 250, 251, 0.5)',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            >
              <option value="">All Jobs</option>
              <option value="true">Has Applications</option>
              <option value="false">No Applications</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleInputChange('sortBy', e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: 'rgba(249, 250, 251, 0.5)',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            >
              <option value="date">Date Posted</option>
              <option value="payment">Payment</option>
              <option value="hours">Hours</option>
              <option value="applications">Applications</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Order
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleInputChange('sortOrder', e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: 'rgba(249, 250, 251, 0.5)',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
