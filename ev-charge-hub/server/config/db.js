import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Option 1: Define uri first
    const uri = process.env.MONGO_URI;
    
    // Option 2: Use the connection string directly
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      // Remove edTopology if it's present
    });
    
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;