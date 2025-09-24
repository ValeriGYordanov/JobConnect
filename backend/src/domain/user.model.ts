import { Schema, model, type Document } from 'mongoose';

export interface User extends Document {
  email: string;
  displayName: string;
  passwordHash?: string;
  avatarUrl?: string;
  ratingAverage: number; // 0..5
  ratingCount: number;
  roles: string[]; // e.g., ["user" | "admin"]
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true },
    passwordHash: { type: String },
    avatarUrl: { type: String },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    roles: { type: [String], default: ['user'] },
  },
  { timestamps: true }
);

export const UserModel = model<User>('User', userSchema);


