import mongoose from 'mongoose';

let dbConnected = false;

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.warn('⚠️ WARNING: MONGODB_URI not defined in environment. Running in mockup in-memory mode.');
    global.dbConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    global.dbConnected = true;
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Running in mockup in-memory mode due to database connection failure.');
    global.dbConnected = false;
    return false;
  }
};

export default connectDB;