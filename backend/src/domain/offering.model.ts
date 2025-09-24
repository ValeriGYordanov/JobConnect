import { Schema, model, type Document, Types } from 'mongoose';

export interface GeoPoint {
  lat: number; // Y
  lng: number; // X
}

export interface Offering extends Document {
  type: string; // e.g., "job" | future types
  label: string;
  description?: string;
  location: GeoPoint;
  paymentPerHour: number;
  maxHours: number;
  requestor: Types.ObjectId; // ref User
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const offeringSchema = new Schema<Offering>(
  {
    type: { type: String, required: true, index: true },
    label: { type: String, required: true },
    description: { type: String },
    location: {
      lat: { type: Number, required: true, index: true },
      lng: { type: Number, required: true, index: true },
    },
    paymentPerHour: { type: Number, required: true, index: true },
    maxHours: { type: Number, required: true },
    requestor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    applicationsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const OfferingModel = model<Offering>('Offering', offeringSchema);


