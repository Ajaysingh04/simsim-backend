import mongoose from 'mongoose';

// Disable buffering so queries don't hang 10-30 seconds if MongoDB is not connected
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/appsica', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Error: ${error.message}`);
    console.warn('Proceeding in sandbox mockup mode (Database operations will fail, fallback mocks will be active)');
  }
};

export default connectDB;
