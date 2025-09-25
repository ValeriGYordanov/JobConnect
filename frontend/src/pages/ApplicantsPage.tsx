import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JobLocationMap } from '../components/JobLocationMap';

type Job = {
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

type Applicant = {
  _id: string;
  offering: string;
  applicant: string;
  message: string;
  status: string;
  appliedAt: string;
  applicantDetails: {
    username: string;
    email: string;
    rating: number;
    completedJobs: number;
    createdAt: string;
  };
};

export function ApplicantsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  useEffect(() => {
    if (id) {
      fetchJobAndApplicants();
    }
  }, [id]);

  const fetchJobAndApplicants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch job details and applicants in parallel
      const [jobResponse, applicantsResponse] = await Promise.all([
        axios.get(`/api/offerings/${id}`),
        axios.get(`/api/offerings/${id}/applicants`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setJob(jobResponse.data);
      setApplicants(applicantsResponse.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load job and applicants');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'accepted':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
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
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Loading applicants...</p>
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
            onClick={() => navigate('/my-jobs')}
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
            Back to My Jobs
          </button>
        </div>
      </div>
    );
  }

  const totalPayment = job.paymentPerHour * job.maxHours;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/my-jobs')}
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
            Back to My Jobs
          </button>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Job Applicants
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280'
          }}>
            Review and manage applications for your job posting
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
          {/* Job Details */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            height: 'fit-content'
          }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              {job.label}
            </h2>
            
            <p style={{
              color: '#4b5563',
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              {job.description}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(249, 250, 251, 0.7)',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                textAlign: 'center'
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
                border: '1px solid rgba(229, 231, 235, 0.5)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Maximum Hours
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {job.maxHours}h
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
                  Total Payment
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {totalPayment} BGN
                </div>
              </div>
            </div>

            {/* Job Location */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                Job Location
              </h3>
              <div style={{
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.8)'
              }}>
                <JobLocationMap
                  location={job.location}
                  jobTitle={job.label}
                  height="200px"
                />
                <div style={{
                  padding: '0.75rem',
                  background: 'rgba(249, 250, 251, 0.7)',
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  <strong>Coordinates:</strong> {job.location.lat.toFixed(6)}, {job.location.lng.toFixed(6)}
                </div>
              </div>
            </div>

            {/* Requestor Info */}
            <div style={{
              background: 'rgba(249, 250, 251, 0.7)',
              padding: '1rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(229, 231, 235, 0.5)'
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Posted by
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}>
                  {job.requestor.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>
                    {job.requestor.username}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {job.requestor.rating.toFixed(1)} ⭐ • {job.requestor.completedJobs} jobs completed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Applicants List */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            height: 'fit-content'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a4 4 0 014-4h12.713M18 10a6 6 0 00-12 0v2H2.93A2 2 0 001 14.93V19a2 2 0 002 2h18a2 2 0 002-2v-4.07A2 2 0 0021.07 12H18v-2z" />
              </svg>
              Applicants ({applicants.length})
            </h2>

            {applicants.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#6b7280'
              }}>
                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a4 4 0 014-4h12.713M18 10a6 6 0 00-12 0v2H2.93A2 2 0 001 14.93V19a2 2 0 002 2h18a2 2 0 002-2v-4.07A2 2 0 0021.07 12H18v-2z" />
                </svg>
                <p style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  No applicants yet
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  Applications will appear here when people apply to your job.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {applicants.map((applicant) => (
                  <div
                    key={applicant._id}
                    style={{
                      background: 'rgba(249, 250, 251, 0.7)',
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(229, 231, 235, 0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setSelectedApplicant(applicant)}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget as HTMLDivElement;
                      target.style.background = 'rgba(59, 130, 246, 0.05)';
                      target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget as HTMLDivElement;
                      target.style.background = 'rgba(249, 250, 251, 0.7)';
                      target.style.borderColor = 'rgba(229, 231, 235, 0.5)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1rem'
                        }}>
                          {applicant.applicantDetails.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '1rem' }}>
                            {applicant.applicantDetails.username}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {applicant.applicantDetails.rating.toFixed(1)} ⭐ • {applicant.applicantDetails.completedJobs} jobs completed
                          </div>
                        </div>
                      </div>
                      <div style={{
                        background: getStatusColor(applicant.status),
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {applicant.status}
                      </div>
                    </div>
                    
                    <p style={{
                      color: '#4b5563',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                      marginBottom: '0.75rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {applicant.message}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      <span>Applied {formatDate(applicant.appliedAt)}</span>
                      <span style={{ fontWeight: '600' }}>View Profile →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Applicant Profile Modal */}
        {selectedApplicant && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative'
            }}>
              <button
                onClick={() => setSelectedApplicant(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: 'none',
                  borderRadius: '0.5rem',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = 'rgba(239, 68, 68, 0.2)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = 'rgba(239, 68, 68, 0.1)';
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.5rem'
                  }}>
                    {selectedApplicant.applicantDetails.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: '0.25rem'
                    }}>
                      {selectedApplicant.applicantDetails.username}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                      {selectedApplicant.applicantDetails.email}
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
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
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                      {selectedApplicant.applicantDetails.rating.toFixed(1)} ⭐
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
                      Jobs Completed
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                      {selectedApplicant.applicantDetails.completedJobs}
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
                    <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937' }}>
                      {new Date(selectedApplicant.applicantDetails.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(249, 250, 251, 0.7)',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '0.75rem'
                  }}>
                    Application Message
                  </h3>
                  <p style={{
                    color: '#4b5563',
                    fontSize: '0.875rem',
                    lineHeight: '1.6'
                  }}>
                    {selectedApplicant.message}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'rgba(249, 250, 251, 0.7)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(229, 231, 235, 0.5)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Applied on
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {formatDate(selectedApplicant.appliedAt)}
                    </div>
                  </div>
                  <div style={{
                    background: getStatusColor(selectedApplicant.status),
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {selectedApplicant.status}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#e5e7eb',
                    color: '#374151',
                    fontWeight: '600',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Close
                </button>
                <button
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s'
                  }}
                >
                  Accept Application
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
