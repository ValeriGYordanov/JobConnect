import type { Request, Response } from 'express';
import { z } from 'zod';
import { OfferingModel } from '../domain/offering.model';
import { UserModel } from '../domain/user.model';
import { ApplicationModel } from '../domain/application.model';

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
});

export async function createOffering(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });
  const data = parsed.data;

  // Get user from token (middleware sets req.user)
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  // For now, we'll use the in-memory user system
  // In production, this would query the database
  const requestor = { _id: userId };

  const created = await OfferingModel.create({ ...data, requestor: requestor._id });
  res.status(201).json(created);
}

export async function getOffering(req: Request, res: Response) {
  const item = await OfferingModel.findById(req.params.id).populate('requestor', 'username email rating completedJobs');
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
}

const applySchema = z.object({
  message: z.string().optional(),
});

export async function applyToOffering(req: Request, res: Response) {
  const parsed = applySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });
  const { message } = parsed.data;

  const offering = await OfferingModel.findById(req.params.id);
  if (!offering) return res.status(404).json({ error: 'Offering not found' });

  // Get user from token (middleware sets req.user)
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  // Check if user already applied
  const existingApplication = await ApplicationModel.findOne({
    offering: offering._id,
    applicant: userId
  });
  if (existingApplication) {
    return res.status(400).json({ error: 'Already applied to this offering' });
  }

  // Create application
  const application = await ApplicationModel.create({
    offering: offering._id,
    applicant: userId,
    message
  });

  // Update applications count
  await OfferingModel.findByIdAndUpdate(offering._id, {
    $inc: { applicationsCount: 1 }
  });

  res.status(201).json({ message: 'Application submitted successfully', application });
}

const updateSchema = z.object({
  label: z.string().min(3).optional(),
  description: z.string().optional(),
  location: z.object({ lat: z.number(), lng: z.number() }).optional(),
  paymentPerHour: z.number().positive().optional(),
  maxHours: z.number().positive().optional(),
});

export async function updateOffering(req: Request, res: Response) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });
  const data = parsed.data;

  // Get user from token (middleware sets req.user)
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const offering = await OfferingModel.findById(req.params.id);
  if (!offering) return res.status(404).json({ error: 'Offering not found' });

  // Check if user owns this offering
  if (offering.requestor.toString() !== userId) {
    return res.status(403).json({ error: 'Not authorized to update this offering' });
  }

  const updated = await OfferingModel.findByIdAndUpdate(
    req.params.id,
    { ...data, updatedAt: new Date() },
    { new: true }
  );

  res.json(updated);
}

export async function deleteOffering(req: Request, res: Response) {
  // Get user from token (middleware sets req.user)
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const offering = await OfferingModel.findById(req.params.id);
  if (!offering) return res.status(404).json({ error: 'Offering not found' });

  // Check if user owns this offering
  if (offering.requestor.toString() !== userId) {
    return res.status(403).json({ error: 'Not authorized to delete this offering' });
  }

  await OfferingModel.findByIdAndDelete(req.params.id);

  res.json({ message: 'Offering deleted successfully' });
}


