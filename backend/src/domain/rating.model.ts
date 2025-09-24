import { Schema, model, type Document, Types } from 'mongoose';

export interface Rating extends Document {
  rater: Types.ObjectId; // User who rates
  ratee: Types.ObjectId; // User being rated
  offering: Types.ObjectId; // Related offering
  score: number; // 0..5
  comment?: string;
  anonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<Rating>(
  {
    rater: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ratee: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    offering: { type: Schema.Types.ObjectId, ref: 'Offering', required: true, index: true },
    score: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String },
    anonymous: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ratingSchema.index({ rater: 1, offering: 1 }, { unique: true });

export const RatingModel = model<Rating>('Rating', ratingSchema);


