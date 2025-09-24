import { Router } from 'express';
import { listOfferings, createOffering, getOffering } from './offering.controllers';

export const offeringRouter = Router();

offeringRouter.get('/', listOfferings);
offeringRouter.post('/', createOffering);
offeringRouter.get('/:id', getOffering);


