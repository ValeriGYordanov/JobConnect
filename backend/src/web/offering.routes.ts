import { Router } from 'express';
import { listOfferings, createOffering, getOffering } from './offering.controllers.js';

export const offeringRouter = Router();

offeringRouter.get('/', listOfferings);
offeringRouter.post('/', createOffering);
offeringRouter.get('/:id', getOffering);


