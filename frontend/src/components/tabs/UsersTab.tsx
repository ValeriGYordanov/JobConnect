import { useEffect, useState } from 'react';
import axios from 'axios';

type User = {
  _id: string;
  username: string;
  email: string;
  rating: number;
  completedJobs: number;
  createdJobs: number;
  createdAt: string;
  lastActive?: string;
};

export function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // For now, we'll create mock user data since we don't have a users API yet
        // In the future, this will be: const response = await axios.get('/api/users');
        const mockUsers: User[] = [
          {
            _id: '1',
            username: 'Alex_Petrov',
            email: 'alex@example.com',
            rating: 4.9,
            completedJobs: 25,
            createdJobs: 8,
            createdAt: '2024-01-15T10:00:00Z',
            lastActive: '2024-09-24T18:30:00Z'
          },
          {
            _id: '2',
            username: 'Maria_Ivanova',
            email: 'maria@example.com',
            rating: 4.8,
            createdJobs: 12,
            completedJobs: 18,
            createdAt: '2024-02-01T10:00:00Z',
            lastActive: '2024-09-24T17:45:00Z'
          },
          {
            _id: '3',
            username: 'John_Smith',
            email: 'john@example.com',
            rating: 4.7,
            completedJobs: 15,
            createdJobs: 6,
            createdAt: '2024-02-10T10:00:00Z',
            lastActive: '2024-09-24T16:20:00Z'
          },
          {
            _id: '4',
            username: 'Elena_Dimitrova',
            email: 'elena@example.com',
            rating: 4.6,
            completedJobs: 12,
            createdJobs: 15,
            createdAt: '2024-03-05T10:00:00Z',
            lastActive: '2024-09-24T15:10:00Z'
          },
          {
            _id: '5',
            username: 'Petar_Nikolov',
            email: 'petar@example.com',
            rating: 4.5,
            completedJobs: 8,
            createdJobs: 20,
            createdAt: '2024-03-20T10:00:00Z',
            lastActive: '2024-09-24T14:30:00Z'
          },
          {
            _id: '6',
            username: 'Sofia_Georgieva',
            email: 'sofia@example.com',
            rating: 4.4,
            completedJobs: 6,
            createdJobs: 4,
            createdAt: '2024-04-10T10:00:00Z',
            lastActive: '2024-09-24T13:45:00Z'
          }
        ];
        
        setUsers(mockUsers);
        
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getTotalActivity = (user: User) => user.completedJobs + user.createdJobs;

  const formatLastActive = (lastActive?: string) => {
    if (!lastActive) return 'Never';
    const date = new Date(lastActive);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

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

  if (error) {
    return (
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '2rem',
        background: '#fee2e2', color: '#ef4444', borderRadius: '0.5rem', textAlign: 'center'
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          👥 Active Users ({users.length})
        </h2>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {users.map((user, index) => (
            <div key={user._id} style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(5px)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(229, 231, 235, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              transition: 'all 0.2s'
            }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 8px 12px -3px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* User Avatar */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                {user.username.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                    {user.username}
                  </h3>
                  {index < 3 && (
                    <span style={{
                      background: index === 0 ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' :
                                 index === 1 ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' :
                                 'linear-gradient(135deg, #cd7f32 0%, #a0522d 100%)',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      #{index + 1} Top User
                    </span>
                  )}
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                  {user.email}
                </p>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: '#4b5563' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <svg width="16" height="16" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.975 2.888a1 1 0 00-.363 1.118l1.519 4.674c.3.921-.755 1.688-1.538 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.975 2.888c-.783.57-1.838-.197-1.538-1.118l1.519-4.674a1 1 0 00-.363-1.118l-3.975-2.888c-.784-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
                    </svg>
                    {user.rating} rating
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <svg width="16" height="16" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {user.completedJobs} completed
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <svg width="16" height="16" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {user.createdJobs} created
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <svg width="16" height="16" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatLastActive(user.lastActive)}
                  </span>
                </div>
              </div>

              {/* Activity Score */}
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                  {getTotalActivity(user)}
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                  Total Activity
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
