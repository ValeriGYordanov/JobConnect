import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JobLocationMap } from '../components/JobLocationMap';

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
  requestor: {
    _id: string;
    username: string;
    email: string;
    rating: number;
    completedJobs: number;
  };
};

type User = {
  id: string;
  username: string;
  email: string;
  rating: number;
  completedJobs: number;
};

interface JobDetailsPageProps {
  user?: User | null;
}

export function JobDetailsPage({ user }: JobDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Offering | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/offerings/${id}`);
      setJob(response.data);
      
      // Check if user has applied to this job
      if (user) {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const appliedResponse = await axios.get(`/api/offerings/${id}/applied`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setHasApplied(appliedResponse.data.hasApplied);
            setApplicationStatus(appliedResponse.data.application?.status || null);
          }
        } catch (err) {
          console.log('Could not check application status:', err);
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(`/api/offerings/${id}/apply`, {
        message: 'I am interested in this job opportunity.'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update application status
      setHasApplied(true);
      setApplicationStatus('pending');
      
      alert('✅ Application submitted successfully!');
      // Refresh job details to update application count
      fetchJobDetails();
    } catch (err: any) {
      alert('❌ Failed to submit application: ' + (err?.response?.data?.error || 'Unknown error'));
    } finally {
      setApplying(false);
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
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
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
            {error || 'Job not found'}
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
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const totalPayment = job.paymentPerHour * job.maxHours;
  
  // Check if current user is the job owner
  const isJobOwner = user && job && user.id === job.requestor._id;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back Button */}
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
            marginBottom: '2rem',
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
          {/* Main Content */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {/* Job Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem',
                lineHeight: '1.2'
              }}>
                {job.label}
              </h1>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '1.5rem'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Sofia, Bulgaria
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a4 4 0 014-4h12.713M18 10a6 6 0 00-12 0v2H2.93A2 2 0 001 14.93V19a2 2 0 002 2h18a2 2 0 002-2v-4.07A2 2 0 0021.07 12H18v-2z" />
                  </svg>
                  {job.applicationsCount} applications
                </span>
              </div>
            </div>

            {/* Job Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                Job Description
              </h2>
              <p style={{
                color: '#4b5563',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                {job.description || 'No description provided.'}
              </p>
            </div>

            {/* Job Details */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                Job Details
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(249, 250, 251, 0.7)',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(229, 231, 235, 0.5)'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Payment per Hour
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                    {job.paymentPerHour} BGN
                  </div>
                </div>
                <div style={{
                  background: 'rgba(249, 250, 251, 0.7)',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(229, 231, 235, 0.5)'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Maximum Hours
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                    {job.maxHours} hours
                  </div>
                </div>
                <div style={{
                  background: 'rgba(249, 250, 251, 0.7)',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(229, 231, 235, 0.5)'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Total Payment
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                    {totalPayment} BGN
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                Job Location
              </h2>
              <div style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(5px)',
                borderRadius: '0.75rem',
                padding: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(229, 231, 235, 0.5)'
              }}>
                <JobLocationMap
                  location={job.location}
                  jobTitle={job.label}
                  height="250px"
                />
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: 'rgba(249, 250, 251, 0.7)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  <strong>Coordinates:</strong> {job.location.lat.toFixed(6)}, {job.location.lng.toFixed(6)}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Job Actions - Different based on ownership */}
            {isJobOwner ? (
              /* Job Owner Actions */
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '1rem'
                }}>
                  Manage Your Job
                </h3>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem'
                }}>
                  You posted this job offering
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={() => navigate(`/my-jobs`)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      color: 'white',
                      fontWeight: '600',
                      borderRadius: '0.75rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s',
                      fontSize: '0.875rem'
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
                    Edit Job
                  </button>
                  <button
                    onClick={() => navigate(`/job/${job._id}/applicants`)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      fontWeight: '600',
                      borderRadius: '0.75rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s',
                      fontSize: '0.875rem'
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
                    View Applicants ({job.applicationsCount})
                  </button>
                </div>
              </div>
            ) : (
              /* Apply Button for non-owners */
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '1rem'
                }}>
                  Ready to Apply?
                </h3>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem'
                }}>
                  Earn up to {totalPayment} BGN for this job
                </p>
                {user ? (
                  hasApplied ? (
                    <div style={{
                      width: '100%',
                      padding: '1rem 2rem',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      fontWeight: '600',
                      borderRadius: '0.75rem',
                      textAlign: 'center',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Awaiting Acceptance
                    </div>
                  ) : (
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      style={{
                        width: '100%',
                        padding: '1rem 2rem',
                        background: applying 
                          ? 'rgba(156, 163, 175, 0.5)' 
                          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        fontWeight: '600',
                        borderRadius: '0.75rem',
                        border: 'none',
                        cursor: applying ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.2s',
                        fontSize: '1rem'
                      }}
                      onMouseEnter={(e) => {
                        if (!applying) {
                          const target = e.target as HTMLButtonElement;
                          target.style.transform = 'translateY(-2px)';
                          target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!applying) {
                          const target = e.target as HTMLButtonElement;
                          target.style.transform = 'translateY(0)';
                          target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                        }
                      }}
                    >
                      {applying ? 'Applying...' : 'Apply Now'}
                    </button>
                  )
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      You need to be logged in to apply
                    </p>
                    <button
                      onClick={() => navigate('/login')}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        color: 'white',
                        fontWeight: '600',
                        borderRadius: '0.75rem',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.2s',
                        fontSize: '0.875rem'
                      }}
                    >
                      Login to Apply
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Requestor Info */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                Posted by
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}>
                  {job.requestor.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                    {job.requestor.username}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {job.requestor.completedJobs} completed jobs
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Rating: {job.requestor.rating.toFixed(1)}/5.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
