import { Router } from 'express';
import { listOfferings, createOffering, getOffering, applyToOffering, updateOffering, deleteOffering } from './offering.controllers';
import { authenticateToken } from './auth.middleware';

export const offeringRouter = Router();

offeringRouter.get('/', listOfferings);
offeringRouter.post('/', authenticateToken, createOffering);
offeringRouter.get('/:id', getOffering);
offeringRouter.put('/:id', authenticateToken, updateOffering);
offeringRouter.delete('/:id', authenticateToken, deleteOffering);
offeringRouter.post('/:id/apply', authenticateToken, applyToOffering);


