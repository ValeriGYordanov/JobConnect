import { Schema, model, type Document, Types } from 'mongoose';

export interface Application extends Document {
  offering: Types.ObjectId; // ref Offering
  applicant: Types.ObjectId; // ref User
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<Application>(
  {
    offering: { type: Schema.Types.ObjectId, ref: 'Offering', required: true, index: true },
    applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    message: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'withdrawn'], default: 'pending' },
  },
  { timestamps: true }
);

applicationSchema.index({ offering: 1, applicant: 1 }, { unique: true });

export const ApplicationModel = model<Application>('Application', applicationSchema);


