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
    requestor: '1', // For demo purposes, assign all new jobs to user '1'
    createdAt: new Date().toISOString()
  };
  offerings.push(newOffering);
  res.status(201).json(newOffering);
});

app.get('/api/offerings', (req, res) => {
  let filteredOfferings = [...offerings];
  
  // Search functionality
  const search = req.query.search;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredOfferings = filteredOfferings.filter(offering => 
      offering.label.toLowerCase().includes(searchLower) ||
      offering.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by payment range
  const minPayment = parseFloat(req.query.minPayment);
  const maxPayment = parseFloat(req.query.maxPayment);
  if (!isNaN(minPayment)) {
    filteredOfferings = filteredOfferings.filter(offering => offering.paymentPerHour >= minPayment);
  }
  if (!isNaN(maxPayment)) {
    filteredOfferings = filteredOfferings.filter(offering => offering.paymentPerHour <= maxPayment);
  }
  
  // Filter by max hours
  const maxHours = parseFloat(req.query.maxHours);
  if (!isNaN(maxHours)) {
    filteredOfferings = filteredOfferings.filter(offering => offering.maxHours <= maxHours);
  }
  
  // Filter by applications count
  const hasApplications = req.query.hasApplications;
  if (hasApplications === 'true') {
    filteredOfferings = filteredOfferings.filter(offering => offering.applicationsCount > 0);
  } else if (hasApplications === 'false') {
    filteredOfferings = filteredOfferings.filter(offering => offering.applicationsCount === 0);
  }
  
  // Sort functionality
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder || 'asc';
  
  if (sortBy === 'payment') {
    filteredOfferings.sort((a, b) => {
      return sortOrder === 'asc' ? a.paymentPerHour - b.paymentPerHour : b.paymentPerHour - a.paymentPerHour;
    });
  } else if (sortBy === 'hours') {
    filteredOfferings.sort((a, b) => {
      return sortOrder === 'asc' ? a.maxHours - b.maxHours : b.maxHours - a.maxHours;
    });
  } else if (sortBy === 'applications') {
    filteredOfferings.sort((a, b) => {
      return sortOrder === 'asc' ? a.applicationsCount - b.applicationsCount : b.applicationsCount - a.applicationsCount;
    });
  } else if (sortBy === 'date') {
    filteredOfferings.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedOfferings = filteredOfferings.slice(startIndex, endIndex);
  
  res.json({
    offerings: paginatedOfferings,
    total: filteredOfferings.length,
    page,
    limit,
    totalPages: Math.ceil(filteredOfferings.length / limit)
  });
});

// Get individual offering by ID
app.get('/api/offerings/:id', (req, res) => {
  const offering = offerings.find(o => o._id === req.params.id);
  if (!offering) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  // Add requestor information for demo
  const requestor = {
    _id: '1',
    username: 'demo',
    email: 'demo@jobconnect.com',
    rating: 4.8,
    completedJobs: 15
  };
  
  res.json({
    ...offering,
    requestor
  });
});

// Apply to offering endpoint
app.post('/api/offerings/:id/apply', (req, res) => {
  const offering = offerings.find(o => o._id === req.params.id);
  if (!offering) {
    return res.status(404).json({ error: 'Offering not found' });
  }
  
  // For demo purposes, just increment the applications count
  offering.applicationsCount = (offering.applicationsCount || 0) + 1;
  
  res.status(201).json({ 
    message: 'Application submitted successfully',
    application: {
      offering: offering._id,
      applicant: '1',
      message: req.body.message || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  });
});

// Update offering endpoint
app.put('/api/offerings/:id', (req, res) => {
  const offeringIndex = offerings.findIndex(o => o._id === req.params.id);
  if (offeringIndex === -1) {
    return res.status(404).json({ error: 'Offering not found' });
  }
  
  // For demo purposes, allow updates to any offering
  // In production, you'd check if the user owns this offering
  const updatedOffering = {
    ...offerings[offeringIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  offerings[offeringIndex] = updatedOffering;
  
  res.json(updatedOffering);
});

// Delete offering endpoint
app.delete('/api/offerings/:id', (req, res) => {
  const offeringIndex = offerings.findIndex(o => o._id === req.params.id);
  if (offeringIndex === -1) {
    return res.status(404).json({ error: 'Offering not found' });
  }
  
  // For demo purposes, allow deletion of any offering
  // In production, you'd check if the user owns this offering
  offerings.splice(offeringIndex, 1);
  
  res.json({ message: 'Offering deleted successfully' });
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
