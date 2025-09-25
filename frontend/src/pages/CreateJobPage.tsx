import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LocationPicker } from '../components/LocationPicker';

type JobFormData = {
  label: string;
  description: string;
  paymentPerHour: number;
  maxHours: number;
  location: {
    lat: number;
    lng: number;
  };
};

export function CreateJobPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<JobFormData>({
    label: '',
    description: '',
    paymentPerHour: 15,
    maxHours: 4,
    location: {
      lat: 42.6977, // Sofia coordinates
      lng: 23.3219
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'paymentPerHour' || name === 'maxHours') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const jobData = {
        ...formData,
        type: 'job'
      };

      await axios.post('/api/offerings', jobData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Job created successfully!');
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(229, 231, 235, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = 'rgba(59, 130, 246, 0.1)';
              target.style.color = '#2563eb';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = 'rgba(255, 255, 255, 0.9)';
              target.style.color = '#374151';
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </button>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Create a New Job
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280'
          }}>
            Post a job opportunity and connect with skilled workers in your area.
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Job Title */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Job Title *
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                required
                placeholder="e.g., Help with moving furniture"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Job Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Describe the job in detail. What needs to be done? What skills are required? Any special requirements?"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.2s',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Payment and Hours */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Payment per Hour (BGN) *
                </label>
                <input
                  type="number"
                  name="paymentPerHour"
                  value={formData.paymentPerHour}
                  onChange={handleInputChange}
                  required
                  min="1"
                  step="0.5"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    fontSize: '1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Maximum Hours *
                </label>
                <input
                  type="number"
                  name="maxHours"
                  value={formData.maxHours}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="24"
                  step="0.5"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    fontSize: '1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Job Location *
              </label>
              <div style={{
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.8)'
              }}>
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={formData.location}
                  height="300px"
                />
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginTop: '0.5rem'
              }}>
                Click anywhere on the map to set the exact location for your job
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                background: '#fee2e2',
                color: '#ef4444',
                padding: '1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(107, 114, 128, 0.1)',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = 'rgba(107, 114, 128, 0.2)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = 'rgba(107, 114, 128, 0.1)';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 2rem',
                  background: loading 
                    ? 'rgba(156, 163, 175, 0.5)' 
                    : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'translateY(-2px)';
                    target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'translateY(0)';
                    target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }
                }}
              >
                {loading ? 'Creating...' : 'Create Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
