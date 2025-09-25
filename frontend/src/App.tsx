import './index.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { CreateJobPage } from './pages/CreateJobPage';
import { JobManagementPage } from './pages/JobManagementPage';
import { SubNavigation } from './components/SubNavigation';

type TabType = 'home' | 'job-offerings' | 'users' | 'placeholder';
import { HomeTab } from './components/tabs/HomeTab';
import { JobOfferingsTab } from './components/tabs/JobOfferingsTab';
import { UsersTab } from './components/tabs/UsersTab';
import { PlaceholderTab } from './components/tabs/PlaceholderTab';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function App() {
  // User state management
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');


  // Debug user state changes
  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Checking auth with token:', token);
        if (token) {
          const response = await axios.get('/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000 // 5 second timeout
          });
          console.log('Auth check response:', response.data);
          setUser(response.data.user);
        }
      } catch (error) {
        console.log('Auth check failed:', error);
        // Token is invalid, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Auth check timeout, setting loading to false');
      setIsLoading(false);
    }, 3000); // 3 second timeout

    checkAuth();

    return () => clearTimeout(timeoutId);
  }, []);

  // Logout function
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
      setUser(null);
    }
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'job-offerings':
        return <JobOfferingsTab />;
      case 'users':
        return <UsersTab />;
      case 'placeholder':
        return <PlaceholderTab />;
      default:
        return <HomeTab />;
    }
  };


  // Show loading screen while checking authentication
  if (isLoading) {
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
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Loading JobConnect...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
        <header style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}>
                    <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    JobConnect
                  </span>
                </div>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {user ? (
                  <>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      Welcome, {user.username}!
                    </span>
                    <Link 
                      to="/profile" 
                      style={{ 
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        textDecoration: 'none',
                        borderRadius: '0.5rem',
                        transition: 'all 0.2s',
                        background: 'transparent'
                      }}
                          onMouseEnter={(e) => {
                            const target = e.target as HTMLAnchorElement;
                            target.style.background = '#eff6ff';
                            target.style.color = '#2563eb';
                          }}
                          onMouseLeave={(e) => {
                            const target = e.target as HTMLAnchorElement;
                            target.style.background = 'transparent';
                            target.style.color = '#374151';
                          }}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/my-jobs" 
                      style={{ 
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        textDecoration: 'none',
                        borderRadius: '0.5rem',
                        transition: 'all 0.2s',
                        background: 'transparent'
                      }}
                          onMouseEnter={(e) => {
                            const target = e.target as HTMLAnchorElement;
                            target.style.background = '#eff6ff';
                            target.style.color = '#2563eb';
                          }}
                          onMouseLeave={(e) => {
                            const target = e.target as HTMLAnchorElement;
                            target.style.background = 'transparent';
                            target.style.color = '#374151';
                          }}
                    >
                      My Jobs
                    </Link>
                    <Link 
                      to="/create-job" 
                      style={{ 
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        borderRadius: '0.75rem',
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
                      Create a Job
                    </Link>
                    <Link 
                      to="/admin" 
                      style={{ 
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        borderRadius: '0.75rem',
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
                      Admin
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{ 
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.2s',
                        border: 'none',
                        cursor: 'pointer'
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
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      style={{ 
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        textDecoration: 'none',
                        borderRadius: '0.5rem',
                        transition: 'all 0.2s',
                        background: 'transparent'
                      }}
                          onMouseEnter={(e) => {
                            const target = e.target as HTMLAnchorElement;
                            target.style.background = '#eff6ff';
                            target.style.color = '#2563eb';
                          }}
                          onMouseLeave={(e) => {
                            const target = e.target as HTMLAnchorElement;
                            target.style.background = 'transparent';
                            target.style.color = '#374151';
                          }}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      style={{ 
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        borderRadius: '0.75rem',
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
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={
                  <>
                    <SubNavigation activeTab={activeTab} onTabChange={setActiveTab} />
                    {renderTabContent()}
                  </>
                } />
                <Route path="/login" element={<LoginPage setUser={setUser} />} />
                <Route path="/register" element={<RegisterPage setUser={setUser} />} />
                <Route path="/job/:id" element={<JobDetailsPage user={user} />} />
                <Route path="/create-job" element={<CreateJobPage />} />
                <Route path="/my-jobs" element={<JobManagementPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
        <footer style={{ 
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
          color: 'white',
          padding: '2rem 0'
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
              © 2024 JobConnect - Connecting People, Creating Opportunities
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
