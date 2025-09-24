const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Store offerings in memory
let offerings = [
  {
    _id: '1',
    type: 'job',
    label: 'I need a person to mow my yard',
    description: 'I struggle with mowing due to my disabilities so I would need someone to help me.',
    location: { lat: 42.694558, lng: 23.322851 },
    paymentPerHour: 15,
    maxHours: 2,
    applicationsCount: 3,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    type: 'job',
    label: 'Help with moving furniture',
    description: 'Need assistance moving a few heavy items to the new apartment.',
    location: { lat: 42.6977, lng: 23.3219 },
    paymentPerHour: 20,
    maxHours: 3,
    applicationsCount: 1,
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    type: 'job',
    label: 'Garden cleanup and pruning',
    description: 'Looking for someone to clean up the garden and prune the bushes.',
    location: { lat: 42.6915, lng: 23.3250 },
    paymentPerHour: 12,
    maxHours: 4,
    applicationsCount: 0,
    createdAt: new Date().toISOString()
  },
  {
    _id: '4',
    type: 'job',
    label: 'Pet walking service',
    description: 'Need someone to walk my dog twice a day for a week.',
    location: { lat: 42.6960, lng: 23.3200 },
    paymentPerHour: 10,
    maxHours: 1,
    applicationsCount: 5,
    createdAt: new Date().toISOString()
  },
  {
    _id: '5',
    type: 'job',
    label: 'House cleaning before guests arrive',
    description: 'Deep cleaning needed for upcoming family visit.',
    location: { lat: 42.6925, lng: 23.3245 },
    paymentPerHour: 18,
    maxHours: 5,
    applicationsCount: 2,
    createdAt: new Date().toISOString()
  }
];

// Add new offering endpoint
app.post('/api/offerings', (req, res) => {
  const newOffering = {
    _id: (offerings.length + 1).toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  offerings.push(newOffering);
  res.status(201).json(newOffering);
});

app.get('/api/offerings', (req, res) => {
  res.json(offerings);
});

// Auth routes for demo
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'demo' && password === 'demo') {
    const user = {
      id: '1',
      username: 'demo',
      email: 'demo@jobconnect.com',
      rating: 4.8,
      completedJobs: 15,
      createdAt: new Date().toISOString()
    };
    
    res.cookie('token', 'demo-token-123', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });
    
    res.json({
      message: 'Login successful',
      user,
      token: 'demo-token-123'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (username === 'demo' && email === 'demo@jobconnect.com') {
    res.status(400).json({ error: 'User already exists' });
    return;
  }
  
  const newUser = {
    id: (offerings.length + 1).toString(),
    username,
    email,
    rating: 5.0,
    completedJobs: 0,
    createdAt: new Date().toISOString()
  };
  
  res.cookie('token', 'demo-token-123', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  });
  
  res.status(201).json({
    message: 'Registration successful',
    user: newUser,
    token: 'demo-token-123'
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

app.get('/api/auth/profile', (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token || token !== 'demo-token-123') {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const user = {
    id: '1',
    username: 'demo',
    email: 'demo@jobconnect.com',
    rating: 4.8,
    completedJobs: 15,
    createdAt: new Date().toISOString()
  };
  
  res.json({ user });
});

app.post('/api/auth/demo-user', (req, res) => {
  res.json({
    message: 'Demo user available',
    user: { username: 'demo', password: 'demo' }
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Test server listening on http://localhost:${PORT}`);
});
