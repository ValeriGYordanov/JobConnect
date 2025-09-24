import type { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In-memory user storage for demo purposes
// In production, this would be in MongoDB
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  rating: number;
  completedJobs: number;
  createdAt: string;
}

let users: User[] = [
  // Default demo user
  {
    id: '1',
    username: 'demo',
    email: 'demo@jobconnect.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "demo" hashed
    rating: 4.8,
    completedJobs: 15,
    createdAt: new Date().toISOString()
  }
];

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Validation schemas
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Helper function to generate JWT token
function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Helper function to verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Login controller
export async function login(req: Request, res: Response) {
  try {
    const { username, password } = loginSchema.parse(req.body);
    
    // Find user by username or email
    const user = users.find(u => u.username === username || u.email === username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Register controller
export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = users.find(u => u.username === username || u.email === email);
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser: User = {
      id: (users.length + 1).toString(),
      username,
      email,
      password: hashedPassword,
      rating: 5.0,
      completedJobs: 0,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Generate token
    const token = generateToken(newUser);
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'Registration successful',
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Logout controller
export async function logout(req: Request, res: Response) {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
}

// Get profile controller
export async function getProfile(req: Request, res: Response) {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create demo user controller
export async function createDemoUser(req: Request, res: Response) {
  try {
    // Check if demo user already exists
    const existingDemoUser = users.find(u => u.username === 'demo');
    
    if (existingDemoUser) {
      return res.json({ 
        message: 'Demo user already exists',
        user: { username: 'demo', password: 'demo' }
      });
    }
    
    // Create demo user
    const demoUser: User = {
      id: '1',
      username: 'demo',
      email: 'demo@jobconnect.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "demo" hashed
      rating: 4.8,
      completedJobs: 15,
      createdAt: new Date().toISOString()
    };
    
    users.unshift(demoUser); // Add to beginning of array
    
    res.status(201).json({
      message: 'Demo user created successfully',
      user: { username: 'demo', password: 'demo' }
    });
    
  } catch (error) {
    console.error('Create demo user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
