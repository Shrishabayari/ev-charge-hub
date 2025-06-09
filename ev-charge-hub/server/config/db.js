import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    // Remove deprecated options - they're not needed in MongoDB driver v4.0.0+
    await mongoose.connect(uri);
    
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;