import './index.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { OfferingsPage } from './pages/OfferingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import axios from 'axios';

export default function App() {
  // Demo data generation
  const addDemoData = async () => {
    const jobTemplates = [
      {
        labels: [
          'Help with moving furniture',
          'Garden cleanup and pruning',
          'House cleaning service',
          'Pet walking service',
          'Computer setup assistance',
          'Painting a small room',
          'Grocery shopping help',
          'Yard maintenance work',
          'Tutoring in mathematics',
          'Photography for event',
          'Car maintenance help',
          'Language practice partner',
          'IKEA furniture assembly',
          'Deep cleaning service',
          'Dog grooming assistance'
        ],
        descriptions: [
          'Need assistance with this task. All necessary tools and materials will be provided.',
          'Looking for someone reliable and experienced. Will provide refreshments and lunch.',
          'This is a great opportunity for someone who enjoys this type of work.',
          'Perfect for someone with experience in this area. Flexible timing available.',
          'Need help with this project. Previous experience preferred but not required.',
          'Looking for someone who can work independently. All supplies provided.',
          'This job requires attention to detail and good communication skills.',
          'Great opportunity for someone who enjoys working outdoors.',
          'Need someone patient and experienced. Will provide all necessary materials.',
          'Looking for someone who can work efficiently and follow instructions well.'
        ]
      }
    ];

    const locations = [
      { lat: 42.694558, lng: 23.322851 },
      { lat: 42.6977, lng: 23.3219 },
      { lat: 42.6915, lng: 23.3250 },
      { lat: 42.6960, lng: 23.3200 },
      { lat: 42.6925, lng: 23.3245 },
      { lat: 42.6950, lng: 23.3230 },
      { lat: 42.6930, lng: 23.3215 },
      { lat: 42.6980, lng: 23.3220 },
      { lat: 42.6940, lng: 23.3235 },
      { lat: 42.6965, lng: 23.3210 }
    ];

    const requestorNames = [
      'Maria Petrov', 'Ivan Dimitrov', 'Elena Stoyanova', 'Petar Georgiev',
      'Anna Nikolova', 'Dimitar Petrov', 'Sofia Ivanova', 'Georgi Stoyanov',
      'Viktor Todorov', 'Nadezhda Petrova', 'Krasimir Stoyanov', 'Boris Dimitrov',
      'Milena Georgieva', 'Todor Petrov', 'Radka Stoyanova'
    ];

    try {
      // Generate 3 random job offerings
      for (let i = 0; i < 3; i++) {
        const randomLabel = jobTemplates[0].labels[Math.floor(Math.random() * jobTemplates[0].labels.length)];
        const randomDescription = jobTemplates[0].descriptions[Math.floor(Math.random() * jobTemplates[0].descriptions.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const randomRequestor = requestorNames[Math.floor(Math.random() * requestorNames.length)];
        
        const newOffering = {
          type: 'job',
          label: randomLabel,
          description: randomDescription,
          location: randomLocation,
          paymentPerHour: Math.floor(Math.random() * 20) + 10, // 10-30 BGN/h
          maxHours: Math.floor(Math.random() * 5) + 1, // 1-6 hours
          applicationsCount: Math.floor(Math.random() * 6), // 0-5 applicants
          requestor: {
            name: randomRequestor,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5-5.0 rating
            completedJobs: Math.floor(Math.random() * 30) + 1 // 1-30 completed jobs
          }
        };

        await axios.post('/api/offerings', newOffering);
      }
      
      // Show success message
      alert('✅ 3 new demo job offerings added successfully!');
      
      // Refresh the page to show new data
      window.location.reload();
      
    } catch (error) {
      console.error('Error adding demo data:', error);
      alert('❌ Failed to add demo data. Make sure the backend server is running.');
    }
  };

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
                    e.target.style.background = '#eff6ff';
                    e.target.style.color = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#374151';
                  }}
                >
                  Profile
                </Link>
                <button
                  onClick={addDemoData}
                  style={{ 
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  Demo Data
                </button>
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
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<OfferingsPage />} />
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
