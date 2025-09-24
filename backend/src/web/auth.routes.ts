import { Router } from 'express';
import { login, register, logout, getProfile, createDemoUser } from './auth.controllers';

export const authRouter = Router();

// Auth routes
authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/logout', logout);
authRouter.get('/profile', getProfile);
authRouter.post('/demo-user', createDemoUser); // Create demo user endpoint
