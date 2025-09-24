import type { Request, Response } from 'express';
import { z } from 'zod';
import { OfferingModel } from '../domain/offering.model.js';
import { UserModel } from '../domain/user.model.js';

const listQuerySchema = z.object({
  q: z.string().optional(),
  minPay: z.coerce.number().optional(),
  maxPay: z.coerce.number().optional(),
  type: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radiusKm: z.coerce.number().optional(),
});

export async function listOfferings(req: Request, res: Response) {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid query' });
  const { q, minPay, maxPay, type, lat, lng, radiusKm } = parsed.data;

  const filter: any = {};
  if (type) filter.type = type;
  if (typeof minPay === 'number' || typeof maxPay === 'number') {
    filter.paymentPerHour = {};
    if (typeof minPay === 'number') filter.paymentPerHour.$gte = minPay;
    if (typeof maxPay === 'number') filter.paymentPerHour.$lte = maxPay;
  }
  if (q) filter.$text = { $search: q };

  // Simple bounding-box filter for radius if provided
  if (lat !== undefined && lng !== undefined && radiusKm) {
    const d = radiusKm / 111; // approx deg per km
    filter['location.lat'] = { $gte: lat - d, $lte: lat + d };
    filter['location.lng'] = { $gte: lng - d, $lte: lng + d };
  }

  const items = await OfferingModel.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json(items);
}

const createSchema = z.object({
  type: z.string().default('job'),
  label: z.string().min(3),
  description: z.string().optional(),
  location: z.object({ lat: z.number(), lng: z.number() }),
  paymentPerHour: z.number().positive(),
  maxHours: z.number().positive(),
  requestorId: z.string(),
});

export async function createOffering(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });
  const { requestorId, ...data } = parsed.data;

  const requestor = await UserModel.findById(requestorId);
  if (!requestor) return res.status(400).json({ error: 'Invalid requestorId' });

  const created = await OfferingModel.create({ ...data, requestor: requestor._id });
  res.status(201).json(created);
}

export async function getOffering(req: Request, res: Response) {
  const item = await OfferingModel.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
}


