const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all users endpoint
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Store users in memory
let users = [
  {
    _id: '1',
    username: 'demo',
    email: 'demo@jobconnect.com',
    rating: 4.8,
    completedJobs: 1, // 1 completed job: Computer Setup
    createdJobs: 0,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  },
  {
    _id: '2',
    username: 'ivan_petrov',
    email: 'ivan.petrov@example.com',
    rating: 4.9,
    completedJobs: 1, // 1 completed job: Garden Cleanup
    createdJobs: 2, // Has 2 jobs: mowing yard + house cleaning
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  },
  {
    _id: '3',
    username: 'gosho_ivanov',
    email: 'gosho.ivanov@example.com',
    rating: 4.7,
    completedJobs: 1, // 1 completed job: House Deep Cleaning
    createdJobs: 2, // Has 2 jobs: moving furniture + computer setup
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  },
  {
    _id: '4',
    username: 'stoyanka_gerginova',
    email: 'stoyanka.gerginova@example.com',
    rating: 4.6,
    completedJobs: 1, // 1 completed job: Furniture Moving
    createdJobs: 2, // Has 2 jobs: garden cleanup + painting
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  },
  {
    _id: '5',
    username: 'penko_michev',
    email: 'penko.michev@example.com',
    rating: 4.5,
    completedJobs: 1, // 1 completed job: Pet Walking
    createdJobs: 1, // Has 1 job: pet walking
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  },
  {
    _id: '6',
    username: 'vlado_shefa',
    email: 'vlado.shefa@example.com',
    rating: 4.4,
    completedJobs: 0, // No completed jobs
    createdJobs: 0, // No jobs created - only applicant
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  }
];

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
    requestor: '2', // Ivan Petrov
    featured: false,
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
    requestor: '3', // Gosho Ivanov
    featured: false,
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
    requestor: '4', // Stoyanka Gerginova
    featured: false,
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
    requestor: '5', // Penko Michev
    featured: false,
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
    requestor: '2', // Ivan Petrov (second job)
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: '6',
    type: 'job',
    label: 'Computer setup and troubleshooting',
    description: 'Need help setting up a new computer and installing software.',
    location: { lat: 42.6980, lng: 23.3220 },
    paymentPerHour: 25,
    maxHours: 3,
    applicationsCount: 1,
    requestor: '3', // Gosho Ivanov (second job)
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: '7',
    type: 'job',
    label: 'Painting a small room',
    description: 'Help with painting a bedroom, all materials provided.',
    location: { lat: 42.6930, lng: 23.3215 },
    paymentPerHour: 16,
    maxHours: 6,
    applicationsCount: 0,
    requestor: '4', // Stoyanka Gerginova (second job)
    featured: false,
    createdAt: new Date().toISOString()
  },
  // Featured Jobs - Created by Gosho Ivanov (ID: 3)
  {
    _id: '8',
    type: 'job',
    label: 'Premium Home Renovation Project',
    description: 'Looking for skilled professionals to help with a complete home renovation. This is a high-paying, long-term project requiring expertise in multiple areas. Perfect for experienced contractors or handymen.',
    location: { lat: 42.7000, lng: 23.3300 },
    paymentPerHour: 35,
    maxHours: 40,
    applicationsCount: 8,
    requestor: '3', // Gosho Ivanov
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '9',
    type: 'job',
    label: 'Luxury Garden Design & Landscaping',
    description: 'Transform our backyard into a beautiful garden paradise. We need creative and experienced landscapers who can design and implement a stunning outdoor space. All materials and tools will be provided.',
    location: { lat: 42.7050, lng: 23.3350 },
    paymentPerHour: 30,
    maxHours: 25,
    applicationsCount: 12,
    requestor: '3', // Gosho Ivanov
    featured: true,
    createdAt: new Date().toISOString()
  }
];

// Store completed jobs in memory
let completedJobs = [
  {
    _id: 'completed_1',
    jobTitle: 'Garden Cleanup Project',
    description: 'Cleaned up the backyard garden, removed weeds, and pruned bushes',
    location: { lat: 42.6915, lng: 23.3250 },
    paymentPerHour: 12,
    hoursWorked: 4,
    totalPayment: 48,
    completedBy: '2', // Ivan Petrov
    completedFor: '3', // Gosho Ivanov
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    rating: 4.8
  },
  {
    _id: 'completed_2',
    jobTitle: 'Furniture Moving Service',
    description: 'Helped move heavy furniture to new apartment',
    location: { lat: 42.6977, lng: 23.3219 },
    paymentPerHour: 20,
    hoursWorked: 3,
    totalPayment: 60,
    completedBy: '4', // Stoyanka Gerginova
    completedFor: '2', // Ivan Petrov
    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    rating: 4.9
  },
  {
    _id: 'completed_3',
    jobTitle: 'Pet Walking Service',
    description: 'Walked the dog twice daily for a week',
    location: { lat: 42.6960, lng: 23.3200 },
    paymentPerHour: 10,
    hoursWorked: 7,
    totalPayment: 70,
    completedBy: '5', // Penko Michev
    completedFor: '6', // Vlado Shefa
    completedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks ago
    rating: 4.7
  },
  {
    _id: 'completed_4',
    jobTitle: 'House Deep Cleaning',
    description: 'Complete deep cleaning before family visit',
    location: { lat: 42.6925, lng: 23.3245 },
    paymentPerHour: 18,
    hoursWorked: 5,
    totalPayment: 90,
    completedBy: '3', // Gosho Ivanov
    completedFor: '1', // Demo user
    completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
    rating: 4.9
  },
  {
    _id: 'completed_5',
    jobTitle: 'Computer Setup and Troubleshooting',
    description: 'Set up new computer and installed necessary software',
    location: { lat: 42.6980, lng: 23.3220 },
    paymentPerHour: 25,
    hoursWorked: 3,
    totalPayment: 75,
    completedBy: '1', // Demo user
    completedFor: '4', // Stoyanka Gerginova
    completedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 1.5 months ago
    rating: 4.8
  }
];

// Store applications in memory
let applications = [
  {
    _id: 'app_1',
    offering: '1', // Mowing yard job
    applicant: '3', // Gosho Ivanov
    message: 'I have experience with yard work and can help you with this.',
    status: 'pending',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    _id: 'app_2',
    offering: '1', // Mowing yard job
    applicant: '4', // Stoyanka Gerginova
    message: 'I would love to help you with the yard work.',
    status: 'pending',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    _id: 'app_3',
    offering: '1', // Mowing yard job
    applicant: '5', // Penko Michev
    message: 'I can help with the mowing, I have my own equipment.',
    status: 'pending',
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    _id: 'app_4',
    offering: '2', // Moving furniture job
    applicant: '6', // Vlado Shefa
    message: 'I am strong and can help with moving heavy items.',
    status: 'pending',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    _id: 'app_5',
    offering: '4', // Pet walking job
    applicant: '1', // Demo user
    message: 'I love dogs and would be happy to walk your pet.',
    status: 'pending',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    _id: 'app_6',
    offering: '4', // Pet walking job
    applicant: '2', // Ivan Petrov
    message: 'I have experience with pet care and walking.',
    status: 'pending',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    _id: 'app_7',
    offering: '4', // Pet walking job
    applicant: '3', // Gosho Ivanov
    message: 'I can walk your dog twice daily as requested.',
    status: 'pending',
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    _id: 'app_8',
    offering: '4', // Pet walking job
    applicant: '4', // Stoyanka Gerginova
    message: 'I am available for the pet walking service.',
    status: 'pending',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    _id: 'app_9',
    offering: '4', // Pet walking job
    applicant: '6', // Vlado Shefa
    message: 'I would love to help with pet walking.',
    status: 'pending',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    _id: 'app_10',
    offering: '5', // House cleaning job
    applicant: '3', // Gosho Ivanov
    message: 'I have experience with deep cleaning and can help before your family visit.',
    status: 'pending',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    _id: 'app_11',
    offering: '5', // House cleaning job
    applicant: '4', // Stoyanka Gerginova
    message: 'I can help with the deep cleaning for your family visit.',
    status: 'pending',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  }
];

// Add new offering endpoint
app.post('/api/offerings', (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Determine which user is creating the job based on token
  let userId = '1'; // Default to demo user
  
  // For demo purposes, check if it's a new user token
  if (token === 'new-user-token-123') {
    // Find the most recently created user (last in the array)
    userId = users[users.length - 1]._id;
  }
  
  const newOffering = {
    _id: (offerings.length + 1).toString(),
    ...req.body,
    requestor: userId, // Assign to the actual logged-in user
    featured: false, // New jobs are not featured by default
    createdAt: new Date().toISOString()
  };
  offerings.push(newOffering);
  
  // Update the correct user's createdJobs count
  const user = users.find(u => u._id === userId);
  if (user) {
    user.createdJobs += 1;
  }
  
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
  
  // Find the actual requestor from users array
  const requestor = users.find(u => u._id === offering.requestor);
  if (!requestor) {
    return res.status(404).json({ error: 'Requestor not found' });
  }
  
  res.json({
    ...offering,
    requestor: {
      _id: requestor._id,
      username: requestor.username,
      email: requestor.email,
      rating: requestor.rating,
      completedJobs: requestor.completedJobs
    }
  });
});

// Apply to offering endpoint
app.post('/api/offerings/:id/apply', (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Determine which user is applying based on token
  let userId = '1'; // Default to demo user
  
  // For demo purposes, check if it's a new user token
  if (token === 'new-user-token-123') {
    // Find the most recently created user (last in the array)
    userId = users[users.length - 1]._id;
  }
  
  const offering = offerings.find(o => o._id === req.params.id);
  if (!offering) {
    return res.status(404).json({ error: 'Offering not found' });
  }
  
  // Check if user already applied
  const existingApplication = applications.find(app => 
    app.offering === req.params.id && app.applicant === userId
  );
  
  if (existingApplication) {
    return res.status(400).json({ error: 'You have already applied to this job' });
  }
  
  // Create new application
  const newApplication = {
    _id: 'app_' + (applications.length + 1),
    offering: req.params.id,
    applicant: userId,
    message: req.body.message || '',
    status: 'pending',
    appliedAt: new Date().toISOString()
  };
  
  applications.push(newApplication);
  
  // Update applications count
  offering.applicationsCount = (offering.applicationsCount || 0) + 1;
  
  res.status(201).json({ 
    message: 'Application submitted successfully',
    application: newApplication
  });
});

// Check if user has applied to a specific job
app.get('/api/offerings/:id/applied', (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Determine which user is checking based on token
  let userId = '1'; // Default to demo user
  
  // For demo purposes, check if it's a new user token
  if (token === 'new-user-token-123') {
    // Find the most recently created user (last in the array)
    userId = users[users.length - 1]._id;
  }
  
  const application = applications.find(app => 
    app.offering === req.params.id && app.applicant === userId
  );
  
  res.json({ 
    hasApplied: !!application,
    application: application || null
  });
});

// Get applicants for a specific job
app.get('/api/offerings/:id/applicants', (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Determine which user is checking based on token
  let userId = '1'; // Default to demo user
  
  // For demo purposes, check if it's a new user token
  if (token === 'new-user-token-123') {
    // Find the most recently created user (last in the array)
    userId = users[users.length - 1]._id;
  }
  
  const offering = offerings.find(o => o._id === req.params.id);
  if (!offering) {
    return res.status(404).json({ error: 'Offering not found' });
  }
  
  // Check if user owns this offering
  if (offering.requestor !== userId) {
    return res.status(403).json({ error: 'Not authorized to view applicants for this job' });
  }
  
  // Get applications for this job with user details
  const jobApplications = applications.filter(app => app.offering === req.params.id);
  const applicantsWithDetails = jobApplications.map(app => {
    const applicantUser = users.find(u => u._id === app.applicant);
    return {
      ...app,
      applicantDetails: applicantUser ? {
        username: applicantUser.username,
        email: applicantUser.email,
        rating: applicantUser.rating,
        completedJobs: applicantUser.completedJobs,
        createdAt: applicantUser.createdAt
      } : null
    };
  });
  
  res.json(applicantsWithDetails);
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
  
  const offering = offerings[offeringIndex];
  
  // For demo purposes, allow deletion of any offering
  // In production, you'd check if the user owns this offering
  offerings.splice(offeringIndex, 1);
  
  // Update the user's createdJobs count
  const user = users.find(u => u._id === offering.requestor);
  if (user && user.createdJobs > 0) {
    user.createdJobs -= 1;
  }
  
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
  
  // Check if user already exists
  const existingUser = users.find(u => u.username === username || u.email === email);
  if (existingUser) {
    res.status(400).json({ error: 'User already exists' });
    return;
  }
  
  const newUser = {
    _id: (users.length + 1).toString(),
    username,
    email,
    rating: 0.0,
    completedJobs: 0,
    createdJobs: 0,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };
  
  // Add user to in-memory store
  users.push(newUser);
  
  res.cookie('token', 'new-user-token-123', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  });
  
  res.status(201).json({
    message: 'Registration successful',
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      rating: newUser.rating,
      completedJobs: newUser.completedJobs,
      createdAt: newUser.createdAt
    },
    token: 'new-user-token-123'
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

app.get('/api/auth/profile', (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // Find user by token (for demo, we'll use a simple mapping)
  // In production, you'd decode the JWT token to get user ID
  let userId = '1'; // Default to demo user
  
  // For demo purposes, check if it's a new user token
  if (token === 'new-user-token-123') {
    // Find the most recently created user (last in the array)
    userId = users[users.length - 1]._id;
  }
  
  const user = users.find(u => u._id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ 
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      rating: user.rating,
      completedJobs: user.completedJobs,
      createdAt: user.createdAt
    }
  });
});

// Get completed jobs for a user
app.get('/api/users/:userId/completed-jobs', (req, res) => {
  const { userId } = req.params;
  
  const userCompletedJobs = completedJobs.filter(job => job.completedBy === userId);
  
  // Add user information for each completed job
  const jobsWithUserInfo = userCompletedJobs.map(job => {
    const completedForUser = users.find(u => u._id === job.completedFor);
    return {
      ...job,
      completedForUser: completedForUser ? {
        username: completedForUser.username,
        email: completedForUser.email
      } : null
    };
  });
  
  res.json(jobsWithUserInfo);
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
