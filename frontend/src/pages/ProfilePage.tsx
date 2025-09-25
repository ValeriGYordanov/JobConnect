import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type User = {
  id: string;
  username: string;
  email: string;
  rating: number;
  completedJobs: number;
  createdAt: string;
};

export function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          border: '4px solid rgba(59, 130, 246, 0.2)',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          background: '#fee2e2',
          color: '#ef4444',
          padding: '2rem',
          borderRadius: '1rem',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            {error || 'Profile not found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              color: 'white',
              fontWeight: '600',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s'
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

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
            Back to Home
          </button>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            My Profile
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280'
          }}>
            Manage your account and view your activity
          </p>
        </div>

        {/* Profile Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '2rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                {user.username}
              </h2>
              <p style={{
                color: '#6b7280',
                fontSize: '1rem'
              }}>
                {user.email}
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'rgba(249, 250, 251, 0.7)',
              padding: '1rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(229, 231, 235, 0.5)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Rating
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {user.rating.toFixed(1)}/5.0
              </div>
            </div>
            <div style={{
              background: 'rgba(249, 250, 251, 0.7)',
              padding: '1rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(229, 231, 235, 0.5)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Completed Jobs
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {user.completedJobs}
              </div>
            </div>
            <div style={{
              background: 'rgba(249, 250, 251, 0.7)',
              padding: '1rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(229, 231, 235, 0.5)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Member Since
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937' }}>
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => navigate('/my-jobs')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                fontSize: '0.875rem',
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
              }}
            >
              My Jobs
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                fontSize: '0.875rem',
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
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}