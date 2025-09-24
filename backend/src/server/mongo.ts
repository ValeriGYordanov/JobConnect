import mongoose from 'mongoose';

export async function connectToDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/joboffers';
  await mongoose.connect(uri);
}


